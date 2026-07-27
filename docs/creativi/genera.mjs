/**
 * Creativo di presentazione del servizio, in formato verticale per mobile.
 *
 * Due pubblici (CONTENUTI), con il nome del servizio che cambia di conseguenza:
 *   aziende  — "Check-up di sicurezza informatica"  (campagne LinkedIn)
 *   privati  — "Check-up della rete di casa"        (campagne Facebook/Instagram)
 *
 * Due palette ad alto contrasto (TEMI):
 *   chiaro  — fondo bianco, testo blu notte. Il più leggibile, e in un feed
 *             fatto quasi tutto di immagini scure si stacca parecchio.
 *   vivido  — fondo con il gradiente del marchio, testo bianco, CTA bianca.
 *
 * Tre misure (FORMATI):
 *   feed-verticale  1080x1350  (4:5 — occupa più schermo nel feed)
 *   storia          1080x1920  (9:16 — storie e reel, aree di sicurezza rispettate)
 *   quadrato        1080x1080  (1:1 — di riserva)
 *
 * Per cambiare i testi si modifica CONTENUTI qui sotto e si rigenera:
 *   node genera.mjs && ./render.sh
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, 'html');
mkdirSync(outDir, { recursive: true });

const LOGO = 'file:///' + resolve(here, '../../tecnolinkSite/wwwroot/img/logo-tecnolink-bianco-180x51.png').replace(/\\/g, '/');

/* ------------------------------------------------------------------ */
/* Contenuto                                                           */
/* ------------------------------------------------------------------ */

/**
 * Un contenuto per pubblico. Il nome del servizio, gli esempi di dispositivi e la
 * CTA cambiano perché devono corrispondere alla landing su cui atterra il clic:
 * se l'annuncio dice una cosa e la pagina un'altra, il lead si perde lì in mezzo.
 */
const CONTENUTI = {
  aziende: {
    chip: 'Check-up di sicurezza informatica',
    titolo: 'Scopri le porte aperte<br>della tua rete.',
    intro: 'Controlliamo ogni dispositivo collegato — computer, server, stampanti, telecamere, Wi-Fi — e ti diciamo dove sei esposto e cosa sistemare per primo.',
    passi: [
      'Mappiamo tutti i dispositivi collegati',
      'Cerchiamo le vulnerabilità già note',
      'Misuriamo quanto sono gravi',
      'Ti diciamo cosa sistemare, in ordine',
    ],
    garanzie: ['Nessun fermo del lavoro', 'I dati restano tuoi', 'Te lo spieghiamo di persona'],
    cta: 'Richiedi un\'analisi',
    piede: 'Tecnolink · Firenze, da oltre 20 anni',
  },
  privati: {
    chip: 'Check-up della rete di casa',
    titolo: 'Scopri le porte aperte<br>della tua rete.',
    intro: 'Controlliamo tutto quello che è collegato al Wi-Fi — telefoni, computer, smart TV, telecamere — e ti diciamo cosa conviene sistemare, in parole semplici.',
    passi: [
      'Guardiamo cosa è collegato al Wi-Fi',
      'Troviamo le porte lasciate aperte',
      'Vediamo quali sono le più rischiose',
      'Ti diciamo cosa sistemare, in ordine',
    ],
    garanzie: ['Nessuna complicazione', 'I tuoi dati restano tuoi', 'Niente paroloni'],
    cta: 'Controlla la mia rete',
    piede: 'Tecnolink · Firenze, da oltre 20 anni',
  },
};

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

const TEMI = {
  chiaro: {
    sfondo: 'linear-gradient(163deg, #ffffff 0%, #eaeffb 100%)',
    velo: 'radial-gradient(circle at 88% 92%, rgba(99,102,241,0.10), transparent 46%)',
    // Il logo del sito è bianco: su fondo chiaro va portato a nero.
    logoFiltro: 'brightness(0)',
    testo: '#0a0f22',
    testoSoft: '#4a5372',
    chipSfondo: 'rgba(79,70,229,0.09)',
    chipBordo: 'rgba(79,70,229,0.30)',
    chipTesto: '#4338ca',
    numeroSfondo: 'linear-gradient(120deg, #22d3ee 0%, #6366f1 100%)',
    numeroTesto: '#ffffff',
    riga: '#dbe1f2',
    spunta: '#15803d',
    spuntaSfondo: 'rgba(21,128,61,0.12)',
    ctaSfondo: '#0a0f22',
    ctaTesto: '#ffffff',
    piede: '#6b7391',
    // Radar
    anello: '#a5b5db',
    assi: '#6366f1',
    assiOpacita: 0.18,
    fascio: 'rgba(99,102,241,0.30)',
    fascioFine: 'rgba(99,102,241,0)',
    bagliore: 'rgba(99,102,241,0.16)',
    collegamento: '#93a3ce',
    nodoSfondo: '#ffffff',
    nodoBordo: '#8f9fca',
    nodoSchermo: '#6366f1',
    centro: '#4338ca',
  },
  vivido: {
    sfondo: 'linear-gradient(152deg, #22d3ee 0%, #6366f1 54%, #4026b8 100%)',
    velo: 'radial-gradient(circle at 12% 8%, rgba(255,255,255,0.18), transparent 42%)',
    logoFiltro: 'none',
    testo: '#ffffff',
    testoSoft: 'rgba(255,255,255,0.82)',
    chipSfondo: 'rgba(255,255,255,0.20)',
    chipBordo: 'rgba(255,255,255,0.45)',
    chipTesto: '#ffffff',
    numeroSfondo: '#ffffff',
    numeroTesto: '#4026b8',
    riga: 'rgba(255,255,255,0.30)',
    spunta: '#ffffff',
    spuntaSfondo: 'rgba(255,255,255,0.20)',
    ctaSfondo: '#ffffff',
    ctaTesto: '#0a0f22',
    piede: 'rgba(255,255,255,0.78)',
    anello: 'rgba(255,255,255,0.58)',
    assi: '#ffffff',
    assiOpacita: 0.3,
    fascio: 'rgba(255,255,255,0.42)',
    fascioFine: 'rgba(255,255,255,0)',
    bagliore: 'rgba(255,255,255,0.22)',
    collegamento: 'rgba(255,255,255,0.62)',
    nodoSfondo: 'rgba(255,255,255,0.14)',
    nodoBordo: 'rgba(255,255,255,0.88)',
    nodoSchermo: '#ffffff',
    centro: '#ffffff',
  },
};

/* ------------------------------------------------------------------ */
/* Illustrazione                                                       */
/* ------------------------------------------------------------------ */

/** Dispositivo in rete: riquadro con schermo e pallino di stato. */
const node = (t, x, y, stato) => `
  <g>
    <rect x="${x - 34}" y="${y - 23}" width="68" height="46" rx="12" fill="${t.nodoSfondo}" stroke="${t.nodoBordo}" stroke-width="2"/>
    <rect x="${x - 15}" y="${y - 12}" width="30" height="20" rx="3" fill="none" stroke="${t.nodoSchermo}" stroke-width="2.2"/>
    <line x1="${x - 6}" y1="${y + 14}" x2="${x + 6}" y2="${y + 14}" stroke="${t.nodoSchermo}" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="${x + 22}" cy="${y - 15}" r="6" fill="${stato}"/>
  </g>`;

/** Radar che scansiona i dispositivi collegati. */
const artRadar = (t) => {
  // Su fondo chiaro i pallini di stato vanno scuriti, altrimenti sbiadiscono.
  const ok = t === TEMI.chiaro ? '#15803d' : '#4ade80';
  const attesa = t === TEMI.chiaro ? '#c2410c' : '#fbbf24';
  const rischio = t === TEMI.chiaro ? '#dc2626' : '#fb7185';
  return `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${t.bagliore}"/>
      <stop offset="1" stop-color="${t.fascioFine}"/>
    </radialGradient>
    <radialGradient id="sweep" cx="200" cy="200" r="170" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${t.fascio}"/>
      <stop offset="1" stop-color="${t.fascioFine}"/>
    </radialGradient>
  </defs>
  <g fill="none" stroke="${t.anello}" stroke-width="2">
    <circle cx="200" cy="200" r="72"/><circle cx="200" cy="200" r="124"/><circle cx="200" cy="200" r="172"/>
  </g>
  <g stroke="${t.assi}" stroke-width="1.5" opacity="${t.assiOpacita}">
    <line x1="28" y1="200" x2="372" y2="200"/><line x1="200" y1="28" x2="200" y2="372"/>
  </g>
  <path d="M200 200 L128 45 A170 170 0 0 1 272 45 Z" fill="url(#sweep)"/>
  <g stroke="${t.collegamento}" stroke-width="2" stroke-dasharray="4 7" opacity="0.75">
    <line x1="200" y1="200" x2="200" y2="52"/><line x1="200" y1="200" x2="62" y2="150"/>
    <line x1="200" y1="200" x2="338" y2="150"/><line x1="200" y1="200" x2="62" y2="300"/>
    <line x1="200" y1="200" x2="338" y2="300"/><line x1="200" y1="200" x2="200" y2="352"/>
  </g>
  ${node(t, 200, 40, ok)}${node(t, 60, 132, ok)}${node(t, 340, 132, ok)}
  ${node(t, 60, 306, attesa)}${node(t, 340, 306, ok)}${node(t, 200, 366, rischio)}
  <circle cx="200" cy="200" r="86" fill="url(#glow)"/>
  <circle cx="200" cy="200" r="9" fill="${t.centro}"/>
</svg>`;
};

const check = (t) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="${t.spuntaSfondo}" stroke="${t.spunta}" stroke-width="1.7"/><path d="M7 12.4l3.2 3.2L17 8.8" stroke="${t.spunta}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ------------------------------------------------------------------ */
/* Misure e proporzioni                                                */
/* ------------------------------------------------------------------ */

const FORMATI = {
  'feed-verticale': {
    w: 1080, h: 1350,
    padTop: 64, padBottom: 68, padX: 84,
    art: 240, logo: 74, chip: 24, titolo: 60, intro: 25,
    passoN: 52, passo: 26, garanzia: 21, cta: 27, piede: 20, gap: 20,
  },
  storia: {
    // 9:16 — 250px in alto e 340px in basso restano liberi: lì Instagram e
    // Facebook sovrappongono nome account, didascalia e pulsanti.
    w: 1080, h: 1920,
    padTop: 250, padBottom: 340, padX: 84,
    art: 290, logo: 88, chip: 27, titolo: 66, intro: 27,
    passoN: 58, passo: 28, garanzia: 23, cta: 30, piede: 22, gap: 24,
  },
  quadrato: {
    w: 1080, h: 1080,
    padTop: 54, padBottom: 56, padX: 78,
    art: 180, logo: 62, chip: 21, titolo: 48, intro: 22,
    passoN: 46, passo: 23, garanzia: 19, cta: 24, piede: 18, gap: 14,
  },
};

const pagina = (f, t, c) => `<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${f.w}px;height:${f.h}px;overflow:hidden}
  body{font-family:Inter,'Segoe UI',sans-serif;color:${t.testo};background:${t.sfondo}}
  body::after{content:"";position:absolute;inset:0;pointer-events:none;background:${t.velo}}

  .wrap{
    position:relative;z-index:1;height:100%;display:flex;flex-direction:column;
    justify-content:center;padding:${f.padTop}px ${f.padX}px ${f.padBottom}px;
  }
  .inner{display:flex;flex-direction:column;align-items:center;text-align:center}

  .logo{height:${f.logo}px;width:auto;display:block;filter:${t.logoFiltro}}

  .chip{
    display:inline-flex;align-items:center;gap:12px;margin-top:${f.gap * 1.1}px;
    background:${t.chipSfondo};border:1.5px solid ${t.chipBordo};
    border-radius:100px;padding:10px 24px;
    font-size:${f.chip}px;font-weight:700;color:${t.chipTesto};letter-spacing:0.01em;
  }

  .art{width:${f.art}px;height:${f.art}px;margin:${f.gap * 0.6}px 0}
  .art svg{width:100%;height:100%;display:block}

  h1{
    font-family:Poppins,'Segoe UI',sans-serif;font-weight:700;
    font-size:${f.titolo}px;line-height:1.08;letter-spacing:-0.025em;
  }
  .intro{
    font-size:${f.intro}px;line-height:1.45;color:${t.testoSoft};
    margin-top:${f.gap * 0.7}px;max-width:${f.w - f.padX * 2}px;
  }

  .passi{width:100%;margin-top:${f.gap * 1.2}px;text-align:left}
  .passo{
    display:grid;grid-template-columns:${f.passoN}px 1fr;align-items:center;
    gap:${f.passoN * 0.35}px;padding:${f.gap * 0.52}px 0;
    border-bottom:1.5px solid ${t.riga};
  }
  .passo:last-child{border-bottom:none}
  .passo .n{
    width:${f.passoN}px;height:${f.passoN}px;border-radius:${f.passoN * 0.32}px;
    background:${t.numeroSfondo};color:${t.numeroTesto};
    display:flex;align-items:center;justify-content:center;
    font-family:Poppins,sans-serif;font-weight:700;font-size:${f.passoN * 0.42}px;
  }
  .passo .t{font-size:${f.passo}px;font-weight:600;line-height:1.3;color:${t.testo}}

  .garanzie{
    display:flex;flex-wrap:wrap;justify-content:center;
    gap:${f.gap * 0.4}px ${f.gap * 0.95}px;margin-top:${f.gap}px;
  }
  .garanzia{display:inline-flex;align-items:center;gap:10px;font-size:${f.garanzia}px;font-weight:500;color:${t.testoSoft}}
  .garanzia svg{width:${f.garanzia * 1.05}px;height:${f.garanzia * 1.05}px;flex-shrink:0}

  .cta{
    display:inline-flex;align-items:center;justify-content:center;margin-top:${f.gap * 1.15}px;
    background:${t.ctaSfondo};color:${t.ctaTesto};
    font-weight:700;font-size:${f.cta}px;border-radius:100px;
    padding:${f.cta * 0.68}px ${f.cta * 1.5}px;
  }
  .piede{margin-top:${f.gap * 0.72}px;font-size:${f.piede}px;color:${t.piede};font-weight:500}
</style></head>
<body>
  <div class="wrap">
    <div class="inner">
      <img class="logo" src="${LOGO}" alt="Tecnolink">
      <span class="chip">${c.chip}</span>
      <div class="art">${artRadar(t)}</div>
      <h1>${c.titolo}</h1>
      <p class="intro">${c.intro}</p>

      <div class="passi">
        ${c.passi.map((x, i) => `
        <div class="passo"><div class="n">${i + 1}</div><div class="t">${x}</div></div>`).join('')}
      </div>

      <div class="garanzie">
        ${c.garanzie.map((g) => `<span class="garanzia">${check(t)}${g}</span>`).join('')}
      </div>

      <span class="cta">${c.cta}</span>
      <div class="piede">${c.piede}</div>
    </div>
  </div>

<script>
  // Rete di sicurezza: se cambiando i testi il contenuto supera l'altezza del
  // formato, viene rimpicciolito quel tanto che basta invece di essere tagliato.
  document.fonts.ready.then(function () {
    var wrap = document.querySelector('.wrap');
    var inner = document.querySelector('.inner');
    var cs = getComputedStyle(wrap);
    var disponibile = wrap.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var altezza = inner.getBoundingClientRect().height;
    if (altezza > disponibile) {
      inner.style.transformOrigin = 'center center';
      inner.style.transform = 'scale(' + (disponibile / altezza) + ')';
    }
  });
</script>
</body></html>`;

const generati = [];
for (const [nomePubblico, contenuto] of Object.entries(CONTENUTI)) {
  for (const [nomeTema, tema] of Object.entries(TEMI)) {
    for (const [nomeFormato, f] of Object.entries(FORMATI)) {
      const nome = `${nomePubblico}-${nomeTema}-${nomeFormato}`;
      writeFileSync(resolve(outDir, `${nome}.html`), pagina(f, tema, contenuto), 'utf8');
      generati.push(`  ${nome}  ${f.w}x${f.h}`);
    }
  }
}

console.log('Creativi generati in ' + outDir);
console.log(generati.join('\n'));
