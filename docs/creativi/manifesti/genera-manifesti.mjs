/**
 * Manifesti — una frase sola, grande quanto tutta l'immagine.
 *
 * Quattro concetti per pubblico, ognuno con la sua superficie:
 *
 *   aziende  — decisori di PMI (LinkedIn)
 *   privati  — rete di casa, pubblico generalista (Facebook e Instagram)
 *
 * Perché così poche parole
 * ------------------------
 * Il creativo di presentazione in ../ dice tutto il servizio in un'immagine
 * sola: nome, promessa, quattro passi, tre garanzie, pulsante. È utile a chi
 * ci sta già pensando, ma nel feed freddo lavora contro di sé — le piattaforme
 * distribuiscono peggio le immagini molto scritte, e chi scorre non legge un
 * paragrafo per decidere se fermarsi. La regola pratica del 2026 è: sull'immagine
 * il gancio e basta (5-10 parole, testo sotto un terzo della superficie), tutto
 * il resto nel campo di testo dell'annuncio, che è gratis e non pesa sulla resa.
 *
 * Perché quattro concetti e non quattro palette dello stesso
 * ---------------------------------------------------------
 * Meta raggruppa gli annunci che si somigliano e li tratta come uno solo: dieci
 * varianti dello stesso impianto rendono quanto una. Quello che serve è varietà
 * vera — angoli diversi, superfici diverse. Da qui i quattro concetti, ognuno
 * con un modo diverso di aprire il discorso:
 *
 *   domanda / wifi        una domanda a cui non si sa rispondere
 *   nis2 / router         un fatto scomodo, detto piano
 *   esito                 il risultato, senza nominare la minaccia
 *   fornitura / telecamere  la conseguenza che arriva da fuori
 *
 * Il terzo è deliberatamente l'unico che non fa leva sulla paura: nel settore
 * sicurezza il messaggio allarmistico si è consumato, e il confronto tra un
 * annuncio "minaccia" e uno "risultato" è la cosa più utile da misurare qui.
 *
 * Formati
 * -------
 *   feed-verticale  1080x1350  (4:5 — la misura principale nel feed)
 *   storia          1080x1920  (9:16 — aree di sicurezza rispettate)
 *   quadrato        1080x1080  (1:1 — di riserva)
 *
 *   node genera-manifesti.mjs && ./render-manifesti.sh
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
 * Una frase per concetto, mai più di dieci parole, spezzata a mano riga per
 * riga: si va a capo dove si respira parlando, così la frase si legge in un
 * colpo solo invece che a scatti. Le righe restano intere anche quando il
 * titolo viene rimpicciolito — vedi la nota sulla funzione di adattamento.
 *
 * Vale la stessa linea del resto dei materiali: nessuna affermazione sulla
 * situazione di chi legge. "Il router non si aggiorna da solo" è un fatto
 * generale; "il tuo router è vecchio" sarebbe un'affermazione sul destinatario,
 * e Meta la rifiuta.
 */
const CONTENUTI = {
  aziende: {
    piede: 'Check-up di sicurezza informatica · Tecnolink, Firenze',
    concetti: {
      domanda: {
        superficie: 'nero',
        righe: ['Sapete dire quali', 'porte ha aperte', 'la vostra rete?'],
      },
      nis2: {
        superficie: 'bianco',
        righe: ['NIS2 non chiede', 'se siete sicuri.', 'Chiede se potete', 'dimostrarlo.'],
      },
      // L'unico senza minaccia: è il termine di paragone del test.
      esito: {
        superficie: 'vivido',
        righe: ['Un elenco di cose', 'da sistemare,', 'in ordine', 'di urgenza.'],
      },
      questionario: {
        superficie: 'notte',
        righe: ['Il questionario del', 'cliente arriva', 'senza preavviso.'],
      },
    },
  },
  privati: {
    piede: 'Check-up della rete di casa · Tecnolink, Firenze',
    concetti: {
      wifi: {
        superficie: 'nero',
        righe: ['Quante cose sono', 'collegate al tuo', 'Wi-Fi adesso?'],
      },
      router: {
        superficie: 'bianco',
        righe: ['Il router non si', 'aggiorna da solo.'],
      },
      esito: {
        superficie: 'vivido',
        righe: ['Ti diciamo cosa', 'sistemare e in', 'che ordine.'],
      },
      telecamere: {
        superficie: 'notte',
        righe: ['Le telecamere si', 'installano una volta', 'e si dimenticano.'],
      },
    },
  },
};

/* ------------------------------------------------------------------ */
/* Superfici                                                           */
/* ------------------------------------------------------------------ */

/**
 * Quattro superfici molto diverse tra loro, di proposito: due annunci con lo
 * stesso fondo si somigliano in miniatura anche se dicono cose diverse, e in
 * miniatura si decide se fermarsi.
 */
const SUPERFICI = {
  nero: {
    sfondo: '#000000',
    // Il logo del sito è bianco: solo sul fondo chiaro va portato a nero.
    logoFiltro: 'none',
    testo: '#ffffff',
    piede: 'rgba(255,255,255,0.62)',
    barra: 'linear-gradient(90deg, #22d3ee 0%, #818cf8 100%)',
  },
  bianco: {
    sfondo: '#ffffff',
    logoFiltro: 'brightness(0)',
    testo: '#0a0f22',
    piede: '#6b7391',
    barra: 'linear-gradient(90deg, #22d3ee 0%, #6366f1 100%)',
  },
  vivido: {
    sfondo: 'linear-gradient(152deg, #22d3ee 0%, #6366f1 54%, #4026b8 100%)',
    logoFiltro: 'none',
    testo: '#ffffff',
    piede: 'rgba(255,255,255,0.80)',
    barra: '#ffffff',
  },
  notte: {
    sfondo: 'linear-gradient(158deg, #0a0f22 0%, #16204a 62%, #241a63 100%)',
    logoFiltro: 'none',
    testo: '#ffffff',
    piede: 'rgba(255,255,255,0.66)',
    barra: 'linear-gradient(90deg, #22d3ee 0%, #818cf8 100%)',
  },
};

/* ------------------------------------------------------------------ */
/* Misure                                                              */
/* ------------------------------------------------------------------ */

const FORMATI = {
  'feed-verticale': {
    w: 1080, h: 1350,
    padTop: 88, padBottom: 88, padX: 88,
    logo: 58, titolo: 86, piede: 24, barra: 104,
  },
  storia: {
    // 9:16 — 250px in alto e 340px in basso restano liberi: lì Instagram e
    // Facebook sovrappongono nome account, didascalia e pulsanti.
    w: 1080, h: 1920,
    padTop: 250, padBottom: 340, padX: 92,
    logo: 62, titolo: 90, piede: 26, barra: 116,
  },
  quadrato: {
    w: 1080, h: 1080,
    padTop: 76, padBottom: 76, padX: 82,
    logo: 52, titolo: 78, piede: 22, barra: 92,
  },
};

const pagina = (f, s, c, piede) => `<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&family=Poppins:wght@700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${f.w}px;height:${f.h}px;overflow:hidden}
  body{
    font-family:Inter,'Segoe UI',sans-serif;color:${s.testo};background:${s.sfondo};
    display:flex;flex-direction:column;justify-content:space-between;
    /* Senza flex-start le tre righe si allargano a tutta la colonna: il logo,
       che ha width:auto, verrebbe stirato da un margine all'altro. */
    align-items:flex-start;
    padding:${f.padTop}px ${f.padX}px ${f.padBottom}px;
  }

  .logo{height:${f.logo}px;width:auto;display:block;filter:${s.logoFiltro}}

  /* La barra è l'unico elemento decorativo: serve a dare un attacco all'occhio
     senza spendere parole, che qui sono la risorsa scarsa. */
  .barra{width:${f.barra}px;height:${f.barra * 0.075}px;border-radius:100px;background:${s.barra};margin-bottom:${f.titolo * 0.42}px}

  h1{
    font-family:Poppins,'Segoe UI',sans-serif;font-weight:700;
    font-size:${f.titolo}px;line-height:1.06;letter-spacing:-0.03em;
  }
  /* nowrap: le righe sono spezzate a mano e devono restare come sono. Se una
     non ci sta in larghezza si rimpicciolisce il titolo, non si va a capo. */
  h1 span{display:block;white-space:nowrap}

  .piede{
    font-size:${f.piede}px;font-weight:600;color:${s.piede};
    letter-spacing:0.02em;
  }
</style></head>
<body>
  <img class="logo" src="${LOGO}" alt="Tecnolink">

  <div class="frase">
    <div class="barra"></div>
    <h1>${c.righe.map((r) => `<span>${r}</span>`).join('')}</h1>
  </div>

  <div class="piede">${piede}</div>

<script>
  // Rete di sicurezza: se cambiando la frase una riga non ci sta più — in
  // larghezza o in altezza — il titolo viene rimpicciolito quel tanto che
  // basta. Meglio un manifesto un po' meno grande di uno con una riga andata
  // a capo per conto suo, che è il modo più rapido per rovinare il ritmo.
  document.fonts.ready.then(function () {
    var h1 = document.querySelector('h1');
    var frase = document.querySelector('.frase');
    var righe = h1.querySelectorAll('span');
    var largh = document.body.clientWidth - ${f.padX} * 2;
    var alt = document.body.clientHeight
      - ${f.padTop} - ${f.padBottom}
      - document.querySelector('.logo').getBoundingClientRect().height
      - document.querySelector('.piede').getBoundingClientRect().height;

    var deborda = function () {
      if (frase.getBoundingClientRect().height > alt) return true;
      for (var i = 0; i < righe.length; i++) {
        if (righe[i].getBoundingClientRect().width > largh) return true;
      }
      return false;
    };

    var corpo = ${f.titolo};
    while (deborda() && corpo > 28) {
      corpo -= 2;
      h1.style.fontSize = corpo + 'px';
    }
  });
</script>
</body></html>`;

const generati = [];
for (const [nomePubblico, pubblico] of Object.entries(CONTENUTI)) {
  for (const [nomeConcetto, concetto] of Object.entries(pubblico.concetti)) {
    const superficie = SUPERFICI[concetto.superficie];
    for (const [nomeFormato, f] of Object.entries(FORMATI)) {
      const nome = `${nomePubblico}-${nomeConcetto}-${nomeFormato}`;
      writeFileSync(resolve(outDir, `${nome}.html`), pagina(f, superficie, concetto, pubblico.piede), 'utf8');
      generati.push(`  ${nome}  ${f.w}x${f.h}  (${concetto.superficie})`);
    }
  }
}

console.log('Manifesti generati in ' + outDir);
console.log(generati.join('\n'));
