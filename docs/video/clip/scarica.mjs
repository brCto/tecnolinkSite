/**
 * Scarica le clip di repertorio usate nel video, dopo aver ricontrollato che
 * ognuna sia ancora sotto la licenza libera di Mixkit.
 *
 *   node clip/scarica.mjs            # scarica quello che manca
 *   node clip/scarica.mjs --ricontrolla  # riverifica le licenze senza scaricare
 *
 * Perché la verifica sta nel codice e non in una nota: Mixkit ha DUE licenze per
 * i video e dall'URL del file non si distinguono.
 *
 *   Free License        uso commerciale, pubblicità e social aziendali permessi,
 *                       nessuna attribuzione richiesta.  ← le uniche che usiamo
 *   Restricted License  "personal projects only": vieta esplicitamente progetti
 *                       commerciali, pubblicità, social aziendali e YouTube.
 *
 * Un video istituzionale di Tecnolink è a tutti gli effetti un uso commerciale,
 * quindi una clip Restricted qui dentro sarebbe una violazione. Se Mixkit
 * cambia la licenza di una clip, questo script se ne accorge e si ferma.
 *
 * I file .mp4 non sono versionati (sono decine di MB e si riscaricano da qui):
 * chi clona il repo lancia questo comando prima di `node registra.mjs`.
 */

import { existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLIP } from './elenco.mjs';

const qui = dirname(fileURLToPath(import.meta.url));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150 Safari/537.36';

const RISOLUZIONE = 720;   // le 1080 non ci sono per tutte, e la clip sta sotto una velatura scura

const soloControllo = process.argv.includes('--ricontrolla');
mkdirSync(qui, { recursive: true });

const attesa = ms => new Promise(r => setTimeout(r, ms));

/**
 * Richiesta con passo lento e ritentativi: mixkit.co sta dietro Cloudflare e a
 * raffica risponde 429. Meglio metterci qualche secondo in più che vedersi
 * rifiutare il controllo della licenza e scambiarlo per un problema di licenza.
 */
async function chiedi(url, tentativi = 5) {
  for (let i = 0; i < tentativi; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (r.status !== 429) return r;
    const pausa = 3000 * Math.pow(2, i);
    console.log(`  (429 da Cloudflare, riprovo fra ${pausa / 1000} s)`);
    await attesa(pausa);
  }
  return fetch(url, { headers: { 'User-Agent': UA } });
}

let problemi = 0;
let prima = true;

for (const clip of CLIP) {
  if (!prima) await attesa(2500);
  prima = false;
  const destinazione = resolve(qui, `${clip.nome}-${clip.id}.mp4`);

  const risposta = await chiedi(`https://mixkit.co/free-stock-video/${clip.slug}/`);
  const pagina = await risposta.text();
  if (!risposta.ok) {
    console.log(`✗ ${clip.nome} (${clip.id}) — licenza non verificabile: HTTP ${risposta.status}`);
    problemi++;
    continue;
  }
  const libera = /data-license="videoFree"/.test(pagina);
  const ristretta = /data-license="videoRestricted"/.test(pagina);

  if (!libera) {
    console.log(`✗ ${clip.nome} (${clip.id}) — licenza ${ristretta ? 'RESTRICTED: non utilizzabile in un video aziendale' : 'non riconosciuta'}`);
    console.log(`  https://mixkit.co/free-stock-video/${clip.slug}/`);
    problemi++;
    continue;
  }

  if (soloControllo) { console.log(`✓ ${clip.nome} (${clip.id}) — Free License`); continue; }

  if (existsSync(destinazione)) {
    console.log(`✓ ${clip.nome} (${clip.id}) — Free License · già scaricata (${(statSync(destinazione).size / 1e6).toFixed(1)} MB)`);
    continue;
  }

  const scarico = await chiedi(`https://assets.mixkit.co/videos/${clip.id}/${clip.id}-${RISOLUZIONE}.mp4`);
  if (!scarico.ok) {
    console.log(`✗ ${clip.nome} (${clip.id}) — scaricamento fallito: HTTP ${scarico.status}`);
    problemi++;
    continue;
  }
  writeFileSync(destinazione, Buffer.from(await scarico.arrayBuffer()));
  console.log(`✓ ${clip.nome} (${clip.id}) — Free License · scaricata (${(statSync(destinazione).size / 1e6).toFixed(1)} MB)`);
}

console.log(problemi
  ? `\n${problemi} clip da sostituire: cercane un'altra su mixkit.co con la Free License e cambia l'id in CLIP.`
  : '\nTutte le clip hanno la Free License di Mixkit (uso commerciale consentito, nessuna attribuzione richiesta).');

process.exit(problemi ? 1 : 0);
