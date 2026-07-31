/**
 * Provini: estrae singoli fotogrammi in PNG senza registrare tutto il video.
 *
 *   node provini.mjs                              # un fotogramma per scena, 16x9, montaggio lungo
 *   node provini.mjs --montaggio breve            # idem sul montaggio da 30 s, con le clip
 *   node provini.mjs --montaggio breve 9x16       # in verticale
 *   node provini.mjs 3 12 47.5                    # gli istanti indicati, in secondi
 *
 * Serve per controllare impaginazione e leggibilità mentre si lavora ai testi:
 * una registrazione completa costa quanto dura il video, un provino è immediato.
 * I PNG finiscono in `provini/`.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { avviaEdge } from './cdp.mjs';
import { inviaClip } from './risorse.mjs';
import { CLIP } from './clip/elenco.mjs';

const qui = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(qui, 'provini');
const pagina = resolve(qui, 'pagina/index.html').replace(/\\/g, '/');

const FORMATI = {
  '16x9': { larghezza: 1920, altezza: 1080 },
  '9x16': { larghezza: 1080, altezza: 1920 },
  '16x9-720': { larghezza: 1280, altezza: 720 },
  '9x16-720': { larghezza: 720, altezza: 1280 },
};

const argomenti = process.argv.slice(2);
const chiave = argomenti.find(a => FORMATI[a]) || '16x9';
const i = argomenti.indexOf('--montaggio');
const breve = i >= 0 && argomenti[i + 1] === 'breve';
// `Number` e non `parseFloat`: "16x9" per parseFloat vale 16, e finirebbe fra gli istanti.
const istantiChiesti = argomenti.map(Number).filter(n => Number.isFinite(n));
const f = FORMATI[chiave];

mkdirSync(outDir, { recursive: true });

const edge = await avviaEdge({ larghezza: f.larghezza, altezza: f.altezza });
try {
  const url = `file:///${pagina}?formato=${chiave}&registra=1${breve ? '&montaggio=breve' : ''}`;
  const sessione = await edge.apri(url);

  if (breve) {
    const mancanti = await inviaClip(edge, sessione, resolve(qui, 'clip'), CLIP);
    if (mancanti.length) console.log(`  ⚠ clip mancanti (${mancanti.join(', ')}): lancia "node clip/scarica.mjs"`);
  }
  await edge.valuta(sessione, 'tkPrepara()', { timeout: 120000 });

  // Senza istanti espliciti si prende il momento in cui ogni scena è completa:
  // poco prima della fine, quando tutti gli elementi sono già entrati.
  let istanti = istantiChiesti;
  if (!istanti.length) {
    const scaletta = JSON.parse(await edge.valuta(sessione, `(() => {
      const c = ${breve ? 'TK_CONTENUTI_BREVE' : 'TK_CONTENUTI'};
      let t = 0;
      return JSON.stringify(c.scene.map(s => { const v = { fine: t + s.secondi }; t += s.secondi; return v; }));
    })()`));
    istanti = scaletta.map(s => Math.round((s.fine - (breve ? 0.5 : 0.8)) * 10) / 10);
  }

  for (const t of istanti) {
    const dataURL = await edge.valuta(sessione, `(async () => {
      await TK.preparaFotogramma(${t});
      TK.disegna(${t});
      return document.getElementById('scena').toDataURL('image/png');
    })()`, { timeout: 60000 });
    const nome = `${breve ? 'breve-' : ''}${chiave}-${String(t).padStart(5, '0')}s.png`;
    writeFileSync(resolve(outDir, nome), Buffer.from(dataURL.split(',')[1], 'base64'));
    console.log(`  provini/${nome}`);
  }
} finally {
  await edge.chiudi();
}

// Come in `registra.mjs`: Edge e il WebSocket lasciano handle aperti e senza
// questo node resta appeso a lavoro finito. Qui capita di rado, ma capita.
await new Promise(ok => process.stdout.write('', ok));
process.exit(0);
