/**
 * Estrae dal video un fotogramma e lo salva come JPEG, per usarlo come `poster`
 * del video sulla home.
 *
 *   node poster.mjs                     # dal 30 s muto, a 3,5 s (il logo)
 *   node poster.mjs --istante 12        # un altro momento
 *   node poster.mjs --video mp4/x.mp4 --uscita ../../tecnolinkSite/wwwroot/img/p.jpg
 *
 * Il poster è quello che si vede finché il video non parte — e con
 * `preload="none"` è l'unica cosa che si scarica finché non si arriva lì. Quindi
 * va bene un JPEG da poche decine di KB, non un PNG da due mega.
 *
 * Il fotogramma si prende decodificando il video, non ridisegnando la scena:
 * così il poster è davvero identico a quello che si vedrà, compresa la clip.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { avviaEdge } from './cdp.mjs';

const qui = dirname(fileURLToPath(import.meta.url));
const argomenti = process.argv.slice(2);
const valore = (nome, difetto) => {
  const i = argomenti.indexOf(nome);
  return i >= 0 ? argomenti[i + 1] : difetto;
};

const video = resolve(qui, valore('--video', 'mp4/tecnolink-presentazione-30s-muto-1280x720.mp4'));
const uscita = resolve(qui, valore('--uscita', '../../tecnolinkSite/wwwroot/img/video-presentazione-poster.jpg'));
const istante = Number(valore('--istante', 3.5));
const qualita = Number(valore('--qualita', 0.82));

const PEZZO = 3 * 1024 * 1024;
const byte = readFileSync(video);

const edge = await avviaEdge();
try {
  const s = await edge.apri('about:blank');

  // Come in verifica.mjs: da file:// Chromium rifiuta i media, quindi il video
  // viaggia a pezzi e si ricompone in un Blob dentro la pagina.
  await edge.valuta(s, 'window.__pezzi = []; true');
  for (let o = 0; o < byte.length; o += PEZZO) {
    const b64 = byte.subarray(o, o + PEZZO).toString('base64');
    await edge.valuta(s, `(() => {
      const b = atob(${JSON.stringify(b64)});
      const u = new Uint8Array(b.length);
      for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
      window.__pezzi.push(u);
      return true;
    })()`, { timeout: 120000 });
  }

  const dataURL = await edge.valuta(s, `(async () => {
    const v = document.createElement('video');
    v.src = URL.createObjectURL(new Blob(window.__pezzi, { type: 'video/mp4' }));
    v.muted = true;
    await new Promise((ok, ko) => {
      v.onloadedmetadata = ok;
      v.onerror = () => ko(new Error('il file non si apre come video'));
      setTimeout(() => ko(new Error('metadati non arrivati')), 30000);
    });
    await new Promise((ok, ko) => {
      v.onseeked = ok;
      setTimeout(() => ko(new Error('seek non completato')), 20000);
      v.currentTime = ${istante};
    });
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    return c.toDataURL('image/jpeg', ${qualita});
  })()`, { timeout: 60000 });

  mkdirSync(dirname(uscita), { recursive: true });
  const dati = Buffer.from(dataURL.split(',')[1], 'base64');
  writeFileSync(uscita, dati);
  console.log(`poster a ${istante} s → ${uscita.replace(/\\/g, '/')} — ${(dati.length / 1024).toFixed(0)} KB`);
} finally {
  await edge.chiudi();
}

await new Promise(ok => process.stdout.write('', ok));
process.exit(0);
