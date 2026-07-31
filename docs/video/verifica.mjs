/**
 * Verifica i video prodotti: li apre davvero in un lettore, ne legge durata e
 * risoluzione ed estrae qualche fotogramma in PNG.
 *
 *   node verifica.mjs
 *
 * Controllare la dimensione del file non basta: un MP4 troncato o con l'header
 * sbagliato pesa comunque. Qui il video viene decodificato, quindi se questo
 * script passa il file si apre anche altrove.
 */

import { readdirSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { avviaEdge } from './cdp.mjs';

const qui = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(qui, 'mp4');
const proveDir = resolve(qui, 'verifica');
mkdirSync(proveDir, { recursive: true });

const video = readdirSync(outDir).filter(f => /\.(mp4|webm)$/.test(f));
if (!video.length) {
  console.error('Nessun video in mp4/. Lancia prima: node registra.mjs');
  process.exit(1);
}

const PEZZO = 3 * 1024 * 1024;

const edge = await avviaEdge();
let problemi = 0;

try {
  const sessione = await edge.apri('about:blank');

  for (const nome of video) {
    console.log(`\n▶ ${nome}`);

    // Il file viene caricato nella pagina a pezzi e ricomposto in un blob.
    // Un `src` su file:// verrebbe respinto da Chromium ("media load rejected
    // by URL safety check") e in più contaminerebbe il canvas, impedendo di
    // estrarre i fotogrammi.
    const byte = readFileSync(resolve(outDir, nome));
    await edge.valuta(sessione, 'window.__pezzi = []; true');
    for (let o = 0; o < byte.length; o += PEZZO) {
      const b64 = byte.subarray(o, o + PEZZO).toString('base64');
      await edge.valuta(sessione, `(() => {
        const s = atob(${JSON.stringify(b64)});
        const u = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
        window.__pezzi.push(u);
        return true;
      })()`, { timeout: 120000 });
    }

    const info = JSON.parse(await edge.valuta(sessione, `(async () => {
      const blob = new Blob(window.__pezzi, { type: 'video/mp4' });
      const v = document.createElement('video');
      v.src = URL.createObjectURL(blob);
      v.muted = true;
      await new Promise((ok, ko) => {
        v.onloadedmetadata = ok;
        v.onerror = () => ko(new Error('il file non si apre come video'));
        setTimeout(() => ko(new Error('metadati non arrivati entro 30 s')), 30000);
      });
      window.__v = v;
      return JSON.stringify({ durata: v.duration, larghezza: v.videoWidth, altezza: v.videoHeight });
    })()`, { timeout: 45000 }));

    console.log(`  ${info.larghezza}×${info.altezza} · ${info.durata.toFixed(2)} s`);
    if (!info.larghezza || !info.altezza) { console.log('  ✗ nessuna traccia video'); problemi++; continue; }

    // Tre punti sparsi: se l'ultimo si decodifica, il file non è troncato.
    const istanti = [1.5, info.durata / 2, Math.max(0, info.durata - 1.2)];
    for (const t of istanti) {
      const dataURL = await edge.valuta(sessione, `(async () => {
        const v = window.__v;
        await new Promise((ok, ko) => {
          v.onseeked = ok;
          setTimeout(() => ko(new Error('seek a ${t.toFixed(2)} s non completato')), 20000);
          v.currentTime = ${t};
        });
        const c = document.createElement('canvas');
        c.width = v.videoWidth; c.height = v.videoHeight;
        c.getContext('2d').drawImage(v, 0, 0);
        return c.toDataURL('image/png');
      })()`, { timeout: 30000 });

      const file = `${nome.replace(/\.\w+$/, '')}-${t.toFixed(1)}s.png`;
      writeFileSync(resolve(proveDir, file), Buffer.from(dataURL.split(',')[1], 'base64'));
      console.log(`  fotogramma a ${t.toFixed(1)} s → verifica/${file}`);
    }
  }
} finally {
  await edge.chiudi();
}

console.log(problemi ? `\n${problemi} file con problemi.` : '\nTutti i video si aprono e si decodificano.');
process.exit(problemi ? 1 : 0);
