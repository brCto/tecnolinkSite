/**
 * Quattro formati nuovi, uno per tipo, per avere di che scegliere.
 *
 * Non sono varianti grafiche di quello che c'è già: sono quattro modi diversi
 * di impostare l'annuncio, e servono a coprire momenti diversi del percorso.
 * Il senso di produrli tutti è poterli confrontare, non pubblicarli insieme.
 *
 *   confronto   Statico a due metà: quello che si vede sopra, quello che
 *               guardiamo noi sotto. Traffico freddo — si capisce in un colpo
 *               d'occhio anche senza leggere.
 *
 *   checklist   Cinque domande a cui rispondere da soli. È testo, quindi non
 *               è un creativo da feed freddo: dà il meglio nelle storie e sul
 *               retargeting, dove chi guarda si ferma volentieri.
 *
 *   miti        Carosello da sei carte sulle quattro convinzioni che lasciano
 *               la porta aperta. I testi esistono già sulla landing privati:
 *               qui sono solo impaginati.
 *
 *   anatomia    Cosa contiene il documento che consegnate. Risponde
 *               all'obiezione silenziosa di chi non ha mai comprato un
 *               check-up e non sa cosa si porta a casa. Nessun dato inventato:
 *               ci sono i nomi delle sezioni, non i risultati.
 *
 *   node genera-formati.mjs && ./render-formati.sh
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, 'html');
mkdirSync(outDir, { recursive: true });

const LOGO = 'file:///' + resolve(here, '../../../tecnolinkSite/wwwroot/img/logo-tecnolink-bianco-180x51.png').replace(/\\/g, '/');

/* ------------------------------------------------------------------ */
/* Contenuto                                                           */
/* ------------------------------------------------------------------ */

/**
 * Vale la linea di sempre: nessuna affermazione sulla situazione di chi legge,
 * nessun dato che non sia vostro. Le domande della checklist sono domande —
 * "sapresti dire quanti dispositivi sono collegati?" — non diagnosi.
 */
const CONTENUTI = {
  confronto: {
    privati: {
      sopra: { occhiello: 'Quello che si vede', titolo: 'Il Wi-Fi funziona.' },
      sotto: {
        occhiello: 'Quello che guardiamo noi',
        voci: [
          'Che cosa è collegato, davvero',
          'Quali porte sono rimaste aperte',
          'Che cosa non si aggiorna da anni',
          'Che cosa si vede da fuori casa',
        ],
      },
      piede: 'Check-up della rete di casa · Tecnolink, Firenze',
    },
    aziende: {
      sopra: { occhiello: 'Quello che si vede', titolo: 'La rete funziona.' },
      sotto: {
        occhiello: 'Quello che guardiamo noi',
        voci: [
          'Ogni dispositivo collegato alla rete',
          'Le vulnerabilità note su ciascuno',
          'Quanto sono gravi, con lo standard CVSS',
          'In che ordine conviene sistemarle',
        ],
      },
      piede: 'Check-up di sicurezza informatica · Tecnolink, Firenze',
    },
  },

  checklist: {
    privati: {
      superficie: 'bianco',
      occhiello: 'Dieci secondi',
      titolo: 'Cinque domande sulla rete di casa.',
      domande: [
        'Sai quanti dispositivi sono collegati al Wi-Fi?',
        'La password del Wi-Fi è cambiata da quando l\'hai attivato?',
        'Il router ha mai fatto un aggiornamento?',
        'Le telecamere hanno ancora la password di fabbrica?',
        'Sapresti dire se qualcuno si collegasse stanotte?',
      ],
      chiusura: 'Se su due resti in silenzio, un check-up ha senso.',
      piede: 'Check-up della rete di casa · Tecnolink, Firenze',
    },
    aziende: {
      superficie: 'notte',
      occhiello: 'Dieci secondi',
      titolo: 'Cinque domande sulla rete aziendale.',
      domande: [
        'Sapete quanti dispositivi sono collegati?',
        'Qualcuno controlla che siano aggiornati?',
        'Esiste un elenco delle vulnerabilità aperte?',
        'Sapreste rispondere al questionario di un cliente?',
        'Sapete quali problemi vanno chiusi per primi?',
      ],
      chiusura: 'Se su due restate in silenzio, un check-up ha senso.',
      piede: 'Check-up di sicurezza informatica · Tecnolink, Firenze',
    },
  },

  /**
   * I quattro miti sono quelli già scritti sulla landing privati, accorciati
   * per stare su una carta. Se cambiano lì, vanno cambiati anche qui: l'annuncio
   * e la pagina devono raccontare la stessa cosa.
   */
  miti: {
    privati: {
      etichetta: 'Check-up della rete di casa',
      carte: [
        {
          fondo: 'nero',
          occhiello: 'La rete di casa',
          titolo: 'Quattro convinzioni che lasciano la porta aperta.',
          testo: 'Le sentiamo tutte le settimane. Nessuna è sbagliata per cattiveria: sono solo mezze verità.',
        },
        {
          fondo: 'bianco',
          mito: '«Ho l\'antivirus, sono a posto.»',
          realta: 'L\'antivirus protegge il computer su cui è installato. Non il router, la smart TV, la telecamera o il campanello — che spesso sono i punti più deboli.',
        },
        {
          fondo: 'bianco',
          mito: '«Non ho niente da nascondere.»',
          realta: 'Non cercano i tuoi segreti: cercano accessi. Email, home banking, social e rubrica valgono molto, e aprono la strada a truffe verso chi conosci.',
        },
        {
          fondo: 'bianco',
          mito: '«Il router me l\'ha dato l\'operatore.»',
          realta: 'Arriva con impostazioni standard, uguali per migliaia di case, e quasi nessuno le cambia o lo aggiorna. È il primo punto che andiamo a guardare.',
        },
        {
          fondo: 'bianco',
          mito: '«Se succedesse qualcosa me ne accorgerei.»',
          realta: 'Quasi mai. Chi entra ha tutto l\'interesse a non farsi notare: nessun avviso, nessun rallentamento. Per questo serve andare a guardare.',
        },
        {
          fondo: 'nero',
          occhiello: 'Check-up della rete di casa',
          titolo: 'Nessuna delle quattro si risolve indovinando.',
          testo: 'Guardiamo la tua rete e ti diciamo cosa sistemare, in parole semplici. Preventivo prima di iniziare.',
          cta: 'Controlla la mia rete',
          piede: 'Tecnolink · Firenze e dintorni',
        },
      ],
    },
  },

  anatomia: {
    aziende: {
      occhiello: 'Cosa vi resta in mano',
      titolo: 'Un documento, quattro parti.',
      sezioni: [
        { nome: 'Inventario', desc: 'Ogni dispositivo collegato alla rete, elencato' },
        { nome: 'Vulnerabilità', desc: 'Quelle note, trovate su ciascun dispositivo' },
        { nome: 'Gravità', desc: 'Misurata con lo standard CVSS, non a sensazione' },
        { nome: 'Piano di intervento', desc: 'Cosa sistemare, in che ordine e perché' },
      ],
      chiusura: 'Leggibile da voi, mostrabile a chi vi chiede garanzie.',
      piede: 'Check-up di sicurezza informatica · Tecnolink, Firenze',
    },
  },
};

/* ------------------------------------------------------------------ */
/* Superfici e misure                                                  */
/* ------------------------------------------------------------------ */

const SUPERFICI = {
  nero: { sfondo: '#000000', testo: '#ffffff', soft: 'rgba(255,255,255,0.72)', tenue: 'rgba(255,255,255,0.52)', riga: 'rgba(255,255,255,0.20)', logoFiltro: 'none', accento: 'linear-gradient(90deg,#22d3ee,#818cf8)', ctaSfondo: '#ffffff', ctaTesto: '#000000' },
  bianco: { sfondo: '#ffffff', testo: '#0a0f22', soft: 'rgba(10,15,34,0.72)', tenue: 'rgba(10,15,34,0.52)', riga: 'rgba(10,15,34,0.14)', logoFiltro: 'brightness(0)', accento: 'linear-gradient(90deg,#22d3ee,#6366f1)', ctaSfondo: '#0a0f22', ctaTesto: '#ffffff' },
  notte: { sfondo: 'linear-gradient(158deg,#0a0f22 0%,#16204a 62%,#241a63 100%)', testo: '#ffffff', soft: 'rgba(255,255,255,0.76)', tenue: 'rgba(255,255,255,0.56)', riga: 'rgba(255,255,255,0.20)', logoFiltro: 'none', accento: 'linear-gradient(90deg,#22d3ee,#818cf8)', ctaSfondo: '#ffffff', ctaTesto: '#0a0f22' },
  chiaro: { sfondo: 'linear-gradient(163deg,#ffffff 0%,#eaeffb 100%)', testo: '#0a0f22', soft: 'rgba(10,15,34,0.70)', tenue: 'rgba(10,15,34,0.50)', riga: 'rgba(10,15,34,0.12)', logoFiltro: 'brightness(0)', accento: 'linear-gradient(90deg,#22d3ee,#6366f1)', ctaSfondo: '#0a0f22', ctaTesto: '#ffffff' },
};

/**
 * Le aree di sicurezza del formato storia: 250 px in alto e 340 in basso, dove
 * Instagram e Facebook sovrappongono nome account, didascalia e pulsanti.
 * `scala` alza i corpi del testo sui formati più grandi.
 */
const MISURE = {
  'feed-verticale': { w: 1080, h: 1350, padTop: 84, padBottom: 84, padX: 84, scala: 1 },
  storia: { w: 1080, h: 1920, padTop: 250, padBottom: 340, padX: 88, scala: 1.08 },
  quadrato: { w: 1080, h: 1080, padTop: 76, padBottom: 76, padX: 80, scala: 0.9 },
};

const px = (m, base) => Math.round(base * m.scala);

/* ------------------------------------------------------------------ */
/* Guscio comune                                                       */
/* ------------------------------------------------------------------ */

const guscio = (m, s, stile, corpo) => `<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${m.w}px;height:${m.h}px;overflow:hidden}
  body{font-family:Inter,'Segoe UI',sans-serif;color:${s.testo};background:${s.sfondo}}
  .logo{height:${px(m, 52)}px;width:auto;display:block;filter:${s.logoFiltro}}
  .occhiello{
    font-size:${px(m, 22)}px;font-weight:700;letter-spacing:0.14em;
    text-transform:uppercase;color:${s.tenue};
  }
  .titolo{
    font-family:Poppins,'Segoe UI',sans-serif;font-weight:700;
    line-height:1.08;letter-spacing:-0.025em;
  }
  .piede{font-size:${px(m, 21)}px;font-weight:600;color:${s.tenue}}
  ${stile}
</style></head>
<body>${corpo}</body></html>`;

/* ------------------------------------------------------------------ */
/* 1. Confronto — due metà                                             */
/* ------------------------------------------------------------------ */

/**
 * La forza di questo formato è che si legge senza leggere: due blocchi, uno
 * chiaro e uno scuro, e si capisce subito che il secondo contiene più roba del
 * primo. Il testo conferma un'impressione che è già arrivata.
 */
const confronto = (m, c) => {
  const s = SUPERFICI.nero;
  const chiara = SUPERFICI.bianco;
  const stile = `
    body{display:flex;flex-direction:column}
    .meta{display:flex;flex-direction:column;justify-content:center;padding:0 ${m.padX}px}
    .sopra{background:${chiara.sfondo};color:${chiara.testo};flex:0 0 38%;padding-top:${m.padTop}px}
    .sotto{background:${s.sfondo};color:${s.testo};flex:1;padding-bottom:${m.padBottom}px;position:relative}
    .sopra .occhiello{color:${chiara.tenue}}
    .sopra .titolo{font-size:${px(m, 78)}px;margin-top:${px(m, 18)}px}
    .sotto .occhiello{color:${s.tenue}}
    .voci{margin-top:${px(m, 26)}px}
    .voce{
      display:grid;grid-template-columns:${px(m, 52)}px 1fr;gap:${px(m, 16)}px;
      align-items:baseline;padding:${px(m, 17)}px 0;border-bottom:1.5px solid ${s.riga};
      font-size:${px(m, 31)}px;font-weight:600;line-height:1.25;
    }
    .voce:last-child{border-bottom:none}
    .voce i{font-style:normal;color:${s.tenue};font-weight:700}
    .firma{position:absolute;left:${m.padX}px;right:${m.padX}px;bottom:${m.padBottom}px;
      display:flex;align-items:center;justify-content:space-between;gap:${px(m, 20)}px}
  `;
  return guscio(m, s, stile, `
  <div class="meta sopra">
    <div class="occhiello">${c.sopra.occhiello}</div>
    <div class="titolo">${c.sopra.titolo}</div>
  </div>
  <div class="meta sotto">
    <div class="occhiello">${c.sotto.occhiello}</div>
    <div class="voci">
      ${c.sotto.voci.map((v, i) => `<div class="voce"><i>0${i + 1}</i><span>${v}</span></div>`).join('')}
    </div>
    <div class="firma">
      <img class="logo" src="${LOGO}" alt="Tecnolink">
      <span class="piede">${c.piede}</span>
    </div>
  </div>`);
};

/* ------------------------------------------------------------------ */
/* 2. Checklist — cinque domande                                       */
/* ------------------------------------------------------------------ */

/**
 * Di parole ne ha parecchie, ed è voluto: chi si ferma su una checklist la
 * legge fino in fondo e ci risponde da solo. Per questo va nelle storie e sul
 * retargeting, non nel feed freddo, dove le immagini molto scritte vengono
 * distribuite peggio.
 */
const checklist = (m, c) => {
  const s = SUPERFICI[c.superficie];
  const stile = `
    body{display:flex;flex-direction:column;justify-content:space-between;align-items:stretch;
      padding:${m.padTop}px ${m.padX}px ${m.padBottom}px}
    .testa .titolo{font-size:${px(m, 56)}px;margin-top:${px(m, 14)}px}
    .testa .occhiello{margin-top:${px(m, 26)}px;display:block}
    .domande{margin:${px(m, 12)}px 0}
    .domanda{
      display:grid;grid-template-columns:${px(m, 40)}px 1fr;gap:${px(m, 22)}px;align-items:start;
      padding:${px(m, 20)}px 0;border-bottom:1.5px solid ${s.riga};
      font-size:${px(m, 30)}px;font-weight:600;line-height:1.3;
    }
    .domanda:last-child{border-bottom:none}
    .casella{
      width:${px(m, 40)}px;height:${px(m, 40)}px;border-radius:${px(m, 10)}px;
      border:2.5px solid ${s.tenue};
    }
    .barra{height:${px(m, 7)}px;width:${px(m, 104)}px;border-radius:100px;background:${s.accento};margin-bottom:${px(m, 22)}px}
    .chiusura{font-size:${px(m, 30)}px;font-weight:700;line-height:1.3}
    .firma{display:flex;align-items:center;justify-content:space-between;gap:${px(m, 20)}px;margin-top:${px(m, 24)}px}
  `;
  return guscio(m, s, stile, `
  <div class="testa">
    <img class="logo" src="${LOGO}" alt="Tecnolink">
    <span class="occhiello">${c.occhiello}</span>
    <div class="titolo">${c.titolo}</div>
  </div>
  <div class="domande">
    ${c.domande.map((d) => `<div class="domanda"><span class="casella"></span><span>${d}</span></div>`).join('')}
  </div>
  <div>
    <div class="barra"></div>
    <div class="chiusura">${c.chiusura}</div>
    <div class="firma"><span class="piede">${c.piede}</span></div>
  </div>`);
};

/* ------------------------------------------------------------------ */
/* 3. Miti — carosello da sei carte                                    */
/* ------------------------------------------------------------------ */

/**
 * Mito sopra, realtà sotto, una coppia per carta. Funziona perché il lettore
 * riconosce la frase: è una cosa che ha pensato lui, o che ha sentito dire.
 * La prima carta annuncia che sono quattro — sapere quante ne restano è la
 * ragione per cui si continua a scorrere.
 */
const carteMiti = (m, c, n, totale) => {
  const s = SUPERFICI[c.fondo];
  const stile = `
    body{display:flex;flex-direction:column;justify-content:space-between;
      padding:${m.padTop}px ${m.padX}px ${m.padBottom}px}
    .testa{display:flex;align-items:center;justify-content:space-between}
    .conta{font-size:${px(m, 22)}px;font-weight:700;letter-spacing:0.16em;color:${s.tenue}}
    .titolo{font-size:${px(m, 62)}px}
    .testo{font-size:${px(m, 29)}px;line-height:1.4;color:${s.soft};margin-top:${px(m, 22)}px}
    .mito{
      font-family:Poppins,'Segoe UI',sans-serif;font-weight:700;
      font-size:${px(m, 58)}px;line-height:1.1;letter-spacing:-0.025em;
    }
    .realta{
      font-size:${px(m, 30)}px;line-height:1.42;color:${s.soft};
      margin-top:${px(m, 30)}px;padding-top:${px(m, 30)}px;border-top:1.5px solid ${s.riga};
    }
    .cta{
      display:inline-flex;align-items:center;justify-content:center;
      background:${s.ctaSfondo};color:${s.ctaTesto};font-weight:700;
      font-size:${px(m, 30)}px;border-radius:100px;padding:${px(m, 21)}px ${px(m, 46)}px;
      margin-top:${px(m, 30)}px;
    }
    .coda{display:flex;align-items:flex-end;justify-content:space-between;gap:${px(m, 20)}px}
    .segni{display:flex;gap:${px(m, 9)}px;align-items:center}
    .segno{width:${px(m, 26)}px;height:${px(m, 5)}px;border-radius:100px;background:${s.riga}}
    .segno.on{background:${s.testo}}
  `;
  const centro = c.mito
    ? `<div><div class="mito">${c.mito}</div><div class="realta">${c.realta}</div></div>`
    : `<div>
         <div class="occhiello">${c.occhiello}</div>
         <div class="titolo" style="margin-top:${px(m, 20)}px">${c.titolo}</div>
         <div class="testo">${c.testo}</div>
         ${c.cta ? `<span class="cta">${c.cta}</span>` : ''}
       </div>`;
  return guscio(m, s, stile, `
  <div class="testa">
    <img class="logo" src="${LOGO}" alt="Tecnolink">
    <span class="conta">${String(n).padStart(2, '0')} / ${String(totale).padStart(2, '0')}</span>
  </div>
  ${centro}
  <div class="coda">
    <span class="piede">${c.piede || ''}</span>
    <span class="segni">${Array.from({ length: totale }, (_, i) => `<span class="segno${i === n - 1 ? ' on' : ''}"></span>`).join('')}</span>
  </div>`);
};

/* ------------------------------------------------------------------ */
/* 4. Anatomia — cosa contiene il documento                            */
/* ------------------------------------------------------------------ */

/**
 * Mostra la forma del report senza mostrarne il contenuto: ci sono i nomi
 * delle quattro parti, non i risultati. Un report finto con numeri finti
 * sarebbe un documento falso, e non è una strada percorribile — quando avrete
 * una pagina vera da anonimizzare, quella sì che vale la pena fotografarla.
 */
const anatomia = (m, c) => {
  const s = SUPERFICI.chiaro;
  const stile = `
    body{display:flex;flex-direction:column;justify-content:space-between;
      padding:${m.padTop}px ${m.padX}px ${m.padBottom}px}
    .titolo{font-size:${px(m, 60)}px;margin-top:${px(m, 16)}px}
    .foglio{
      background:#ffffff;border:1.5px solid rgba(10,15,34,0.10);
      border-radius:${px(m, 22)}px;padding:${px(m, 34)}px ${px(m, 34)}px ${px(m, 16)}px;
      box-shadow:0 ${px(m, 18)}px ${px(m, 44)}px rgba(10,15,34,0.08);
      margin:${px(m, 30)}px 0;
    }
    .barra{height:${px(m, 8)}px;border-radius:100px;background:${s.accento};width:${px(m, 120)}px;margin-bottom:${px(m, 26)}px}
    .sezione{padding:${px(m, 20)}px 0;border-bottom:1.5px solid rgba(10,15,34,0.10)}
    .sezione:last-child{border-bottom:none}
    .sezione b{display:block;font-family:Poppins,sans-serif;font-size:${px(m, 32)}px;letter-spacing:-0.02em}
    .sezione span{display:block;font-size:${px(m, 25)}px;color:${s.soft};margin-top:${px(m, 6)}px;line-height:1.35}
    .chiusura{font-size:${px(m, 28)}px;font-weight:600;line-height:1.35}
    .firma{display:flex;align-items:center;justify-content:space-between;gap:${px(m, 20)}px;margin-top:${px(m, 22)}px}
  `;
  return guscio(m, s, stile, `
  <div>
    <img class="logo" src="${LOGO}" alt="Tecnolink">
    <div class="occhiello" style="display:block;margin-top:${px(m, 24)}px">${c.occhiello}</div>
    <div class="titolo">${c.titolo}</div>
  </div>
  <div class="foglio">
    <div class="barra"></div>
    ${c.sezioni.map((x) => `<div class="sezione"><b>${x.nome}</b><span>${x.desc}</span></div>`).join('')}
  </div>
  <div>
    <div class="chiusura">${c.chiusura}</div>
    <div class="firma"><span class="piede">${c.piede}</span></div>
  </div>`);
};

/* ------------------------------------------------------------------ */
/* Generazione                                                         */
/* ------------------------------------------------------------------ */

const generati = [];
const scrivi = (nome, html) => {
  writeFileSync(resolve(outDir, `${nome}.html`), html, 'utf8');
  generati.push(`  ${nome}`);
};

// Il confronto e la checklist vivono nel feed e nelle storie; l'anatomia è un
// creativo da retargeting, dove il quadrato basta; i miti sono un carosello.
for (const [pubblico, c] of Object.entries(CONTENUTI.confronto)) {
  for (const misura of ['feed-verticale', 'storia']) {
    scrivi(`confronto-${pubblico}-${misura}`, confronto(MISURE[misura], c));
  }
}

for (const [pubblico, c] of Object.entries(CONTENUTI.checklist)) {
  for (const misura of ['feed-verticale', 'storia']) {
    scrivi(`checklist-${pubblico}-${misura}`, checklist(MISURE[misura], c));
  }
}

for (const [pubblico, c] of Object.entries(CONTENUTI.miti)) {
  for (const misura of ['quadrato', 'storia']) {
    c.carte.forEach((carta, i) => {
      scrivi(`miti-${pubblico}-${misura}-${String(i + 1).padStart(2, '0')}`,
        carteMiti(MISURE[misura], carta, i + 1, c.carte.length));
    });
  }
}

for (const [pubblico, c] of Object.entries(CONTENUTI.anatomia)) {
  for (const misura of ['feed-verticale', 'quadrato']) {
    scrivi(`anatomia-${pubblico}-${misura}`, anatomia(MISURE[misura], c));
  }
}

console.log('Formati generati in ' + outDir);
console.log(generati.join('\n'));
