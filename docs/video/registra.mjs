/**
 * Registra il video di presentazione aprendo `pagina/index.html` in Edge headless
 * e incidendo il canvas con MediaRecorder.
 *
 *   node registra.mjs                          # montaggio lungo, 1:29, senza audio
 *   node registra.mjs --montaggio breve        # 30 s con clip e musica
 *   node registra.mjs --montaggio breve --voce # 30 s con musica e narratore
 *   node registra.mjs --montaggio breve 16x9   # un formato solo
 *   node registra.mjs --bitrate 6              # qualità diversa, in Mbps
 *
 * La registrazione va in tempo reale, quindi ogni formato costa quanto dura il
 * video. I file finiscono in `mp4/`.
 */

import { mkdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { avviaEdge } from './cdp.mjs';
import { inviaClip, inviaVoce, ritiraVideo } from './risorse.mjs';
import { CLIP } from './clip/elenco.mjs';

const qui = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(qui, 'mp4');
const pagina = resolve(qui, 'pagina/index.html').replace(/\\/g, '/');

const FORMATI = {
  '16x9': { larghezza: 1920, altezza: 1080, suffisso: '1920x1080' },
  '9x16': { larghezza: 1080, altezza: 1920, suffisso: '1080x1920' },
};

const argomenti = process.argv.slice(2);
const valore = (nome, difetto) => {
  const i = argomenti.indexOf(nome);
  return i >= 0 ? argomenti[i + 1] : difetto;
};

const montaggio = valore('--montaggio', 'lungo');
const conVoce = argomenti.includes('--voce');
const bitrate = Number(valore('--bitrate', 4)) * 1_000_000;
const richiesti = argomenti.filter(a => FORMATI[a]);
const daFare = richiesti.length ? richiesti : Object.keys(FORMATI);

if (montaggio !== 'breve' && montaggio !== 'lungo') {
  console.error('--montaggio accetta "breve" o "lungo".');
  process.exit(1);
}
const breve = montaggio === 'breve';
if (conVoce && !breve) {
  console.error('La voce narrante esiste solo per il montaggio breve.');
  process.exit(1);
}

const nomeBase = breve
  ? `tecnolink-presentazione-30s${conVoce ? '-voce' : ''}`
  : 'tecnolink-presentazione';

mkdirSync(outDir, { recursive: true });

for (const chiave of daFare) {
  const f = FORMATI[chiave];
  console.log(`\n▶ ${montaggio} · ${chiave} — ${f.larghezza}×${f.altezza}, ${(bitrate / 1e6).toFixed(1)} Mbps${breve ? (conVoce ? ', musica e voce' : ', musica') : ''}`);

  const edge = await avviaEdge({ larghezza: f.larghezza, altezza: f.altezza });
  try {
    const url = `file:///${pagina}?formato=${chiave}&registra=1${breve ? '&montaggio=breve' : ''}`;
    const sessione = await edge.apri(url);

    if (breve) {
      const mancanti = await inviaClip(edge, sessione, resolve(qui, 'clip'), CLIP);
      if (mancanti.length) {
        console.log(`  ⚠ clip mancanti (${mancanti.join(', ')}): lancia "node clip/scarica.mjs"`);
      }
      if (conVoce) {
        const quante = await inviaVoce(edge, sessione, resolve(qui, 'narrazione'));
        if (!quante) console.log('  ⚠ nessuna traccia voce: lancia "node narrazione.mjs"');
      }
    }

    // I font arrivano dalla rete e le clip vanno decodificate: senza aspettare,
    // la registrazione parte su un fotogramma incompleto.
    const esito = JSON.parse(await edge.valuta(sessione, 'tkPrepara()', { timeout: 120000 }));
    console.log(`  pronto — ${esito.durata.toFixed(1)} s${esito.clip.length ? `, ${esito.clip.length} clip` : ''}`);

    console.log('  registrazione in corso…');
    const r = JSON.parse(await edge.valuta(
      sessione,
      `tkRegistra({ fps: 30, bitrate: ${bitrate}, audio: ${breve}, voce: ${conVoce} }).then(r => JSON.stringify(r))`,
      { timeout: 15 * 60 * 1000 },
    ));
    console.log(`  codec ${r.mime} · ${r.fotogrammiDisegnati} fotogrammi disegnati, ${r.fotogrammiPersi} persi`);
    console.log(`  durata ${r.secondi.toFixed(1)} s (prevista ${r.durataPrevista.toFixed(1)} s)${r.battuteVoce ? ` · ${r.battuteVoce} battute di voce` : ''}`);

    const byte = await ritiraVideo(edge, sessione, r.byte);
    const estensione = r.mime.startsWith('video/mp4') ? 'mp4' : 'webm';
    const nome = `${nomeBase}-${f.suffisso}.${estensione}`;
    const percorso = resolve(outDir, nome);
    writeFileSync(percorso, byte);
    console.log(`\r  mp4/${nome} — ${(statSync(percorso).size / 1024 / 1024).toFixed(1)} MB          `);

    if (r.fotogrammiPersi > r.fotogrammiDisegnati * 0.05) {
      console.log('  ⚠ più del 5% dei fotogrammi è saltato: la scena è troppo pesante per il tempo reale.');
    }
  } finally {
    await edge.chiudi();
  }
}

console.log('\nFatto.');
