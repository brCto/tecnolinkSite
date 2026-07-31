/**
 * Genera la voce narrante del montaggio breve, una traccia per scena.
 *
 *   node narrazione.mjs
 *
 * Usa la sintesi vocale di Windows (System.Speech) con la voce italiana
 * installata sul sistema — su questa macchina "Microsoft Elsa Desktop". È una
 * voce SAPI5: si capisce benissimo ma si sente che è sintetica. Per questo il
 * video viene consegnato in due versioni, con e senza voce: la resa va giudicata
 * a orecchio, e se non convince il testo generato qui resta comunque il copione
 * pronto da far leggere a una persona.
 *
 * Ogni scena ha il suo file: così la voce si aggancia all'inizio esatto della
 * scena invece di andare alla deriva, e riscrivere una frase non obbliga a
 * rigenerare tutto il resto.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const qui = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(qui, 'narrazione');
mkdirSync(outDir, { recursive: true });

/** Legge `contenuti-breve.js` eseguendolo con una finestra finta. */
function leggiContenuti() {
  const sorgente = readFileSync(resolve(qui, 'pagina/contenuti-breve.js'), 'utf8');
  const finestra = {};
  new Function('window', sorgente)(finestra);
  return finestra.TK_CONTENUTI_BREVE;
}

/** Durata di un WAV PCM, letta dall'intestazione. */
function durataWav(percorso) {
  const b = readFileSync(percorso);
  const canali = b.readUInt16LE(22);
  const frequenza = b.readUInt32LE(24);
  const bit = b.readUInt16LE(34);
  // Il chunk "data" non è sempre subito dopo "fmt ": si cerca.
  let o = 12;
  while (o + 8 < b.length) {
    const tipo = b.toString('latin1', o, o + 4);
    const dim = b.readUInt32LE(o + 4);
    if (tipo === 'data') return dim / (frequenza * canali * (bit / 8));
    o += 8 + dim + (dim % 2);
  }
  return 0;
}

const contenuti = leggiContenuti();
const battute = contenuti.scene.map((s, i) => ({
  indice: i,
  tipo: s.tipo,
  secondi: s.secondi,
  testo: s.voce || '',
})).filter(b => b.testo);

const manifesto = battute.map(b => ({
  file: resolve(outDir, `${String(b.indice).padStart(2, '0')}-${b.tipo}.wav`),
  testo: b.testo,
}));

writeFileSync(resolve(outDir, 'manifesto.json'), JSON.stringify(manifesto, null, 2), 'utf8');

const script = resolve(qui, 'narrazione.ps1');
if (!existsSync(script)) throw new Error('narrazione.ps1 non trovato.');

console.log('Sintesi in corso…');
execFileSync('powershell.exe', [
  '-NoProfile', '-ExecutionPolicy', 'Bypass',
  '-File', script,
  '-Manifesto', resolve(outDir, 'manifesto.json'),
], { stdio: 'inherit' });

console.log('');
let eccedenze = 0;
for (const b of battute) {
  const file = resolve(outDir, `${String(b.indice).padStart(2, '0')}-${b.tipo}.wav`);
  if (!existsSync(file)) { console.log(`✗ ${b.tipo}: non generato`); continue; }
  const d = durataWav(file);
  const stretto = d > b.secondi - 0.3;
  if (stretto) eccedenze++;
  console.log(`${stretto ? '⚠' : '·'} ${b.tipo.padEnd(15)} ${d.toFixed(2)} s su ${b.secondi} s disponibili   (${(statSync(file).size / 1024).toFixed(0)} kB)`);
}

console.log(eccedenze
  ? `\n${eccedenze} battute sono al limite o troppo lunghe: accorcia il campo "voce" della scena in pagina/contenuti-breve.js.`
  : '\nTutte le battute stanno dentro la loro scena.');
