/**
 * Client CDP minimo per pilotare Edge in headless senza dipendenze npm.
 *
 * Serve a registrare il video: la pagina disegna l'animazione su un canvas e la
 * incide con MediaRecorder, poi Node ritira il file passando da qui. Il progetto
 * non ha un package.json, quindi niente Puppeteer: bastano il WebSocket globale
 * di Node 22+ e il protocollo DevTools.
 */

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const EDGE_PATHS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];

export function trovaEdge() {
  const edge = EDGE_PATHS.find(p => existsSync(p));
  if (!edge) throw new Error('Microsoft Edge non trovato nei percorsi standard.');
  return edge;
}

const attesa = ms => new Promise(r => setTimeout(r, ms));

/**
 * Avvia Edge headless con la porta di debug aperta e restituisce una sessione
 * già agganciata a una scheda. Il profilo è temporaneo e usa e getta: con un
 * profilo condiviso, due esecuzioni ravvicinate si contendono lo stesso lock e
 * prima o poi una resta appesa senza uscire mai.
 */
export async function avviaEdge({ porta, larghezza = 1920, altezza = 1080, extra = [] } = {}) {
  // Porta a caso: due esecuzioni in parallelo (per esempio i due formati) non
  // devono contendersi la stessa porta di debug.
  porta = porta || 9200 + Math.floor(Math.random() * 600);
  const profilo = mkdtempSync(join(tmpdir(), 'tk-video-'));
  const edge = spawn(trovaEdge(), [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--mute-audio',
    '--force-device-scale-factor=1',
    `--window-size=${larghezza},${altezza}`,
    `--user-data-dir=${profilo}`,
    `--remote-debugging-port=${porta}`,
    // Senza queste, in headless il ciclo di rendering viene rallentato quando la
    // finestra è considerata non visibile: l'animazione perderebbe fotogrammi.
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-background-timer-throttling',
    '--autoplay-policy=no-user-gesture-required',
    ...extra,
    'about:blank',
  ], { stdio: 'ignore' });

  // Il browser impiega qualche istante prima di rispondere sulla porta di debug.
  let versione = null;
  for (let i = 0; i < 60 && !versione; i++) {
    try {
      versione = await (await fetch(`http://127.0.0.1:${porta}/json/version`)).json();
    } catch { await attesa(250); }
  }
  if (!versione) {
    edge.kill();
    rmSync(profilo, { recursive: true, force: true });
    throw new Error('Edge non ha aperto la porta di debug entro il tempo previsto.');
  }

  const sessione = await collega(versione.webSocketDebuggerUrl);

  return {
    ...sessione,
    async chiudi() {
      try { sessione.ws.close(); } catch { /* già chiuso */ }
      edge.kill();
      // Edge rilascia i file del profilo qualche istante dopo il kill: senza
      // ritentare, la cancellazione fallisce con EPERM e fa uscire lo script
      // dopo che il video è già stato salvato.
      for (let i = 0; i < 10; i++) {
        await attesa(400);
        try { rmSync(profilo, { recursive: true, force: true }); return; } catch { /* ritenta */ }
      }
    },
  };
}

/** Apre il WebSocket sul browser e prepara l'invio dei comandi CDP. */
async function collega(url) {
  const ws = new WebSocket(url);
  await new Promise((ok, ko) => { ws.onopen = ok; ws.onerror = () => ko(new Error('WebSocket CDP non raggiungibile.')); });

  let id = 0;
  const attese = new Map();
  const ascoltatori = new Map();

  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id !== undefined) {
      const p = attese.get(msg.id);
      if (!p) return;
      attese.delete(msg.id);
      msg.error ? p.ko(new Error(`${msg.error.message} (${JSON.stringify(msg.error.data ?? '')})`)) : p.ok(msg.result);
    } else {
      ascoltatori.get(msg.method)?.forEach(fn => fn(msg.params, msg.sessionId));
    }
  };

  const invia = (method, params = {}, sessionId) => new Promise((ok, ko) => {
    const mio = ++id;
    attese.set(mio, { ok, ko });
    ws.send(JSON.stringify({ id: mio, method, params, ...(sessionId ? { sessionId } : {}) }));
  });

  const su = (evento, fn) => {
    if (!ascoltatori.has(evento)) ascoltatori.set(evento, []);
    ascoltatori.get(evento).push(fn);
  };

  /** Apre una scheda sull'URL indicato e restituisce l'id di sessione per i comandi. */
  const apri = async (targetUrl) => {
    const { targetId } = await invia('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await invia('Target.attachToTarget', { targetId, flatten: true });
    await invia('Page.enable', {}, sessionId);
    await invia('Runtime.enable', {}, sessionId);
    const caricata = new Promise(ok => su('Page.loadEventFired', (_p, s) => { if (s === sessionId) ok(); }));
    await invia('Page.navigate', { url: targetUrl }, sessionId);
    await caricata;
    return sessionId;
  };

  /** Valuta un'espressione nella pagina, aspettando le promise. */
  const valuta = async (sessionId, espressione, { timeout = 0 } = {}) => {
    const corsa = invia('Runtime.evaluate', {
      expression: espressione,
      awaitPromise: true,
      returnByValue: true,
    }, sessionId);
    const risultato = timeout
      ? await Promise.race([corsa, attesa(timeout).then(() => { throw new Error(`Timeout dopo ${timeout} ms.`); })])
      : await corsa;
    if (risultato.exceptionDetails) {
      throw new Error(risultato.exceptionDetails.exception?.description ?? risultato.exceptionDetails.text);
    }
    return risultato.result.value;
  };

  return { ws, invia, su, apri, valuta };
}
