/**
 * Registra il video di presentazione aprendo `pagina/index.html` in Edge headless
 * e incidendo il canvas con MediaRecorder.
 *
 *   node registra.mjs                          # montaggio lungo, 1:29, senza audio
 *   node registra.mjs --montaggio breve        # 30 s con clip e musica
 *   node registra.mjs --montaggio breve --voce # 30 s con musica e narratore
 *   node registra.mjs --montaggio breve 16x9   # un formato solo
 *   node registra.mjs --bitrate 6              # qualità diversa, in Mbps
 *   node registra.mjs --montaggio breve --muto  # senza traccia audio, per la home
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

// Le varianti 720 non sono un ripiego di qualità: il montaggio breve monta clip
// girate a 720p, quindi a 1280×720 l'ingrandimento sparisce e la codifica costa
// meno della metà. È ciò che lo tiene dentro il tempo reale che MediaRecorder
// impone. Per un video da feed social 720p è comunque la risoluzione giusta.
const FORMATI = {
  '16x9': { larghezza: 1920, altezza: 1080, suffisso: '1920x1080' },
  '9x16': { larghezza: 1080, altezza: 1920, suffisso: '1080x1920' },
  '16x9-720': { larghezza: 1280, altezza: 720, suffisso: '1280x720' },
  '9x16-720': { larghezza: 720, altezza: 1280, suffisso: '720x1280' },
};

const argomenti = process.argv.slice(2);
const valore = (nome, difetto) => {
  const i = argomenti.indexOf(nome);
  return i >= 0 ? argomenti[i + 1] : difetto;
};

const montaggio = valore('--montaggio', 'lungo');
const conVoce = argomenti.includes('--voce');
// Muto vero, senza traccia audio: serve per il video in autoplay sulla home del
// sito. L'attributo `muted` dell'HTML basterebbe a non far uscire suono, ma la
// traccia si scaricherebbe lo stesso, e soprattutto un domani basta un `muted`
// tolto per distrazione perché la home si metta a suonare addosso a chi legge.
const muto = argomenti.includes('--muto');
const bitrate = Number(valore('--bitrate', 4)) * 1_000_000;
const richiesti = argomenti.filter(a => FORMATI[a]);

if (montaggio !== 'breve' && montaggio !== 'lungo') {
  console.error('--montaggio accetta "breve" o "lungo".');
  process.exit(1);
}
const breve = montaggio === 'breve';
if (conVoce && !breve) {
  console.error('La voce narrante esiste solo per il montaggio breve.');
  process.exit(1);
}
if (conVoce && muto) {
  console.error('--voce e --muto insieme non hanno senso.');
  process.exit(1);
}

// Senza formati espliciti si registrano i due che si consegnano, non tutti e
// quattro: ogni formato costa quanto dura il video. Il lungo esce a piena
// risoluzione, il breve a 720 — a 1080p le clip non stanno nel tempo reale.
const daFare = richiesti.length ? richiesti : (breve ? ['16x9-720', '9x16-720'] : ['16x9', '9x16']);

const conAudio = breve && !muto;

const nomeBase = breve
  ? `tecnolink-presentazione-30s${conVoce ? '-voce' : ''}${muto ? '-muto' : ''}`
  : 'tecnolink-presentazione';

mkdirSync(outDir, { recursive: true });

for (const chiave of daFare) {
  const f = FORMATI[chiave];
  const audioDetto = !breve ? '' : muto ? ', senza audio' : conVoce ? ', musica e voce' : ', musica';
  console.log(`\n▶ ${montaggio} · ${chiave} — ${f.larghezza}×${f.altezza}, ${(bitrate / 1e6).toFixed(1)} Mbps${audioDetto}`);

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
      `tkRegistra({ fps: 30, bitrate: ${bitrate}, audio: ${conAudio}, voce: ${conVoce} }).then(r => JSON.stringify(r))`,
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

// Uscire a mano non è pignoleria: dopo aver salvato i video restano aperti il
// WebSocket verso Edge e l'handle del processo, e node non esce più — resta lì
// a zero per cento di CPU, con il lavoro già finito e i file già scritti. Chi
// lancia il comando lo vede "ancora in corso" per sempre e lo interrompe a mano.
// `verifica.mjs` esce già così, per lo stesso motivo.
// Prima però si aspetta che stdout sia svuotato: su Windows la scrittura verso
// una pipe è asincrona, e uscire subito si mangerebbe proprio le ultime righe —
// quelle dei fotogrammi persi, che sono l'unico modo di sapere se la
// registrazione è venuta bene.
await new Promise(ok => process.stdout.write('', ok));
process.exit(0);
