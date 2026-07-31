/**
 * Scrive `pagina/risorse.js` con il logo del sito incorporato come data URI.
 *
 * Serve perché il video viene disegnato su un canvas e poi inciso con
 * MediaRecorder: un'immagine caricata da `file://` marca il canvas come
 * contaminato e `captureStream()` smette di funzionare. Un data URI no.
 *
 *   node genera-risorse.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const qui = dirname(fileURLToPath(import.meta.url));
const logo = resolve(qui, '../../tecnolinkSite/wwwroot/img/logo-tecnolink-bianco-180x51.png');
const uscita = resolve(qui, 'pagina/risorse.js');

const base64 = readFileSync(logo).toString('base64');

writeFileSync(uscita, `/**
 * Generato da genera-risorse.mjs — non modificare a mano.
 * Logo: tecnolinkSite/wwwroot/img/logo-tecnolink-bianco-180x51.png
 */
window.TK_RISORSE = {
  logo: 'data:image/png;base64,${base64}',
};
`);

console.log(`pagina/risorse.js scritto (${(base64.length / 1024).toFixed(1)} kB di base64).`);
