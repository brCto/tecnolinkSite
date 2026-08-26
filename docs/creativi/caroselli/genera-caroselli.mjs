/**
 * Caroselli in bianco e nero. Tre sequenze, quattro o cinque carte ciascuna.
 *
 *   facebook  — rete di casa, pubblico generalista (Facebook e Instagram)
 *   stanze    — rete di casa, il giro stanza per stanza (Facebook e Instagram)
 *   linkedin  — rete aziendale, decisori di PMI (LinkedIn)
 *
 * Perché quattro carte e perché in quest'ordine
 * ---------------------------------------------
 * Le due sequenze storiche seguono lo stesso schema: minaccia → cosa c'è in gioco →
 * la soluzione praticabile → l'azione. L'ordine non è estetico. La ricerca sui
 * "fear appeal" (modello EPPM) dice che una minaccia senza una via d'uscita
 * credibile produce evitamento, non azione: chi si spaventa e non vede cosa
 * può farci scorre via. Per questo la terza carta è sempre "si sistema, ed
 * ecco come" — è quella che trasforma lo spavento della prima in un clic.
 *
 * La prima carta fa gran parte del lavoro: il tasso di swipe sulla carta 1
 * predice la resa dell'intero carosello. Per questo è nera, con una sola frase
 * grande e nessun altro elemento a contendersi l'attenzione.
 *
 * Bianco e nero
 * -------------
 * Nessun colore, di proposito. In un feed saturo di immagini colorate un
 * annuncio in bianco e nero si stacca per contrasto invece che per saturazione,
 * si decodifica più in fretta e regge la miniatura. Le carte nere aprono e
 * chiudono la sequenza, le bianche stanno in mezzo: l'alternanza dà il ritmo e
 * fa capire dove si è.
 *
 * Formati
 * -------
 *   quadrato  1080x1080  la misura del carosello, su Meta e su LinkedIn
 *   storia    1080x1920  storie, Reel e Spotlight (aree di sicurezza rispettate)
 *
 *   node genera-caroselli.mjs && ./render-caroselli.sh
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, 'html');
mkdirSync(outDir, { recursive: true });

const asset = (p) => 'file:///' + resolve(here, '../../../tecnolinkSite/wwwroot/img/', p).replace(/\\/g, '/');
const LOGO = asset('logo-tecnolink-bianco-180x51.png');
const FOTO = (nome) => asset('campagne/foto/' + nome);

/* ------------------------------------------------------------------ */
/* Contenuto                                                           */
/* ------------------------------------------------------------------ */

/**
 * Nota sulle policy Meta: nessuna carta afferma qualcosa sulla situazione di
 * chi legge. "Ogni cosa collegata al Wi-Fi è una porta su casa tua" è un fatto
 * generale; "la tua telecamera è esposta" sarebbe un'affermazione sul
 * destinatario, e viene rifiutata. È la stessa linea seguita in campagne-ads.md.
 */
const CONTENUTI = {
  facebook: {
    etichetta: 'Check-up della rete di casa',
    carte: [
      {
        fondo: 'nero',
        foto: 'privati-router.jpg',
        occhiello: 'La rete di casa',
        titolo: 'Ogni cosa che colleghi al Wi-Fi è una porta su casa tua.',
        testo: 'In una casa normale sono più di dieci. Ne basta una lasciata aperta.',
      },
      {
        fondo: 'bianco',
        occhiello: 'Cosa cercano davvero',
        titolo: 'Non cercano i tuoi segreti. Cercano i tuoi accessi.',
        elenco: [
          'Il Wi-Fi usato da qualcun altro',
          'Telecamere e campanelli visibili da fuori',
          'Email, home banking, foto',
          'Truffe e messaggi a nome tuo',
        ],
      },
      {
        fondo: 'bianco',
        occhiello: 'La buona notizia',
        titolo: 'Si scopre in poche ore. E quasi sempre si sistema con poco.',
        elenco: [
          'Guardiamo cosa è collegato alla tua rete',
          'Troviamo le porte lasciate aperte',
          'Ti diciamo cosa sistemare, in ordine',
        ],
      },
      {
        fondo: 'nero',
        foto: 'privati-telecamera.jpg',
        occhiello: 'Check-up della rete di casa',
        titolo: 'Scopri quali porte sono aperte.',
        testo: 'Preventivo prima di iniziare. Niente tecnicismi. I tuoi dati restano tuoi.',
        cta: 'Controlla la mia rete',
        piede: 'Tecnolink · Firenze e dintorni',
      },
    ],
  },

  // Seconda sequenza per i privati: invece della minaccia, il giro di casa. Cinque
  // carte, una per ambiente. Va misurata contro `facebook` sopra, che apre con la
  // minaccia: stesso pubblico, stessa spesa, utm_content diverso.
  stanze: {
    etichetta: 'Check-up della rete di casa',
    carte: [
      {
        fondo: 'nero',
        foto: 'privati-router.jpg',
        occhiello: 'Stanza per stanza',
        titolo: 'Ogni stanza ha una porta collegata.',
        testo: 'Facciamo il giro della casa e guardiamo cosa è collegato al Wi-Fi, un ambiente alla volta.',
      },
      {
        fondo: 'bianco',
        occhiello: 'L\'ingresso',
        titolo: 'Campanello e telecamera, installati e dimenticati.',
        elenco: [
          'Credenziali di fabbrica mai cambiate',
          'Raggiungibili da fuori casa',
          'Aggiornamenti fermi da anni',
        ],
      },
      {
        fondo: 'bianco',
        occhiello: 'Il salotto',
        titolo: 'La televisione resta accesa in rete.',
        testo: 'Smart TV e box restano connessi per anni con programmi vecchi. Guardiamo versioni, servizi attivi e cosa lasciano aperto.',
      },
      {
        fondo: 'bianco',
        occhiello: 'Studio e cucina',
        titolo: 'Computer, stampante, prese intelligenti.',
        elenco: [
          'Cartelle condivise rimaste aperte',
          'Aggiornamenti mancanti sul computer',
          'Piccoli oggetti che parlano con internet',
        ],
      },
      {
        fondo: 'nero',
        foto: 'privati-telecamera.jpg',
        occhiello: 'Check-up della rete di casa',
        titolo: 'Ti diciamo cosa sistemare, in ordine.',
        testo: 'Ci scrivi, ti richiamiamo entro 24 ore e ti diamo un preventivo prima di iniziare. Poi veniamo e sistemiamo.',
        cta: 'Facciamo il giro di casa',
        piede: 'Tecnolink · Firenze e dintorni',
      },
    ],
  },

  linkedin: {
    etichetta: 'Check-up di sicurezza informatica',
    carte: [
      {
        fondo: 'nero',
        foto: 'aziende-switch.jpg',
        occhiello: 'Sicurezza informatica · PMI',
        titolo: 'La domanda non arriva più dagli hacker. Arriva dal vostro cliente più grande.',
        testo: 'Oggi la sicurezza della rete non basta averla: bisogna poterla dimostrare.',
      },
      {
        fondo: 'bianco',
        occhiello: 'Chi ve lo sta chiedendo',
        titolo: 'Quattro strade diverse, la stessa domanda.',
        elenco: [
          'NIS2 — D.lgs. 138/2024: obblighi estesi a più settori, e ai loro fornitori',
          'GDPR art. 32 — misure adeguate al rischio, da poter documentare',
          'Polizze cyber — evidenza di controlli periodici, prima e dopo il sinistro',
          'Clienti e gare — questionari di sicurezza girati ai fornitori',
        ],
      },
      {
        fondo: 'bianco',
        occhiello: 'Cosa fa il check-up',
        titolo: 'Vulnerability Assessment: dall\'inventario al piano di intervento.',
        elenco: [
          'Mappiamo ogni dispositivo collegato alla rete',
          'Cerchiamo su ciascuno le vulnerabilità note',
          'Ne misuriamo la gravità con lo standard CVSS',
          'Consegniamo un piano in ordine di priorità',
        ],
      },
      {
        fondo: 'nero',
        foto: 'aziende-porte.jpg',
        occhiello: 'Check-up di sicurezza informatica',
        titolo: 'Sapete dire dove siete esposti?',
        testo: 'Nessun fermo del lavoro. I dati restano in azienda. Preventivo prima di iniziare.',
        cta: 'Richiedi un\'analisi',
        piede: 'Tecnolink · Firenze e dintorni',
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Le due superfici                                                    */
/* ------------------------------------------------------------------ */

const NERO = {
  sfondo: '#000000',
  testo: '#ffffff',
  testoSoft: 'rgba(255,255,255,0.72)',
  tenue: 'rgba(255,255,255,0.55)',
  riga: 'rgba(255,255,255,0.22)',
  ctaSfondo: '#ffffff',
  ctaTesto: '#000000',
  segnoOn: '#ffffff',
  segnoOff: 'rgba(255,255,255,0.28)',
  logoFiltro: 'none',
};

const BIANCO = {
  sfondo: '#ffffff',
  testo: '#000000',
  testoSoft: 'rgba(0,0,0,0.70)',
  tenue: 'rgba(0,0,0,0.52)',
  riga: 'rgba(0,0,0,0.14)',
  ctaSfondo: '#000000',
  ctaTesto: '#ffffff',
  segnoOn: '#000000',
  segnoOff: 'rgba(0,0,0,0.20)',
  // Il logo del sito è bianco su trasparente: su fondo bianco va portato a nero.
  logoFiltro: 'brightness(0)',
};

/* ------------------------------------------------------------------ */
/* Misure                                                              */
/* ------------------------------------------------------------------ */

const FORMATI = {
  quadrato: {
    w: 1080, h: 1080,
    padTop: 72, padBottom: 72, padX: 84,
    logo: 54, occhiello: 24, titolo: 68, titoloCta: 76, testo: 30,
    voce: 30, indice: 22, cta: 30, piede: 21, segno: 5,
    // Altezza della foto nei due modi che non la mettono a tutto fondo. Sono i due
    // numeri più delicati del file: alzarli comprime il testo sotto fino a far
    // toccare il titolo e il piede.
    fascia: 380, riquadro: 360,
  },
  storia: {
    // 250px in alto e 340px in basso restano liberi: lì le app sovrappongono
    // nome account, didascalia e pulsanti.
    w: 1080, h: 1920,
    padTop: 250, padBottom: 340, padX: 84,
    logo: 62, occhiello: 26, titolo: 78, titoloCta: 86, testo: 33,
    voce: 33, indice: 24, cta: 33, piede: 23, segno: 6,
    // Nel 9:16 la fascia parte da zero, quindi ingloba i 250px che l'app copre:
    // di foto se ne vede poco più di 500.
    fascia: 780, riquadro: 620,
  },
};

/* ------------------------------------------------------------------ */
/* Carta                                                               */
/* ------------------------------------------------------------------ */

/** Trattini di avanzamento: uno per carta, quello corrente è pieno e più lungo. */
const segni = (t, totale) => `
  <div class="segni">${Array.from({ length: totale }, (_, i) => `<i data-i="${i}"></i>`).join('')}</div>`;

/**
 * Velo scuro sopra la foto. Serve a due cose: rendere leggibile il testo bianco
 * qualunque sia la foto sotto, e uniformare carte con fotografie diverse. In alto
 * basta poco (logo e contatore), in basso deve essere quasi opaco perché lì c'è il
 * titolo. Senza, la prima foto chiara manda a picco la leggibilità.
 */
const VELO = 'linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.30) 26%, rgba(0,0,0,0.80) 66%, rgba(0,0,0,0.95) 100%)';

/**
 * Come la foto sta nella carta. Quattro modi, in ordine di quanto la fotografia
 * invade il testo:
 *
 *   piatto    nessuna foto — la carta piena in bianco o nero
 *   pieno     foto a tutto fondo con il velo scuro sopra. Massimo impatto, ma il
 *             testo deve difendersi da qualunque cosa ci sia sotto
 *   fascia    foto in una fascia in alto, testo sotto su fondo pieno. Nessuna
 *             sovrapposizione: la foto attira, il testo si legge come su carta
 *   riquadro  foto in un riquadro con aria intorno, su fondo nero. La più
 *             composta: sembra una pagina, non un annuncio
 */
const carta = (f, t, c, i, etichetta, modo, totale) => {
  // La carta di chiusura ha un elemento in più, il pulsante: la foto si accorcia
  // per far posto, altrimenti la CTA finisce addosso al piede.
  const hFascia = Math.round(f.fascia * (c.cta ? 0.88 : 1));
  const hRiquadro = Math.round(f.riquadro * (c.cta ? 0.78 : 1));

  return `<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${f.w}px;height:${f.h}px;overflow:hidden}
  /* Senza questo il testo bianco su nero esce con frange colorate (antialiasing
     subpixel): su una creatività in bianco e nero si vedono. */
  body{
    font-family:Inter,'Segoe UI',sans-serif;color:${t.testo};background:${t.sfondo};
    -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  }

${modo === 'pieno' ? `
  .foto{position:absolute;inset:0;background:url("${FOTO(c.foto)}") center/cover no-repeat}
  .foto::after{content:"";position:absolute;inset:0;background:${VELO}}
` : ''}
${modo === 'fascia' ? `
  /* La fascia parte dal bordo: una foto a filo taglia meglio di una incorniciata. */
  .fascia{position:absolute;top:0;left:0;right:0;height:${hFascia}px;
    background:url("${FOTO(c.foto)}") center/cover no-repeat}
` : ''}
${modo === 'riquadro' ? `
  .riquadro{width:100%;height:${hRiquadro}px;
    border-radius:${f.padX * 0.28}px;
    background:url("${FOTO(c.foto)}") center/cover no-repeat;margin-bottom:${f.padX * 0.5}px}
` : ''}
  .wrap{
    position:relative;z-index:1;height:100%;display:flex;flex-direction:column;
    padding:${modo === 'fascia' ? hFascia + f.padX * 0.55 : f.padTop}px ${f.padX}px ${f.padBottom}px;
  }
  .testa{display:flex;align-items:center;justify-content:space-between}
  .logo{height:${f.logo}px;width:auto;display:block;filter:${t.logoFiltro}}
  .conta{font-size:${f.indice}px;font-weight:700;color:${t.tenue};letter-spacing:0.18em}

  .centro{flex:1;display:flex;flex-direction:column;justify-content:center}

  .occhiello{
    font-size:${f.occhiello}px;font-weight:700;letter-spacing:0.16em;
    text-transform:uppercase;color:${t.tenue};margin-bottom:${f.occhiello * 1.5}px;
  }
  h1{
    font-family:Poppins,'Segoe UI',sans-serif;font-weight:700;
    font-size:${c.cta ? f.titoloCta : f.titolo}px;line-height:1.08;letter-spacing:-0.035em;
  }
  .testo{font-size:${f.testo}px;line-height:1.45;color:${t.testoSoft};margin-top:${f.testo * 1.1}px}

  .elenco{margin-top:${f.voce * 1.4}px}
  .voce{
    display:grid;grid-template-columns:${f.indice * 2.2}px 1fr;gap:${f.voce * 0.5}px;
    align-items:baseline;padding:${f.voce * 0.62}px 0;border-top:1.5px solid ${t.riga};
  }
  .voce:last-child{border-bottom:1.5px solid ${t.riga}}
  .voce .n{font-size:${f.indice}px;font-weight:700;color:${t.tenue};letter-spacing:0.06em}
  .voce .t{font-size:${f.voce}px;line-height:1.32;font-weight:500}

  .cta{
    display:inline-flex;align-items:center;justify-content:center;align-self:flex-start;
    margin-top:${f.cta * 1.3}px;background:${t.ctaSfondo};color:${t.ctaTesto};
    font-weight:700;font-size:${f.cta}px;border-radius:100px;
    padding:${f.cta * 0.72}px ${f.cta * 1.65}px;
  }

  .piedone{display:flex;align-items:center;justify-content:space-between;gap:24px}
  .etichetta{font-size:${f.piede}px;font-weight:600;color:${t.tenue}}
  .segni{display:flex;gap:${f.segno * 2.2}px;align-items:center}
  .segni i{width:${f.segno * 5}px;height:${f.segno}px;background:${t.segnoOff};border-radius:${f.segno}px}
  .segni i.on{background:${t.segnoOn};width:${f.segno * 11}px}
</style></head>
<body>
  ${modo === 'pieno' ? '<div class="foto"></div>' : ''}
  ${modo === 'fascia' ? '<div class="fascia"></div>' : ''}
  <div class="wrap">
    <div class="testa">
      <img class="logo" src="${LOGO}" alt="Tecnolink">
      <span class="conta">${String(i + 1).padStart(2, '0')} / ${String(totale).padStart(2, "0")}</span>
    </div>

    <div class="centro">
      ${modo === 'riquadro' ? '<div class="riquadro"></div>' : ''}
      <div class="occhiello">${c.occhiello}</div>
      <h1>${c.titolo}</h1>
      ${c.testo ? `<p class="testo">${c.testo}</p>` : ''}
      ${c.elenco ? `<div class="elenco">${c.elenco.map((v, n) => `
        <div class="voce"><div class="n">${String(n + 1).padStart(2, '0')}</div><div class="t">${v}</div></div>`).join('')}</div>` : ''}
      ${c.cta ? `<span class="cta">${c.cta}</span>` : ''}
    </div>

    <div class="piedone">
      <span class="etichetta">${c.piede || etichetta}</span>
      ${segni(t, totale)}
    </div>
  </div>

<script>
  document.querySelectorAll('.segni i')[${i}].classList.add('on');

  // Se un testo cresce oltre l'altezza della carta viene rimpicciolito quel tanto
  // che basta, invece di essere tagliato.
  document.fonts.ready.then(function () {
    var centro = document.querySelector('.centro');
    var disponibile = centro.clientHeight;
    var contenuto = centro.scrollHeight;
    if (contenuto > disponibile) {
      centro.style.transformOrigin = 'left center';
      centro.style.transform = 'scale(' + (disponibile / contenuto) + ')';
    }
  });
</script>
</body></html>`;
};

/* ------------------------------------------------------------------ */

/**
 * Quattro varianti sullo stesso identico copy. Cambia solo come la fotografia
 * occupa la carta — mai una parola:
 *
 *   bn        nessuna foto, le carte piene in bianco e nero
 *   foto      foto a tutto fondo, velo scuro sopra
 *   fascia    foto in una fascia in alto, testo sotto su nero
 *   riquadro  foto in un riquadro con aria intorno, su nero
 *
 * Le due carte centrali sono identiche in tutte le varianti, ed è voluto: la
 * differenza da misurare sta nella prima carta, che da sola predice la resa del
 * carosello. Se una variante vince, si sa esattamente cosa ha vinto.
 */
const VARIANTI = {
  bn: null,          // nessuna foto, nemmeno sulle carte che ne hanno una
  foto: 'pieno',
  fascia: 'fascia',
  riquadro: 'riquadro',
};

const generati = [];
for (const [pubblico, set] of Object.entries(CONTENUTI)) {
  for (const [variante, modoFoto] of Object.entries(VARIANTI)) {
    for (const [formato, f] of Object.entries(FORMATI)) {
      set.carte.forEach((c, i) => {
        // Una carta usa la foto solo se ne ha una e se la variante lo prevede.
        const modo = modoFoto && c.foto ? modoFoto : 'piatto';
        const t = c.fondo === 'nero' || modo !== 'piatto' ? NERO : BIANCO;
        const nome = `${pubblico}-${variante}-${formato}-0${i + 1}`;
        writeFileSync(resolve(outDir, `${nome}.html`), carta(f, t, c, i, set.etichetta, modo, set.carte.length), 'utf8');
        generati.push(`  ${nome}  ${f.w}x${f.h}`);
      });
    }
  }
}

console.log('Carte generate in ' + outDir);
console.log(generati.join('\n'));
