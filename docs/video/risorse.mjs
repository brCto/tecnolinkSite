/**
 * Passaggio dei file binari (clip di repertorio e voce narrante) da Node alla
 * pagina, e ritiro del video finito nella direzione opposta.
 *
 * In entrambi i sensi si va a pezzi: un messaggio del DevTools Protocol con
 * dentro dieci milioni di caratteri base64 fa cadere la connessione, e succede
 * a metà lavoro, dopo minuti di registrazione.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PEZZO = 3 * 1024 * 1024;

/** Manda un file alla pagina sotto il nome indicato. */
export async function inviaRisorsa(edge, sessione, nome, byte) {
  await edge.valuta(sessione, `tkRisorsaInizia(${JSON.stringify(nome)})`);
  for (let o = 0; o < byte.length; o += PEZZO) {
    const b64 = byte.subarray(o, o + PEZZO).toString('base64');
    await edge.valuta(sessione, `tkRisorsaPezzo(${JSON.stringify(nome)}, ${JSON.stringify(b64)})`, { timeout: 120000 });
  }
  return edge.valuta(sessione, `tkRisorsaFine(${JSON.stringify(nome)})`);
}

/**
 * Manda tutte le clip dichiarate in `clip/scarica.mjs`. Il nome nella pagina è
 * `clip:<nome>`, lo stesso che le scene usano nel campo `clip`.
 */
export async function inviaClip(edge, sessione, cartella, elenco) {
  const mancanti = [];
  for (const clip of elenco) {
    const percorso = resolve(cartella, `${clip.nome}-${clip.id}.mp4`);
    if (!existsSync(percorso)) { mancanti.push(clip.nome); continue; }
    const byte = readFileSync(percorso);
    await inviaRisorsa(edge, sessione, `clip:${clip.nome}`, byte);
    process.stdout.write(`\r  clip caricate: ${clip.nome}          `);
  }
  process.stdout.write('\r');
  return mancanti;
}

/**
 * Manda le tracce della voce narrante. I file si chiamano `NN-tipo.wav` e il
 * numero è l'indice della scena: è così che la pagina sa dove agganciarle.
 */
export async function inviaVoce(edge, sessione, cartella) {
  if (!existsSync(cartella)) return 0;
  const file = readdirSync(cartella).filter(f => f.endsWith('.wav'));
  for (const f of file) {
    const indice = parseInt(f.slice(0, 2), 10);
    if (Number.isNaN(indice)) continue;
    await inviaRisorsa(edge, sessione, `voce:${indice}`, readFileSync(resolve(cartella, f)));
  }
  return file.length;
}

/** Ritira il video registrato, a pezzi, e lo restituisce come Buffer. */
export async function ritiraVideo(edge, sessione, byteTotali) {
  const PEZZO_VIDEO = 4 * 1024 * 1024;
  const parti = [];
  for (let offset = 0; offset < byteTotali; offset += PEZZO_VIDEO) {
    const b64 = await edge.valuta(sessione, `tkPezzo(${offset}, ${PEZZO_VIDEO})`, { timeout: 120000 });
    parti.push(Buffer.from(b64, 'base64'));
    process.stdout.write(`\r  trasferimento ${Math.min(100, Math.round(((offset + PEZZO_VIDEO) / byteTotali) * 100))}%   `);
  }
  return Buffer.concat(parti);
}
