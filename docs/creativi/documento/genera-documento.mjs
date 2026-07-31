/**
 * Document Ad per LinkedIn — otto pagine in PDF.
 *
 * È il formato con il costo per lead più basso su LinkedIn, davanti
 * all'immagine singola, e funziona per un motivo semplice: il documento si
 * sfoglia dentro il feed, senza uscire da LinkedIn, quindi la soglia da
 * superare è "vale la pena scorrere" e non "vale la pena cliccare".
 *
 * Regole seguite qui dentro
 * -------------------------
 * - **Sotto le dieci pagine.** Oltre, la percentuale di chi arriva in fondo
 *   crolla e il documento smette di dire qualcosa su chi è interessato.
 * - **Verticale.** L'anteprima nel feed è alta: un documento orizzontale ci
 *   entra piccolo e non si legge da telefono.
 * - **Utile anche a chi non vi chiamerà.** Il contenuto che funziona è quello
 *   che regalereste volentieri: se serve solo a vendere, si vede alla seconda
 *   pagina e si smette di sfogliare.
 * - **Da tenere aperto al primo giro**, senza modulo davanti. I lead si
 *   raccolgono dopo, in retargeting su chi lo ha sfogliato: un modulo davanti
 *   a un documento che nessuno conosce ancora abbatte le aperture.
 *
 * Cosa manca
 * ----------
 * Le pagine 4 e 7 hanno dei [DA COMPILARE]: le domande vere dei questionari
 * che ricevete e una pagina di report anonimizzata. Sono le due cose che
 * rendono il documento vostro invece che generico — finché non ci sono, il
 * documento regge lo stesso, ma vale meno.
 *
 *   node genera-documento.mjs && ./render-documento.sh
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, 'html');
mkdirSync(outDir, { recursive: true });

const LOGO = 'file:///' + resolve(here, '../../../tecnolinkSite/wwwroot/img/logo-tecnolink-bianco-180x51.png').replace(/\\/g, '/');

/* ------------------------------------------------------------------ */
/* Le otto pagine                                                      */
/* ------------------------------------------------------------------ */

/**
 * Nessuna statistica: non ne avete di verificate, e su LinkedIn le
 * affermazioni non sostenibili sono il motivo più comune di segnalazione da
 * parte dei concorrenti. Dove servirebbe un dato reale c'è [DA COMPILARE].
 */
const PAGINE = [
  {
    tipo: 'copertina',
    occhiello: 'Guida per le PMI · Firenze',
    titolo: 'Sicurezza informatica: cosa vi verrà chiesto, e da chi',
    testo: 'Otto pagine su quello che oggi vi viene domandato sulla sicurezza della vostra rete — dai clienti, dalle assicurazioni, dalla normativa — e su cosa serve avere pronto per rispondere.',
    piede: 'Tecnolink · Firenze e dintorni',
  },
  {
    tipo: 'elenco',
    occhiello: 'Da dove arriva la domanda',
    titolo: 'Quattro strade diverse, la stessa richiesta.',
    intro: 'Non è più una questione tecnica: è una questione contrattuale. Chi ve lo chiede non vuole sapere se siete sicuri, vuole vedere che potete dimostrarlo.',
    voci: [
      { b: 'NIS2 — D.lgs. 138/2024', t: 'Gli obblighi di gestione del rischio si sono estesi a più settori, e toccano anche i fornitori delle aziende già obbligate.' },
      { b: 'GDPR, articolo 32', t: 'Misure di sicurezza adeguate al rischio — e la capacità di documentarle, non solo di averle adottate.' },
      { b: 'Polizze cyber', t: 'Le compagnie chiedono evidenza di controlli periodici. Prima di emettere la polizza, e di nuovo dopo un sinistro.' },
      { b: 'Clienti e gare', t: 'Le aziende strutturate girano ai fornitori i questionari di sicurezza che sono tenute a compilare.' },
    ],
  },
  {
    tipo: 'testo',
    occhiello: 'La più citata, e la più fraintesa',
    titolo: 'NIS2 in una pagina.',
    blocchi: [
      { b: 'Cosa è cambiato', t: 'Il recepimento italiano della direttiva NIS2 (D.lgs. 138/2024) ha ampliato la platea dei soggetti tenuti a gestire il rischio informatico, includendo settori che prima ne erano fuori.' },
      { b: 'Perché riguarda anche chi non è nell\'elenco', t: 'Le aziende obbligate devono tenere conto dei rischi che arrivano dalla loro catena di fornitura. Il modo pratico in cui lo fanno è chiedere garanzie ai fornitori — cioè a voi, anche se il vostro settore non compare da nessuna parte.' },
      { b: 'Cosa significa in concreto', t: 'Sapere che cosa avete collegato in rete, sapere quali problemi noti ci sono sopra, avere deciso in che ordine affrontarli, e poterlo mettere per iscritto.' },
    ],
    nota: 'Questa pagina è una sintesi divulgativa, non un parere legale: per la posizione della vostra azienda serve una valutazione specifica.',
  },
  {
    tipo: 'elenco',
    occhiello: 'Il questionario del cliente',
    titolo: 'Le domande che arrivano più spesso.',
    intro: 'Cambiano nella forma, non nella sostanza. Se leggendole vi viene da rispondere "bisognerebbe chiedere a…", è già un\'informazione utile.',
    voci: [
      { b: 'Avete un inventario aggiornato dei dispositivi collegati alla rete?', t: '' },
      { b: 'Con quale frequenza vengono cercate le vulnerabilità note?', t: '' },
      { b: 'Come stabilite quali vulnerabilità chiudere per prime?', t: '' },
      { b: 'Chi ha accesso ai sistemi, e come viene revocato quando qualcuno esce?', t: '' },
      { b: 'Esiste un backup verificato, e quando è stato provato l\'ultima volta?', t: '' },
      { b: 'Cosa succede nelle prime ore dopo un incidente, e chi lo decide?', t: '' },
    ],
    nota: '[DA COMPILARE] Sostituire con le domande vere dei questionari che ricevete: sono più credibili di qualsiasi elenco generico, e mostrano che li avete già visti.',
  },
  {
    tipo: 'elenco',
    occhiello: 'Prima di poter rispondere',
    titolo: 'Le quattro cose da avere pronte.',
    intro: 'Nessuna richiede un progetto: richiedono che qualcuno le abbia guardate almeno una volta e le abbia scritte.',
    voci: [
      { b: '1. L\'inventario', t: 'Ogni dispositivo collegato: computer, server, stampanti, telecamere, gestionali, apparati di rete. Quasi sempre sono più di quelli che ci si aspetta.' },
      { b: '2. Le vulnerabilità note', t: 'Quelle già pubbliche e già catalogate, cercate su ciascun dispositivo. Non serve un attacco per averle: bastano un firmware fermo e una password mai cambiata.' },
      { b: '3. La gravità', t: 'Misurata con uno standard riconosciuto (CVSS), così che l\'ordine di intervento non dipenda da chi lo propone.' },
      { b: '4. Il piano', t: 'Cosa si chiude subito, cosa richiede una decisione, cosa può aspettare — e perché.' },
    ],
  },
  {
    tipo: 'passi',
    occhiello: 'Come funziona un check-up',
    titolo: 'Quattro passi, nessun fermo del lavoro.',
    passi: [
      { b: 'Mappiamo tutti i dispositivi collegati', t: 'Compresi quelli che nessuno ricordava più.' },
      { b: 'Cerchiamo le vulnerabilità già note', t: 'Su ciascun dispositivo, con strumenti aggiornati.' },
      { b: 'Misuriamo quanto sono gravi', t: 'Con lo standard CVSS, non a sensazione.' },
      { b: 'Vi diciamo cosa sistemare, in ordine', t: 'E ve lo spieghiamo di persona, non via mail.' },
    ],
    nota: 'I dati restano dentro la vostra azienda. Il preventivo arriva prima di qualsiasi attività.',
  },
  {
    tipo: 'elenco',
    occhiello: 'Cosa vi resta in mano',
    titolo: 'Il documento, quattro parti.',
    intro: 'Scritto per essere letto da voi, non solo da un tecnico — perché è il documento che finirà davanti a chi vi chiede garanzie.',
    voci: [
      { b: 'Inventario', t: 'Ogni dispositivo collegato alla rete, elencato.' },
      { b: 'Vulnerabilità', t: 'Quelle note, trovate su ciascun dispositivo.' },
      { b: 'Gravità', t: 'Misurata con lo standard CVSS.' },
      { b: 'Piano di intervento', t: 'Cosa sistemare, in che ordine e perché.' },
    ],
    nota: '[DA COMPILARE] Qui va una pagina vera del report, con nomi e indirizzi oscurati. È la prova che il documento esiste e che si capisce: vale più di tutta questa pagina.',
  },
  {
    tipo: 'chiusura',
    occhiello: 'Come si comincia',
    titolo: 'Mezz\'ora, senza impegno.',
    testo: 'Ci raccontate come è fatta la vostra rete, vi diciamo se un check-up ha senso e cosa comporterebbe. Se non ha senso, ve lo diciamo lo stesso.',
    voci: [
      'Preventivo prima di iniziare',
      'Nessun fermo del lavoro',
      'I dati restano in azienda',
      'Siamo a Firenze: persone con cui parlare',
    ],
    cta: 'tecnolink.it — Check-up di sicurezza informatica',
    piede: 'Tecnolink · Firenze e dintorni',
  },
];

/* ------------------------------------------------------------------ */
/* Impaginazione                                                       */
/* ------------------------------------------------------------------ */

// Verticale 4:5, la proporzione che LinkedIn mostra più grande nel feed.
const W = 1080;
const H = 1350;

const T = {
  inchiostro: '#0a0f22',
  soft: '#4a5372',
  tenue: '#8891ab',
  riga: '#dbe1f2',
  accento: 'linear-gradient(90deg,#22d3ee,#6366f1)',
};

const testa = (n) => `
  <div class="testa">
    <img class="logo" src="${LOGO}" alt="Tecnolink">
    <span class="numero">${String(n).padStart(2, '0')} / ${String(PAGINE.length).padStart(2, '0')}</span>
  </div>`;

const corpi = {
  copertina: (p) => `
    <div class="scuro">
      <img class="logo" src="${LOGO}" alt="Tecnolink">
      <div>
        <div class="barra"></div>
        <div class="occhiello chiaro">${p.occhiello}</div>
        <h1>${p.titolo}</h1>
        <p class="testo grande">${p.testo}</p>
      </div>
      <div class="piede chiaro">${p.piede}</div>
    </div>`,

  elenco: (p) => `
    <div class="occhiello">${p.occhiello}</div>
    <h2>${p.titolo}</h2>
    ${p.intro ? `<p class="testo">${p.intro}</p>` : ''}
    <div class="voci">
      ${p.voci.map((v) => `<div class="voce"><b>${v.b}</b>${v.t ? `<span>${v.t}</span>` : ''}</div>`).join('')}
    </div>
    ${p.nota ? `<div class="nota">${p.nota}</div>` : ''}`,

  testo: (p) => `
    <div class="occhiello">${p.occhiello}</div>
    <h2>${p.titolo}</h2>
    <div class="voci">
      ${p.blocchi.map((v) => `<div class="voce"><b>${v.b}</b><span>${v.t}</span></div>`).join('')}
    </div>
    ${p.nota ? `<div class="nota">${p.nota}</div>` : ''}`,

  passi: (p) => `
    <div class="occhiello">${p.occhiello}</div>
    <h2>${p.titolo}</h2>
    <div class="passi">
      ${p.passi.map((v, i) => `
        <div class="passo"><span class="n">${i + 1}</span><div><b>${v.b}</b><span>${v.t}</span></div></div>`).join('')}
    </div>
    ${p.nota ? `<div class="nota">${p.nota}</div>` : ''}`,

  chiusura: (p) => `
    <div class="scuro">
      <img class="logo" src="${LOGO}" alt="Tecnolink">
      <div>
        <div class="barra"></div>
        <div class="occhiello chiaro">${p.occhiello}</div>
        <h1>${p.titolo}</h1>
        <p class="testo grande">${p.testo}</p>
        <div class="spunte">
          ${p.voci.map((v) => `<span class="spunta">${v}</span>`).join('')}
        </div>
        <div class="cta">${p.cta}</div>
      </div>
      <div class="piede chiaro">${p.piede}</div>
    </div>`,
};

const documento = `<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
<style>
  @page { size: ${W}px ${H}px; margin: 0 }
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Inter,'Segoe UI',sans-serif;color:${T.inchiostro};-webkit-print-color-adjust:exact;print-color-adjust:exact}

  .pagina{
    width:${W}px;height:${H}px;padding:76px 84px;background:#ffffff;
    display:flex;flex-direction:column;position:relative;overflow:hidden;
    page-break-after:always;break-after:page;
  }
  .pagina:last-child{page-break-after:auto;break-after:auto}

  .testa{display:flex;align-items:center;justify-content:space-between;margin-bottom:56px}
  .logo{height:48px;width:auto;filter:brightness(0)}
  .numero{font-size:20px;font-weight:700;letter-spacing:0.16em;color:${T.tenue}}

  .occhiello{font-size:21px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${T.tenue}}
  h1{font-family:Poppins,sans-serif;font-weight:700;font-size:72px;line-height:1.06;letter-spacing:-0.03em;margin-top:22px}
  h2{font-family:Poppins,sans-serif;font-weight:700;font-size:54px;line-height:1.1;letter-spacing:-0.028em;margin-top:18px}
  .testo{font-size:28px;line-height:1.45;color:${T.soft};margin-top:26px}
  .testo.grande{font-size:31px}

  .voci{margin-top:38px}
  .voce{padding:26px 0;border-bottom:1.5px solid ${T.riga}}
  .voce:last-child{border-bottom:none}
  .voce b{display:block;font-size:29px;font-weight:700;line-height:1.28}
  .voce span{display:block;font-size:26px;line-height:1.42;color:${T.soft};margin-top:9px}

  .passi{margin-top:38px}
  .passo{display:grid;grid-template-columns:74px 1fr;gap:26px;align-items:start;padding:24px 0;border-bottom:1.5px solid ${T.riga}}
  .passo:last-child{border-bottom:none}
  .passo .n{
    width:74px;height:74px;border-radius:24px;background:${T.accento};color:#fff;
    display:flex;align-items:center;justify-content:center;
    font-family:Poppins,sans-serif;font-weight:700;font-size:34px;
  }
  .passo b{display:block;font-size:30px;font-weight:700;line-height:1.25}
  .passo span{display:block;font-size:25px;line-height:1.4;color:${T.soft};margin-top:8px}

  /* Il segnaposto si deve vedere: se resta dentro per distrazione, deve
     saltare all'occhio a chi rilegge il PDF, non nascondersi nel testo. */
  .nota{
    margin-top:auto;font-size:23px;line-height:1.4;color:${T.soft};
    background:rgba(99,102,241,0.07);border-left:5px solid #6366f1;
    border-radius:0 14px 14px 0;padding:22px 26px;
  }

  /* Copertina e chiusura: le uniche due pagine scure, così aprono e chiudono
     il documento in modo riconoscibile mentre si sfoglia in miniatura. */
  /* space-between e non center: logo in alto, blocco al centro, firma in
     basso. Con il centraggio il testo galleggia e sotto resta mezzo foglio
     vuoto, che in miniatura si legge come una pagina non finita. */
  .scuro{
    position:absolute;inset:0;background:linear-gradient(158deg,#0a0f22 0%,#16204a 62%,#241a63 100%);
    color:#fff;padding:84px;display:flex;flex-direction:column;justify-content:space-between;
    align-items:flex-start;
  }
  .scuro .logo{filter:none}
  .barra{width:120px;height:9px;border-radius:100px;background:${T.accento};margin-bottom:34px}
  .occhiello.chiaro{color:rgba(255,255,255,0.66)}
  .scuro .testo{color:rgba(255,255,255,0.82)}
  .piede{font-size:23px;font-weight:600;color:rgba(255,255,255,0.62)}

  .spunte{display:flex;flex-wrap:wrap;gap:14px 18px;margin-top:38px}
  .spunta{
    font-size:24px;font-weight:600;color:#fff;
    background:rgba(255,255,255,0.12);border:1.5px solid rgba(255,255,255,0.28);
    border-radius:100px;padding:12px 24px;
  }
  .cta{
    margin-top:44px;font-family:Poppins,sans-serif;font-weight:700;font-size:30px;
    color:#fff;border-top:1.5px solid rgba(255,255,255,0.28);padding-top:28px;
  }
</style></head>
<body>
${PAGINE.map((p, i) => `
  <section class="pagina">
    ${p.tipo === 'copertina' || p.tipo === 'chiusura' ? '' : testa(i + 1)}
    ${corpi[p.tipo](p)}
  </section>`).join('')}
</body></html>`;

writeFileSync(resolve(outDir, 'documento-linkedin.html'), documento, 'utf8');
console.log('Documento generato: ' + resolve(outDir, 'documento-linkedin.html'));
console.log(`  ${PAGINE.length} pagine, ${W}x${H} ciascuna`);
