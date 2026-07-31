/**
 * Motore del video di presentazione: disegna l'intera animazione su un canvas,
 * fotogramma per fotogramma, in funzione del solo tempo.
 *
 * Il disegno è una funzione pura del tempo — `TK.disegna(t)` produce sempre lo
 * stesso fotogramma per lo stesso `t`. È la condizione che rende la registrazione
 * ripetibile: se l'animazione dipendesse dai millisecondi trascorsi tra un
 * requestAnimationFrame e l'altro, due registrazioni della stessa scaletta non
 * verrebbero mai identiche, e un fotogramma lento sposterebbe tutto quello dopo.
 *
 * Lo sfondo a rete di particelle riprende quello dell'hero del sito
 * (wwwroot/js/site.js), così il video e la home parlano la stessa lingua.
 */

(function () {
  'use strict';

  /* ================================================================== */
  /* Palette — la stessa di wwwroot/css/site.css                        */
  /* ================================================================== */

  const C = {
    navy950: '#060a17',
    navy900: '#0a0f22',
    navy800: '#0f1730',
    navy700: '#16204a',
    cyan400: '#22d3ee',
    cyan300: '#67e8f9',
    violet500: '#6366f1',
    violet400: '#818cf8',
    bianco: '#ffffff',
    successo: '#34d399',
    ambra: '#fbbf24',
  };

  const soft = a => `rgba(255,255,255,${a})`;
  const cyanA = a => `rgba(34,211,238,${a})`;
  const violA = a => `rgba(99,102,241,${a})`;

  const F = {
    testa: (peso, dim) => `${peso} ${dim}px Poppins, "Segoe UI", sans-serif`,
    corpo: (peso, dim) => `${peso} ${dim}px Inter, "Segoe UI", sans-serif`,
    icona: dim => `${dim}px bootstrap-icons`,
  };

  /* ================================================================== */
  /* Utilità                                                             */
  /* ================================================================== */

  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const easeOut = p => 1 - Math.pow(1 - clamp01(p), 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const mix = (a, b, p) => a + (b - a) * clamp01(p);

  /** Progressione 0→1 di un elemento che entra dopo `ritardo` secondi. */
  const app = (t, ritardo, durata) => easeOut((t - ritardo) / (durata || 0.55));

  /** Manda a capo il testo entro `maxW`. Il font va impostato prima di chiamarla. */
  function avvolgi(ctx, testo, maxW) {
    const righe = [];
    let riga = '';
    for (const parola of testo.split(' ')) {
      const prova = riga ? riga + ' ' + parola : parola;
      if (riga && ctx.measureText(prova).width > maxW) { righe.push(riga); riga = parola; }
      else riga = prova;
    }
    if (riga) righe.push(riga);
    return righe;
  }

  function gradienteMarchio(ctx, x, y, w, h) {
    const g = ctx.createLinearGradient(x, y, x + w, y + (h || 0));
    g.addColorStop(0, C.cyan400);
    g.addColorStop(1, C.violet500);
    return g;
  }

  function rettArr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  /* ================================================================== */
  /* Risorse: font, glifi delle icone, logo                              */
  /* ================================================================== */

  const ICONE = {};   // classe bootstrap-icons → carattere
  let logoRitoccato = null;
  let logoPronto = false;

  /**
   * Ricava il carattere di ogni icona leggendo il `content` dello pseudo-elemento,
   * invece di scriversi a mano i codepoint: così un aggiornamento di
   * bootstrap-icons non rompe silenziosamente le icone del video.
   */
  function caricaGlifi(classi) {
    const cassetto = document.createElement('div');
    cassetto.style.cssText = 'position:absolute;visibility:hidden;left:-9999px';
    document.body.appendChild(cassetto);
    for (const classe of classi) {
      const i = document.createElement('i');
      i.className = 'bi ' + classe;
      cassetto.appendChild(i);
      const contenuto = getComputedStyle(i, '::before').content || '';
      ICONE[classe] = contenuto.replace(/^["']|["']$/g, '');
    }
    cassetto.remove();
  }

  function icona(ctx, classe, x, y, dim, colore) {
    const glifo = ICONE[classe];
    ctx.save();
    ctx.fillStyle = colore;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (glifo) {
      ctx.font = F.icona(dim);
      ctx.fillText(glifo, x, y);
    } else {
      // Ripiego se il font delle icone non è arrivato: un pallino, non un rettangolo vuoto.
      ctx.beginPath();
      ctx.arc(x, y, dim * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Il logo del sito è un PNG da 180×51: ingrandito a dimensione video verrebbe
   * sfocato. Essendo bianco su trasparente basta rileggerne il canale alfa e
   * ricontrastarlo dopo l'ingrandimento per riavere i bordi netti.
   */
  function preparaLogo(dataURI, larghezza) {
    return new Promise(risolvi => {
      const img = new Image();
      img.onload = () => {
        const h = Math.round(larghezza * (img.height / img.width));
        const c = document.createElement('canvas');
        c.width = larghezza; c.height = h;
        const x = c.getContext('2d');
        x.imageSmoothingEnabled = true;
        x.imageSmoothingQuality = 'high';
        x.drawImage(img, 0, 0, larghezza, h);

        const dati = x.getImageData(0, 0, larghezza, h);
        const p = dati.data;
        for (let i = 0; i < p.length; i += 4) {
          const a = p[i + 3] / 255;
          const nitido = clamp01((a - 0.5) * 2.1 + 0.5);
          p[i] = 255; p[i + 1] = 255; p[i + 2] = 255;   // il logo è bianco pieno
          p[i + 3] = Math.round(nitido * 255);
        }
        x.putImageData(dati, 0, 0);
        logoRitoccato = c;
        logoPronto = true;
        risolvi();
      };
      img.onerror = () => risolvi();
      img.src = dataURI;
    });
  }

  function disegnaLogo(ctx, x, y, larghezza, alpha) {
    if (!logoPronto) return;
    const h = larghezza * (logoRitoccato.height / logoRitoccato.width);
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.drawImage(logoRitoccato, x - larghezza / 2, y - h / 2, larghezza, h);
    ctx.restore();
  }

  /* ================================================================== */
  /* Clip di repertorio                                                 */
  /* ================================================================== */

  const CLIP = {};          // nome → elemento <video>
  let clipInCorso = null;   // quella che sta suonando adesso

  /**
   * Prepara le clip a partire dai byte passati da Node (blob, non file://:
   * Chromium rifiuta i media da file:// e un video così contaminerebbe comunque
   * il canvas, rendendo impossibile registrarlo).
   */
  async function preparaClip(sorgenti) {
    await Promise.all(Object.entries(sorgenti).map(([nome, byte]) => new Promise(risolvi => {
      const v = document.createElement('video');
      v.src = URL.createObjectURL(new Blob([byte], { type: 'video/mp4' }));
      v.muted = true;          // l'audio delle clip non serve: la colonna è nostra
      v.loop = true;
      v.playsInline = true;
      v.preload = 'auto';
      const pronto = () => { CLIP[nome] = v; risolvi(); };
      v.oncanplaythrough = pronto;
      v.onerror = risolvi;
      setTimeout(pronto, 10000);   // meglio una clip non pronta che un blocco
    })));
  }

  /**
   * Disegna la clip a tutto schermo con un lento avvicinamento (Ken Burns) e la
   * velatura che tiene leggibile il testo sopra. Senza velatura il fondo di una
   * ripresa reale è troppo mosso e chiaro perché il testo si stacchi.
   */
  function disegnaClip(ctx, S, d, p) {
    const v = CLIP[d.clip];
    if (!v || !v.videoWidth) return false;

    const [z0, z1] = d.zoom || [1.12, 1.02];
    const z = mix(z0, z1, easeInOut(p));
    const scala = Math.max(S.W / v.videoWidth, S.H / v.videoHeight) * z;
    const w = v.videoWidth * scala, h = v.videoHeight * scala;
    ctx.drawImage(v, (S.W - w) / 2, (S.H - h) / 2, w, h);

    ctx.drawImage(velatura(S, d.velatura || 1), 0, 0);
    return true;
  }

  const VELATURE = new Map();

  /**
   * La velatura sopra le clip: tre riempimenti a tutto schermo, disegnati una
   * volta sola su un canvas fuori schermo e poi solo ricopiati.
   *
   * Non cambia nel tempo — dipende solo dalla scena — e rifarla trenta volte al
   * secondo costava fotogrammi: tre superfici da due milioni di pixel, di cui
   * una con gradiente radiale, sono il conto più salato di tutto il fotogramma.
   */
  function velatura(S, forza) {
    const chiave = `${S.W}x${S.H}@${forza}`;
    if (VELATURE.has(chiave)) return VELATURE.get(chiave);

    const c = document.createElement('canvas');
    c.width = S.W; c.height = S.H;
    const x = c.getContext('2d');
    const alfa = v => Math.min(0.97, v * forza);

    // Scura verso il bordo da cui entra il testo, più chiara dall'altra parte:
    // il testo si stacca e la ripresa resta visibile dove non dà fastidio.
    const g = S.vert ? x.createLinearGradient(0, 0, 0, S.H) : x.createLinearGradient(0, 0, S.W, 0);
    g.addColorStop(0, `rgba(6,10,23,${alfa(0.93)})`);
    g.addColorStop(0.55, `rgba(6,10,23,${alfa(0.72)})`);
    g.addColorStop(1, `rgba(6,10,23,${alfa(0.55)})`);
    x.fillStyle = g;
    x.fillRect(0, 0, S.W, S.H);

    // Un velo del blu di marca sopra a tutto: le clip arrivano da riprese
    // diverse e senza questo si vedrebbe che non sono girate insieme.
    x.fillStyle = `rgba(10,15,34,${alfa(0.34)})`;
    x.fillRect(0, 0, S.W, S.H);

    const vig = x.createRadialGradient(S.W / 2, S.H / 2, Math.min(S.W, S.H) * 0.3, S.W / 2, S.H / 2, Math.max(S.W, S.H) * 0.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.6)');
    x.fillStyle = vig;
    x.fillRect(0, 0, S.W, S.H);

    VELATURE.set(chiave, c);
    return c;
  }

  /** Fa partire la clip della scena e ferma quella di prima. */
  function riproduci(d) {
    const v = d && d.clip ? CLIP[d.clip] : null;
    if (v === clipInCorso) return;
    if (clipInCorso) clipInCorso.pause();
    clipInCorso = v;
    if (!v) return;
    try { v.currentTime = d.clipDa || 0; } catch { /* non ancora cercabile */ }
    v.play().catch(() => {});
  }

  /* ================================================================== */
  /* Sfondo                                                             */
  /* ================================================================== */

  let particelle = [];
  let base = null;          // fondo scuro + vignettatura, disegnato una volta sola

  function preparaSfondo(S) {
    const rnd = seminato(20240729);
    particelle = [];
    const quante = S.vert ? 46 : 56;
    for (let i = 0; i < quante; i++) {
      particelle.push({
        x: rnd() * S.W, y: rnd() * S.H,
        vx: (rnd() - 0.5) * 22, vy: (rnd() - 0.5) * 22,   // px al secondo
      });
    }

    base = document.createElement('canvas');
    base.width = S.W; base.height = S.H;
    const b = base.getContext('2d');
    const g = b.createRadialGradient(S.W * 0.2, S.H * 0.18, 0, S.W * 0.2, S.H * 0.18, Math.max(S.W, S.H) * 0.95);
    g.addColorStop(0, '#132043');
    g.addColorStop(0.6, C.navy950);
    g.addColorStop(1, C.navy950);
    b.fillStyle = g;
    b.fillRect(0, 0, S.W, S.H);

    const v = b.createRadialGradient(S.W / 2, S.H / 2, Math.min(S.W, S.H) * 0.35, S.W / 2, S.H / 2, Math.max(S.W, S.H) * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.55)');
    b.fillStyle = v;
    b.fillRect(0, 0, S.W, S.H);
  }

  /** Generatore pseudocasuale con seme: le particelle partono sempre uguali. */
  function seminato(seme) {
    let s = seme >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function sfondo(ctx, S, t) {
    ctx.drawImage(base, 0, 0);

    // Due aloni del marchio che scorrono lentamente: danno profondità al fondo piatto.
    const alone = (cx, cy, r, colore, a) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, colore.replace('ALPHA', a));
      g.addColorStop(1, colore.replace('ALPHA', 0));
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    };
    const r = Math.max(S.W, S.H) * 0.42;
    alone(S.W * (0.18 + 0.06 * Math.sin(t * 0.18)), S.H * (0.22 + 0.05 * Math.cos(t * 0.13)), r, 'rgba(34,211,238,ALPHA)', 0.1);
    alone(S.W * (0.86 + 0.05 * Math.cos(t * 0.15)), S.H * (0.78 + 0.05 * Math.sin(t * 0.11)), r, 'rgba(99,102,241,ALPHA)', 0.12);

    sfondoRete(ctx, S, t);
  }

  /**
   * La sola rete di particelle, senza il fondo scuro: sopra una clip si sovrappone
   * questa, sul fondo generato si sovrappone dopo gli aloni.
   *
   * Le posizioni si calcolano dal tempo assoluto con rimbalzo sui bordi, così non
   * serve accumulare stato fra un fotogramma e l'altro.
   */
  function sfondoRete(ctx, S, t) {
    const maxD = S.vert ? 210 : 245;
    for (const p of particelle) {
      p.px = rimbalza(p.x + p.vx * t, S.W);
      p.py = rimbalza(p.y + p.vy * t, S.H);
    }
    // I segmenti si raggruppano in quattro fasce di trasparenza e ogni fascia è
    // un solo tracciato. Con uno `stroke()` per segmento erano oltre mille
    // chiamate per fotogramma: la differenza si vede nel conto dei fotogrammi
    // persi, non a schermo.
    const FASCE = 4;
    const tracciati = Array.from({ length: FASCE }, () => new Path2D());
    for (let i = 0; i < particelle.length; i++) {
      for (let j = i + 1; j < particelle.length; j++) {
        const dx = particelle[i].px - particelle[j].px;
        const dy = particelle[i].py - particelle[j].py;
        const d = Math.hypot(dx, dy);
        if (d >= maxD) continue;
        const fascia = Math.min(FASCE - 1, Math.floor((1 - d / maxD) * FASCE));
        tracciati[fascia].moveTo(particelle[i].px, particelle[i].py);
        tracciati[fascia].lineTo(particelle[j].px, particelle[j].py);
      }
    }
    ctx.lineWidth = 1;
    tracciati.forEach((tracciato, f) => {
      ctx.strokeStyle = `rgba(103,232,249,${0.16 * ((f + 0.5) / FASCE)})`;
      ctx.stroke(tracciato);
    });

    const punti = new Path2D();
    for (const p of particelle) {
      punti.moveTo(p.px + 2, p.py);
      punti.arc(p.px, p.py, 2, 0, Math.PI * 2);
    }
    ctx.fillStyle = cyanA(0.35);
    ctx.fill(punti);
  }

  /** Ripiega una coordinata su [0, max] come se rimbalzasse sui bordi. */
  function rimbalza(v, max) {
    const periodo = max * 2;
    let x = ((v % periodo) + periodo) % periodo;
    return x > max ? periodo - x : x;
  }

  /* ================================================================== */
  /* Elementi ricorrenti                                                */
  /* ================================================================== */

  function occhiello(ctx, S, testo, x, y, a, allineamento) {
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.font = F.corpo(700, 20 * S.s);
    ctx.textAlign = allineamento || 'left';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = `${2.2 * S.s}px`;
    const larg = ctx.measureText(testo.toUpperCase()).width;
    const px = allineamento === 'center' ? x - larg / 2 : x;

    ctx.fillStyle = cyanA(0.9);
    ctx.beginPath();
    ctx.arc(px - 16 * S.s, y, 4 * S.s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = C.cyan300;
    ctx.fillText(testo.toUpperCase(), allineamento === 'center' ? x : x, y);
    ctx.letterSpacing = '0px';
    ctx.restore();
  }

  /**
   * Titolo grande. Accetta una stringa (va a capo da sola) oppure righe già
   * spezzate di segmenti `{t, g}`, dove `g` colora il segmento col gradiente.
   */
  function titolo(ctx, S, contenuto, x, y, maxW, dim, a, allineamento) {
    if (a <= 0) return y;
    const interlinea = dim * 1.1;
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.font = F.testa(600, dim);
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = `${-dim * 0.02}px`;

    let righe;
    if (typeof contenuto === 'string') righe = avvolgi(ctx, contenuto, maxW).map(r => [{ t: r }]);
    else righe = contenuto.map(r => (typeof r === 'string' ? [{ t: r }] : r));

    righe.forEach((segmenti, i) => {
      const totale = segmenti.reduce((s, seg) => s + ctx.measureText(seg.t).width, 0);
      let px = allineamento === 'center' ? x - totale / 2 : x;
      const py = y + i * interlinea;
      for (const seg of segmenti) {
        const w = ctx.measureText(seg.t).width;
        ctx.fillStyle = seg.g ? gradienteMarchio(ctx, px, py, w, 0) : C.bianco;
        ctx.textAlign = 'left';
        ctx.fillText(seg.t, px, py);
        px += w;
      }
    });
    ctx.letterSpacing = '0px';
    ctx.restore();
    return y + righe.length * interlinea;
  }

  /** Quante righe occuperà un titolo, per poterci lasciare lo spazio prima di disegnarlo. */
  function righeTitolo(ctx, contenuto, maxW, dim) {
    if (typeof contenuto !== 'string') return contenuto.length;
    ctx.save();
    ctx.font = F.testa(600, dim);
    ctx.letterSpacing = `${-dim * 0.02}px`;
    const n = avvolgi(ctx, contenuto, maxW).length;
    ctx.restore();
    return n;
  }

  function paragrafo(ctx, S, testo, x, y, maxW, dim, a, allineamento) {
    if (a <= 0) return y;
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.font = F.corpo(400, dim);
    ctx.fillStyle = soft(0.74);
    ctx.textAlign = allineamento || 'left';
    ctx.textBaseline = 'middle';
    const righe = avvolgi(ctx, testo, maxW);
    const interlinea = dim * 1.5;
    righe.forEach((r, i) => ctx.fillText(r, x, y + i * interlinea));
    ctx.restore();
    return y + righe.length * interlinea;
  }

  /** Riquadro in vetro: il fondo delle carte, dei riquadri e dei chip. */
  function vetro(ctx, x, y, w, h, r, a, bordoCyan) {
    ctx.save();
    ctx.globalAlpha *= a;
    rettArr(ctx, x, y, w, h, r);
    ctx.fillStyle = 'rgba(255,255,255,0.045)';
    ctx.fill();
    ctx.strokeStyle = bordoCyan ? cyanA(0.35) : soft(0.1);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  /** Quadratino con l'icona, come le `.icon-wrap` del sito. */
  function iconaRiquadro(ctx, S, classe, x, y, lato, a) {
    ctx.save();
    ctx.globalAlpha *= a;
    rettArr(ctx, x, y, lato, lato, lato * 0.3);
    ctx.fillStyle = gradienteMarchio(ctx, x, y, lato, lato);
    ctx.globalAlpha *= 0.22;
    ctx.fill();
    ctx.globalAlpha /= 0.22;
    ctx.strokeStyle = cyanA(0.3);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    icona(ctx, classe, x + lato / 2, y + lato / 2 + lato * 0.02, lato * 0.48, C.cyan300);
    ctx.restore();
  }

  /** Spunta che si disegna da sola, usata negli elenchi di vantaggi. */
  function spunta(ctx, x, y, raggio, p, colore) {
    ctx.save();
    ctx.strokeStyle = colore;
    ctx.lineWidth = raggio * 0.16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha *= 0.35;
    ctx.beginPath();
    ctx.arc(x, y, raggio, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp01(p * 1.4));
    ctx.stroke();
    ctx.globalAlpha /= 0.35;

    const q = clamp01((p - 0.35) / 0.65);
    if (q > 0) {
      const punti = [
        [x - raggio * 0.42, y + raggio * 0.03],
        [x - raggio * 0.12, y + raggio * 0.35],
        [x + raggio * 0.45, y - raggio * 0.32],
      ];
      ctx.beginPath();
      ctx.moveTo(punti[0][0], punti[0][1]);
      if (q < 0.5) {
        const k = q / 0.5;
        ctx.lineTo(mix(punti[0][0], punti[1][0], k), mix(punti[0][1], punti[1][1], k));
      } else {
        const k = (q - 0.5) / 0.5;
        ctx.lineTo(punti[1][0], punti[1][1]);
        ctx.lineTo(mix(punti[1][0], punti[2][0], k), mix(punti[1][1], punti[2][1], k));
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ================================================================== */
  /* Layout                                                             */
  /* ================================================================== */

  function misure(W, H) {
    const vert = H > W;
    // In verticale il testo deve pesare di più rispetto alla larghezza: si guarda
    // sul telefono, spesso a schermo piccolo, e un corpo tarato sul 16:9 sarebbe
    // illeggibile. Da qui la scala diversa fra i due formati.
    const S = { W, H, vert, s: vert ? W / 1000 : W / 1920 };
    S.m = vert ? 70 : 150 * S.s;
    S.cw = W - S.m * 2;
    // In verticale il contenuto sta lontano dai bordi corti: nelle storie, sopra
    // e sotto ci finiscono nome account, didascalia e pulsanti dell'app.
    S.top = vert ? 210 : 118;
    S.bot = vert ? H - 270 : H - 118;
    S.cy = (S.top + S.bot) / 2;
    S.ch = S.bot - S.top;
    return S;
  }

  /** Due pannelli affiancati in orizzontale, impilati in verticale. */
  function pannelli(S, rapporto) {
    if (!S.vert) {
      const gap = 90 * S.s;
      const wt = (S.cw - gap) * (rapporto || 0.52);
      return {
        testo: { x: S.m, y: S.top, w: wt, h: S.ch },
        vis: { x: S.m + wt + gap, y: S.top, w: S.cw - wt - gap, h: S.ch },
      };
    }
    const gap = 40 * S.s;
    const ht = S.ch * 0.32;
    return {
      testo: { x: S.m, y: S.top, w: S.cw, h: ht },
      vis: { x: S.m, y: S.top + ht + gap, w: S.cw, h: S.ch - ht - gap },
    };
  }

  /* ================================================================== */
  /* Scene                                                              */
  /* ================================================================== */

  const SCENE = {};

  /* --- 1. apertura ------------------------------------------------- */
  SCENE.apertura = (ctx, S, d, t) => {
    const cx = S.W / 2, cy = S.cy;
    const largLogo = S.vert ? S.cw * 0.82 : 470 * S.s;

    const aLogo = app(t, 0.35, 0.9);
    ctx.save();
    ctx.translate(cx, cy - 40 * S.s);
    ctx.scale(mix(0.93, 1, aLogo), mix(0.93, 1, aLogo));
    disegnaLogo(ctx, 0, 0, largLogo, aLogo);
    ctx.restore();

    // Riga col gradiente che si apre sotto il logo.
    const aRiga = app(t, 1.0, 0.9);
    if (aRiga > 0) {
      const w = largLogo * 0.9 * aRiga;
      const y = cy + 40 * S.s;
      ctx.save();
      ctx.globalAlpha *= aRiga;
      const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
      g.addColorStop(0, cyanA(0));
      g.addColorStop(0.5, C.cyan400);
      g.addColorStop(1, violA(0));
      ctx.fillStyle = g;
      ctx.fillRect(cx - w / 2, y, w, 2.5 * S.s);
      ctx.restore();
    }

    const aSotto = app(t, 1.35, 0.8);
    if (aSotto > 0) {
      ctx.save();
      ctx.globalAlpha *= aSotto;
      ctx.font = F.corpo(500, 30 * S.s);
      ctx.fillStyle = soft(0.8);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = `${3 * S.s}px`;
      ctx.fillText(d.sottotitolo.toUpperCase(), cx, cy + 92 * S.s);
      ctx.fillStyle = C.cyan300;
      ctx.font = F.corpo(600, 24 * S.s);
      ctx.fillText(d.luogo.toUpperCase(), cx, cy + 142 * S.s);
      ctx.letterSpacing = '0px';
      ctx.restore();
    }
  };

  /* --- 2. il problema ---------------------------------------------- */
  SCENE.problema = (ctx, S, d, t) => {
    const P = pannelli(S, 0.5);
    const b = P.testo;
    const dimT = S.vert ? 62 * S.s : 68 * S.s;

    let y = S.vert ? b.y + 40 * S.s : b.y + b.h * 0.3;
    occhiello(ctx, S, d.occhiello, b.x, y, app(t, 0.15));
    y += 52 * S.s;
    y = titolo(ctx, S, d.titolo, b.x, y + dimT * 0.5, b.w, dimT, app(t, 0.3)) - dimT * 0.5;
    y += 46 * S.s;
    paragrafo(ctx, S, d.testo, b.x, y, b.w, 27 * S.s, app(t, 0.75));

    /* Visuale: i sistemi dell'azienda, collegati fra loro. */
    const v = P.vis;
    const cx = v.x + v.w / 2, cy = v.y + v.h / 2;
    const raggio = Math.min(v.w, v.h) * 0.37;
    const nodi = d.nodi.map((n, i) => {
      const ang = -Math.PI / 2 + (i / d.nodi.length) * Math.PI * 2;
      return { ...n, x: cx + Math.cos(ang) * raggio, y: cy + Math.sin(ang) * raggio };
    });

    const aRete = app(t, 0.5, 1.2);
    // Verso la fine un collegamento si spegne: è il "quando qualcosa si ferma".
    const guasto = clamp01((t - 5.2) / 1.1);
    const nodoFermo = 3;

    ctx.save();
    ctx.globalAlpha *= aRete;
    nodi.forEach((n, i) => {
      const spento = i === nodoFermo ? guasto : 0;
      ctx.strokeStyle = spento > 0
        ? `rgba(251,191,36,${0.5 * spento + 0.28 * (1 - spento)})`
        : cyanA(0.28);
      ctx.lineWidth = 1.6 * S.s;
      ctx.setLineDash(spento > 0.5 ? [6 * S.s, 6 * S.s] : []);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Impulso che viaggia dal centro verso il nodo.
      if (spento < 0.5) {
        const fase = ((t * 0.55 + i * 0.17) % 1);
        const px = mix(cx, n.x, fase), py = mix(cy, n.y, fase);
        ctx.fillStyle = cyanA(0.85 * Math.sin(fase * Math.PI));
        ctx.beginPath();
        ctx.arc(px, py, 4 * S.s, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Centro: l'azienda.
    const rc = 54 * S.s;
    ctx.beginPath();
    ctx.arc(cx, cy, rc, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(10,15,34,0.9)';
    ctx.fill();
    ctx.strokeStyle = cyanA(0.5);
    ctx.lineWidth = 2 * S.s;
    ctx.stroke();
    icona(ctx, 'bi-building', cx, cy, 42 * S.s, C.bianco);

    nodi.forEach((n, i) => {
      const a = app(t, 0.7 + i * 0.11, 0.5);
      if (a <= 0) return;
      const spento = i === nodoFermo ? guasto : 0;
      const r = 44 * S.s;
      ctx.save();
      ctx.globalAlpha *= a;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15,23,48,0.92)';
      ctx.fill();
      ctx.strokeStyle = spento > 0 ? `rgba(251,191,36,${0.4 + 0.5 * spento})` : cyanA(0.35);
      ctx.lineWidth = 2 * S.s;
      ctx.stroke();
      icona(ctx, n.icona, n.x, n.y, 34 * S.s, spento > 0.4 ? C.ambra : soft(0.9));

      ctx.font = F.corpo(500, 19 * S.s);
      ctx.fillStyle = soft(0.55);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.etichetta, n.x, n.y + r + 24 * S.s);
      ctx.restore();
    });
    ctx.restore();
  };

  /* --- 3. chi siamo ------------------------------------------------ */
  SCENE.chiSiamo = (ctx, S, d, t) => {
    const x = S.W / 2;
    const dimT = S.vert ? 64 * S.s : 76 * S.s;
    let y = S.cy - (S.vert ? 200 : 170) * S.s;

    occhiello(ctx, S, d.occhiello, x, y, app(t, 0.1), 'center');
    y += 66 * S.s;

    y = titolo(ctx, S, d.titoloRighe, x, y + dimT * 0.5, S.cw, dimT, app(t, 0.25), 'center') - dimT * 0.5;
    y += 56 * S.s;

    y = paragrafo(ctx, S, d.testo, x, y, S.cw * (S.vert ? 1 : 0.68), 28 * S.s, app(t, 0.6), 'center');
    y += 62 * S.s;

    // Tre dati, come la fascia statistiche della home.
    const n = d.dati.length;
    const largo = S.vert ? S.cw : Math.min(S.cw, 1000 * S.s);
    const passo = largo / n;
    d.dati.forEach((dato, i) => {
      const a = app(t, 1.0 + i * 0.16, 0.6);
      if (a <= 0) return;
      const dx = x - largo / 2 + passo * (i + 0.5);
      ctx.save();
      ctx.globalAlpha *= a;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = F.testa(700, 60 * S.s);
      ctx.fillStyle = gradienteMarchio(ctx, dx - 70 * S.s, 0, 140 * S.s, 0);
      ctx.fillText(dato.valore, dx, y);
      ctx.font = F.corpo(500, 21 * S.s);
      ctx.fillStyle = soft(0.6);
      ctx.fillText(dato.etichetta, dx, y + 52 * S.s);
      if (i < n - 1) {
        ctx.strokeStyle = soft(0.12);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dx + passo / 2, y - 34 * S.s);
        ctx.lineTo(dx + passo / 2, y + 58 * S.s);
        ctx.stroke();
      }
      ctx.restore();
    });
  };

  /* --- 4. i servizi ------------------------------------------------ */
  SCENE.servizi = (ctx, S, d, t) => {
    const x = S.W / 2;
    let y = S.top + (S.vert ? 10 : 20) * S.s;

    occhiello(ctx, S, d.occhiello, x, y, app(t, 0.1), 'center');
    y += 62 * S.s;
    y = titolo(ctx, S, d.titolo, x, y + 30 * S.s, S.cw, S.vert ? 58 * S.s : 66 * S.s, app(t, 0.2), 'center') + 8 * S.s;
    y += 40 * S.s;

    const colonne = S.vert ? 1 : 2;
    const righe = Math.ceil(d.carte.length / colonne);
    const gap = 28 * S.s;
    const cw = (S.cw - gap * (colonne - 1)) / colonne;
    // Le carte non si allargano a riempire lo spazio: prendono l'altezza che
    // serve al contenuto e la griglia si centra in quello che resta.
    const disponibile = S.bot - y;
    const ch = Math.min((disponibile - gap * (righe - 1)) / righe, 250 * S.s);
    const y0 = y + (disponibile - (ch * righe + gap * (righe - 1))) / 2;

    d.carte.forEach((carta, i) => {
      const a = app(t, 0.7 + i * 0.55, 0.7);
      if (a <= 0) return;
      const col = i % colonne, rig = Math.floor(i / colonne);
      const cx = S.m + col * (cw + gap);
      const cy = y0 + rig * (ch + gap);
      const sposta = (1 - a) * 26 * S.s;

      ctx.save();
      ctx.translate(0, sposta);
      vetro(ctx, cx, cy, cw, ch, 26 * S.s, a);

      const lato = Math.min(76 * S.s, ch * 0.34);
      const pad = 34 * S.s;
      iconaRiquadro(ctx, S, carta.icona, cx + pad, cy + pad, lato, a);

      ctx.globalAlpha *= a;
      ctx.font = F.testa(600, 32 * S.s);
      ctx.fillStyle = C.bianco;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(carta.titolo, cx + pad + lato + 22 * S.s, cy + pad + lato / 2);

      ctx.globalAlpha /= a;
      paragrafo(ctx, S, carta.testo, cx + pad, cy + pad + lato + 44 * S.s, cw - pad * 2, 24 * S.s, a);
      ctx.restore();
    });
  };

  /* --- 5. i servizi continuativi ----------------------------------- */
  SCENE.continuativi = (ctx, S, d, t) => {
    const x = S.W / 2;
    let y = S.top + (S.vert ? 20 : 40) * S.s;

    occhiello(ctx, S, d.occhiello, x, y, app(t, 0.1), 'center');
    y += 62 * S.s;
    y = titolo(ctx, S, d.titolo, x, y + 32 * S.s, S.cw, S.vert ? 60 * S.s : 68 * S.s, app(t, 0.2), 'center');
    y += 52 * S.s;

    const n = d.riquadri.length;
    const colonne = S.vert ? 1 : n;
    const gap = 26 * S.s;
    const cw = (S.cw - gap * (colonne - 1)) / colonne;
    const disponibile = S.bot - y - 80 * S.s;   // 80: la pillola "24/7" sotto
    const righe = S.vert ? n : 1;
    const ch = Math.min((disponibile - gap * (righe - 1)) / righe, (S.vert ? 235 : 330) * S.s);
    const y0 = y + (disponibile - (ch * righe + gap * (righe - 1))) / 2;

    d.riquadri.forEach((r, i) => {
      const a = app(t, 0.6 + i * 0.35, 0.6);
      if (a <= 0) return;
      const cx = S.vert ? S.m : S.m + i * (cw + gap);
      const cy = S.vert ? y0 + i * (ch + gap) : y0;
      ctx.save();
      ctx.translate(0, (1 - a) * 22 * S.s);
      vetro(ctx, cx, cy, cw, ch, 24 * S.s, a);

      const pad = 30 * S.s;
      const lato = 66 * S.s;
      if (S.vert) {
        iconaRiquadro(ctx, S, r.icona, cx + pad, cy + (ch - lato) / 2, lato, a);
        ctx.globalAlpha *= a;
        ctx.font = F.testa(600, 30 * S.s);
        ctx.fillStyle = C.bianco;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(r.titolo, cx + pad + lato + 22 * S.s, cy + ch * 0.36);
        ctx.globalAlpha /= a;
        paragrafo(ctx, S, r.testo, cx + pad + lato + 22 * S.s, cy + ch * 0.62, cw - pad * 2 - lato - 22 * S.s, 22 * S.s, a);
      } else {
        iconaRiquadro(ctx, S, r.icona, cx + pad, cy + pad, lato, a);
        ctx.globalAlpha *= a;
        ctx.font = F.testa(600, 31 * S.s);
        ctx.fillStyle = C.bianco;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(r.titolo, cx + pad, cy + pad + lato + 40 * S.s);
        ctx.globalAlpha /= a;
        paragrafo(ctx, S, r.testo, cx + pad, cy + pad + lato + 92 * S.s, cw - pad * 2, 23 * S.s, a);
      }
      ctx.restore();
    });

    // Riga finale: il monitoraggio non si ferma.
    const aP = app(t, 1.9, 0.7);
    if (aP > 0) {
      ctx.save();
      ctx.globalAlpha *= aP;
      const py = y0 + ch * righe + gap * (righe - 1) + 54 * S.s;
      ctx.font = F.corpo(600, 24 * S.s);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const w = ctx.measureText(d.piede).width + 60 * S.s;
      vetro(ctx, x - w / 2, py - 26 * S.s, w, 52 * S.s, 26 * S.s, 1, true);
      ctx.fillStyle = C.cyan300;
      ctx.fillText(d.piede, x, py);
      ctx.restore();
    }
  };

  /* --- 6. tecnoSHIELD ---------------------------------------------- */
  SCENE.shield = (ctx, S, d, t) => {
    const P = pannelli(S, 0.54);
    const v = P.vis, b = P.testo;

    /* Lo scudo. */
    const lato = Math.min(v.w, v.h) * (S.vert ? 0.82 : 0.9);
    const sx = v.x + v.w / 2, sy = v.y + v.h / 2;
    const aScudo = app(t, 0.2, 1);

    ctx.save();
    ctx.globalAlpha *= aScudo;
    ctx.translate(sx, sy);
    ctx.scale(mix(0.9, 1, aScudo), mix(0.9, 1, aScudo));

    const w = lato * 0.62, h = lato * 0.78;
    const scudo = new Path2D();
    scudo.moveTo(0, -h / 2);
    scudo.lineTo(w / 2, -h / 2 + h * 0.16);
    scudo.lineTo(w / 2, h * 0.08);
    scudo.quadraticCurveTo(w / 2, h / 2 - h * 0.05, 0, h / 2);
    scudo.quadraticCurveTo(-w / 2, h / 2 - h * 0.05, -w / 2, h * 0.08);
    scudo.lineTo(-w / 2, -h / 2 + h * 0.16);
    scudo.closePath();

    const gs = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    gs.addColorStop(0, 'rgba(34,211,238,0.16)');
    gs.addColorStop(1, 'rgba(99,102,241,0.16)');
    ctx.fillStyle = gs;
    ctx.fill(scudo);
    ctx.strokeStyle = gradienteMarchio(ctx, -w / 2, -h / 2, w, h);
    ctx.lineWidth = 3.5 * S.s;
    ctx.stroke(scudo);

    // Passata di luce che scorre dentro lo scudo: la scansione continua.
    ctx.save();
    ctx.clip(scudo);
    const fase = ((t - 0.6) * 0.42) % 1.6;
    const yl = -h / 2 + fase * h;
    const gl = ctx.createLinearGradient(0, yl - h * 0.16, 0, yl + h * 0.16);
    gl.addColorStop(0, cyanA(0));
    gl.addColorStop(0.5, cyanA(0.3));
    gl.addColorStop(1, cyanA(0));
    ctx.fillStyle = gl;
    ctx.fillRect(-w / 2, yl - h * 0.16, w, h * 0.32);
    ctx.restore();

    // Anelli concentrici che pulsano attorno allo scudo.
    for (let i = 0; i < 3; i++) {
      const fp = ((t * 0.4 + i / 3) % 1);
      ctx.strokeStyle = cyanA(0.16 * (1 - fp));
      ctx.lineWidth = 1.5 * S.s;
      ctx.beginPath();
      ctx.arc(0, 0, lato * 0.34 + fp * lato * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }

    spunta(ctx, 0, h * 0.02, w * 0.26, clamp01((t - 1.1) / 1.0), C.cyan300);
    ctx.restore();

    /* Il testo. */
    let y = S.vert ? b.y + 20 * S.s : b.y + b.h * 0.16;
    const aTag = app(t, 0.35);
    if (aTag > 0) {
      ctx.save();
      ctx.globalAlpha *= aTag;
      ctx.font = F.corpo(600, 23 * S.s);
      ctx.fillStyle = C.cyan300;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = `${1.6 * S.s}px`;
      ctx.fillText(d.tagline, b.x, y);
      ctx.letterSpacing = '0px';
      ctx.restore();
    }
    y += 76 * S.s;

    // Il marchio del servizio: "tecno" bianco, "SHIELD" col gradiente.
    const aNome = app(t, 0.5, 0.8);
    if (aNome > 0) {
      const dim = S.vert ? 78 * S.s : 88 * S.s;
      ctx.save();
      ctx.globalAlpha *= aNome;
      ctx.font = F.testa(700, dim);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = `${-dim * 0.02}px`;
      const w1 = ctx.measureText('tecno').width;
      ctx.fillStyle = C.bianco;
      ctx.fillText('tecno', b.x, y);
      const w2 = ctx.measureText('SHIELD').width;
      ctx.fillStyle = gradienteMarchio(ctx, b.x + w1, y, w2, 0);
      ctx.fillText('SHIELD', b.x + w1, y);
      ctx.letterSpacing = '0px';
      ctx.restore();
    }
    y += 78 * S.s;

    y = paragrafo(ctx, S, d.testo, b.x, y, b.w, 26 * S.s, app(t, 0.9));
    y += 44 * S.s;

    d.vantaggi.forEach((vt, i) => {
      const a = app(t, 1.5 + i * 0.3, 0.55);
      if (a <= 0) return;
      const vy = y + i * 52 * S.s;
      ctx.save();
      ctx.globalAlpha *= a;
      spunta(ctx, b.x + 15 * S.s, vy, 15 * S.s, clamp01((t - (1.5 + i * 0.3)) / 0.6), C.successo);
      ctx.font = F.corpo(500, 25 * S.s);
      ctx.fillStyle = soft(0.86);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(vt, b.x + 46 * S.s, vy);
      ctx.restore();
    });
  };

  /* --- 7. il check-up ---------------------------------------------- */
  SCENE.checkup = (ctx, S, d, t) => {
    const x = S.W / 2;
    let y = S.top + (S.vert ? 20 : 30) * S.s;

    occhiello(ctx, S, d.occhiello, x, y, app(t, 0.1), 'center');
    y += 62 * S.s;
    y = titolo(ctx, S, d.titolo, x, y + 32 * S.s, S.cw, S.vert ? 56 * S.s : 66 * S.s, app(t, 0.2), 'center');
    y += 34 * S.s;
    y = paragrafo(ctx, S, d.testo, x, y, S.cw * (S.vert ? 1 : 0.66), 26 * S.s, app(t, 0.55), 'center');
    y += 56 * S.s;

    /* I passi si accendono uno dopo l'altro, come il widget della home. */
    const largo = S.vert ? S.cw : Math.min(S.cw, 1080 * S.s);
    const disponibile = S.bot - y - 70 * S.s;   // 70: la riga finale sotto
    const altezzaRiga = Math.min((S.vert ? 130 : 86) * S.s, disponibile / d.passi.length);
    y += (disponibile - altezzaRiga * d.passi.length) / 2;
    d.passi.forEach((passo, i) => {
      const inizio = 1.1 + i * 0.9;
      const a = app(t, inizio, 0.5);
      if (a <= 0) return;
      const py = y + i * altezzaRiga + altezzaRiga / 2;
      const px = x - largo / 2;
      const avanzamento = clamp01((t - inizio - 0.35) / 0.8);

      ctx.save();
      ctx.globalAlpha *= a;
      vetro(ctx, px, py - altezzaRiga * 0.42, largo, altezzaRiga * 0.84, 16 * S.s, 1, avanzamento > 0.99);

      spunta(ctx, px + 40 * S.s, py, 17 * S.s, avanzamento, avanzamento > 0.99 ? C.successo : C.cyan300);

      ctx.font = F.corpo(500, 26 * S.s);
      ctx.fillStyle = soft(avanzamento > 0.99 ? 0.92 : 0.6);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(passo, px + 78 * S.s, py);

      if (avanzamento > 0.99) {
        ctx.font = F.corpo(600, 20 * S.s);
        ctx.fillStyle = C.successo;
        ctx.textAlign = 'right';
        ctx.fillText('verificato', px + largo - 32 * S.s, py);
      }
      ctx.restore();
    });

    const aP = app(t, 4.6, 0.7);
    if (aP > 0) {
      ctx.save();
      ctx.globalAlpha *= aP;
      ctx.font = F.corpo(500, 23 * S.s);
      ctx.fillStyle = soft(0.55);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(d.piede, x, S.bot - 16 * S.s);
      ctx.restore();
    }
  };

  /* --- 8. i settori ------------------------------------------------ */
  SCENE.settori = (ctx, S, d, t) => {
    const x = S.W / 2;
    let y = S.top + (S.vert ? 30 : 50) * S.s;

    occhiello(ctx, S, d.occhiello, x, y, app(t, 0.1), 'center');
    y += 62 * S.s;
    y = titolo(ctx, S, d.titolo, x, y + 32 * S.s, S.cw, S.vert ? 58 * S.s : 66 * S.s, app(t, 0.2), 'center');
    y += 60 * S.s;

    const colonne = S.vert ? 2 : 4;
    const righe = Math.ceil(d.settori.length / colonne);
    const gap = 20 * S.s;
    const cw = (S.cw - gap * (colonne - 1)) / colonne;
    const disponibile = S.bot - y;
    const ch = Math.min((S.vert ? 132 : 96) * S.s, (disponibile - gap * (righe - 1)) / righe);
    const y0 = y + (disponibile - (ch * righe + gap * (righe - 1))) / 2;

    d.settori.forEach((settore, i) => {
      const a = app(t, 0.75 + i * 0.09, 0.5);
      if (a <= 0) return;
      const col = i % colonne, rig = Math.floor(i / colonne);
      const cx = S.m + col * (cw + gap);
      const cy = y0 + rig * (ch + gap);
      ctx.save();
      ctx.globalAlpha *= a;
      ctx.translate(0, (1 - a) * 14 * S.s);
      vetro(ctx, cx, cy, cw, ch, 18 * S.s, 1);
      const lato = ch * 0.52;
      iconaRiquadro(ctx, S, settore.icona, cx + 22 * S.s, cy + (ch - lato) / 2, lato, 1);
      ctx.font = F.corpo(600, Math.min(24, cw / (settore.nome.length * 0.62)) * S.s);
      ctx.fillStyle = soft(0.9);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(settore.nome, cx + 22 * S.s + lato + 18 * S.s, cy + ch / 2);
      ctx.restore();
    });
  };

  /* --- 9. perché Tecnolink ----------------------------------------- */
  SCENE.perche = (ctx, S, d, t) => {
    const x = S.W / 2;
    let y = S.cy - (S.vert ? 260 : 200) * S.s;

    occhiello(ctx, S, d.occhiello, x, y, app(t, 0.1), 'center');
    y += 74 * S.s;

    // La citazione della pagina "Chi siamo", trattata come tale.
    const aCit = app(t, 0.3, 0.9);
    if (aCit > 0) {
      ctx.save();
      ctx.globalAlpha *= aCit;
      const dim = S.vert ? 44 * S.s : 50 * S.s;
      ctx.font = F.testa(600, dim);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const maxW = S.cw * (S.vert ? 1 : 0.82);
      const righe = avvolgi(ctx, d.citazione, maxW);
      righe.forEach((r, i) => {
        ctx.fillStyle = i === righe.length - 1 ? C.cyan300 : C.bianco;
        ctx.fillText(r, x, y + i * dim * 1.32);
      });
      y += righe.length * dim * 1.32;
      ctx.restore();
    }
    y += 56 * S.s;

    const colonne = S.vert ? 1 : 2;
    const gap = 26 * S.s;
    const largo = S.vert ? S.cw : Math.min(S.cw, 980 * S.s);
    const cw = (largo - gap * (colonne - 1)) / colonne;
    const ch = (S.vert ? 185 : 190) * S.s;

    d.valori.forEach((val, i) => {
      const a = app(t, 1.4 + i * 0.28, 0.6);
      if (a <= 0) return;
      const cx = x - largo / 2 + (i % colonne) * (cw + gap);
      const cy = y + Math.floor(i / colonne) * (ch + gap);
      ctx.save();
      ctx.translate(0, (1 - a) * 20 * S.s);
      vetro(ctx, cx, cy, cw, ch, 24 * S.s, a);
      const pad = 30 * S.s;
      const lato = 60 * S.s;
      iconaRiquadro(ctx, S, val.icona, cx + pad, cy + pad, lato, a);
      ctx.globalAlpha *= a;
      ctx.font = F.testa(600, 30 * S.s);
      ctx.fillStyle = C.bianco;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(val.titolo, cx + pad + lato + 20 * S.s, cy + pad + lato / 2);
      ctx.globalAlpha /= a;
      paragrafo(ctx, S, val.testo, cx + pad, cy + pad + lato + 36 * S.s, cw - pad * 2, 23 * S.s, a);
      ctx.restore();
    });
  };

  /* --- 10. chiusura ------------------------------------------------ */
  SCENE.chiusura = (ctx, S, d, t) => {
    const x = S.W / 2;
    let y = S.cy - (S.vert ? 300 : 250) * S.s;

    const largLogo = S.vert ? S.cw * 0.55 : 340 * S.s;
    const aLogo = app(t, 0.1, 0.8);
    disegnaLogo(ctx, x, y, largLogo, aLogo);
    // Lo stacco si misura dall'altezza vera del logo, non a occhio: in verticale
    // il logo è molto più largo e col valore fisso finiva sopra al titolo.
    y += largLogo * (51 / 180) / 2 + 70 * S.s;

    y = titolo(ctx, S, d.titolo, x, y, S.cw, S.vert ? 62 * S.s : 74 * S.s, app(t, 0.4), 'center');
    y += 46 * S.s;
    y = paragrafo(ctx, S, d.testo, x, y, S.cw * (S.vert ? 1 : 0.62), 27 * S.s, app(t, 0.7), 'center');
    y += 76 * S.s;

    const colonne = S.vert ? 1 : 2;
    const gap = 22 * S.s;
    const largo = S.vert ? S.cw : Math.min(S.cw, 900 * S.s);
    const cw = (largo - gap * (colonne - 1)) / colonne;
    const ch = 76 * S.s;

    d.contatti.forEach((c, i) => {
      const a = app(t, 1.1 + i * 0.2, 0.6);
      if (a <= 0) return;
      const cx = x - largo / 2 + (i % colonne) * (cw + gap);
      const cy = y + Math.floor(i / colonne) * (ch + gap);
      ctx.save();
      ctx.globalAlpha *= a;
      vetro(ctx, cx, cy, cw, ch, 20 * S.s, 1);
      icona(ctx, c.icona, cx + 44 * S.s, cy + ch / 2, 30 * S.s, C.cyan300);
      ctx.font = F.corpo(600, 27 * S.s);
      ctx.fillStyle = C.bianco;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.testo, cx + 76 * S.s, cy + ch / 2);
      ctx.restore();
    });

    // Barra col gradiente del marchio che chiude il video.
    const aBarra = app(t, 2.4, 1.2);
    if (aBarra > 0) {
      const w = S.cw * aBarra;
      ctx.save();
      ctx.globalAlpha *= aBarra;
      ctx.fillStyle = gradienteMarchio(ctx, x - w / 2, 0, w, 0);
      ctx.fillRect(x - w / 2, S.bot + (S.vert ? 60 : 40) * S.s, w, 4 * S.s);
      ctx.restore();
    }
  };

  /* ================================================================== */
  /* Montaggio breve — scene da 4-6 secondi sopra le clip                */
  /* ================================================================== */

  /*
   * Queste scene hanno metà del tempo di quelle lunghe e un fondo che si muove,
   * quindi cambiano tre cose: gli elementi entrano in 0,35 s invece di 0,55,
   * salgono da più lontano (si nota anche a colpo d'occhio) e il testo è tagliato
   * al minimo. Sopra una ripresa reale un paragrafo lungo non si legge.
   */

  const rapido = (t, ritardo) => app(t, ritardo, 0.35);

  /** Il blocco di testo: a sinistra in orizzontale, in alto in verticale. */
  function blocco(S) {
    return S.vert
      ? { x: S.m, w: S.cw, ancora: S.top + 300 * S.s }
      : { x: S.m, w: S.cw * 0.6, ancora: S.cy };
  }

  /** Entrata con scivolata: usata da tutti gli elementi del montaggio breve. */
  function entra(ctx, a, distanza, disegnaDentro) {
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.translate(0, (1 - a) * distanza);
    disegnaDentro();
    ctx.restore();
  }

  /* --- 1. apertura ------------------------------------------------- */
  SCENE.aperturaBreve = (ctx, S, d, t) => {
    const cx = S.W / 2, cy = S.cy;
    const largLogo = S.vert ? S.cw * 0.86 : 520 * S.s;

    const aLogo = rapido(t, 0.15);
    ctx.save();
    ctx.translate(cx, cy - 30 * S.s);
    ctx.scale(mix(0.88, 1, aLogo), mix(0.88, 1, aLogo));
    disegnaLogo(ctx, 0, 0, largLogo, aLogo);
    ctx.restore();

    const aRiga = rapido(t, 0.5);
    if (aRiga > 0) {
      const w = largLogo * 0.92 * aRiga;
      const y = cy + 46 * S.s;
      ctx.save();
      ctx.globalAlpha *= aRiga;
      const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
      g.addColorStop(0, cyanA(0));
      g.addColorStop(0.5, C.cyan400);
      g.addColorStop(1, violA(0));
      ctx.fillStyle = g;
      ctx.fillRect(cx - w / 2, y, w, 3 * S.s);
      ctx.restore();
    }

    entra(ctx, rapido(t, 0.75), 20 * S.s, () => {
      ctx.font = F.corpo(600, 30 * S.s);
      ctx.fillStyle = soft(0.88);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = `${3 * S.s}px`;
      ctx.fillText(d.sottotitolo.toUpperCase(), cx, cy + 100 * S.s);
      ctx.font = F.corpo(700, 25 * S.s);
      ctx.fillStyle = C.cyan300;
      ctx.fillText(d.luogo.toUpperCase(), cx, cy + 150 * S.s);
      ctx.letterSpacing = '0px';
    });
  };

  /* --- 2. la dichiarazione ----------------------------------------- */
  SCENE.dichiarazione = (ctx, S, d, t) => {
    const b = blocco(S);
    const dim = S.vert ? 72 * S.s : 82 * S.s;
    const alto = d.righe.length * dim * 1.1 + 90 * S.s;
    let y = b.ancora - alto / 2 + dim * 0.55;

    d.righe.forEach((riga, i) => {
      entra(ctx, rapido(t, 0.1 + i * 0.14), 36 * S.s, () => {
        titolo(ctx, S, [riga], b.x, y + i * dim * 1.1, b.w, dim, 1);
      });
    });

    entra(ctx, rapido(t, 0.5), 24 * S.s, () => {
      paragrafo(ctx, S, d.sotto, b.x, y + d.righe.length * dim * 1.1 + 16 * S.s, b.w, 27 * S.s, 1);
    });
  };

  /* --- 3. i servizi in rapida --------------------------------------- */
  SCENE.serviziRapidi = (ctx, S, d, t) => {
    const b = blocco(S);
    const colonne = S.vert ? 1 : 2;
    const righe = Math.ceil(d.voci.length / colonne);
    const gap = 16 * S.s;
    const hv = 78 * S.s;
    const largo = S.vert ? S.cw : S.cw * 0.78;
    const cw = (largo - gap * (colonne - 1)) / colonne;

    // L'altezza del titolo va misurata, non stimata: "Quattro aree, un solo
    // interlocutore." su due righe si mangiava la prima fila di voci.
    const dimT = S.vert ? 58 * S.s : 60 * S.s;
    const nRighe = righeTitolo(ctx, d.titolo, b.w, dimT);
    const altoTitolo = nRighe * dimT * 1.1;

    const alto = 52 * S.s + altoTitolo + 30 * S.s + righe * (hv + gap);
    let y = b.ancora - alto / 2;

    entra(ctx, rapido(t, 0.05), 20 * S.s, () => occhiello(ctx, S, d.occhiello, b.x, y, 1));
    y += 52 * S.s;
    entra(ctx, rapido(t, 0.15), 30 * S.s, () => {
      titolo(ctx, S, d.titolo, b.x, y + dimT * 0.55, b.w, dimT, 1);
    });
    y += altoTitolo + 30 * S.s;

    d.voci.forEach((v, i) => {
      const a = rapido(t, 0.5 + i * 0.18);
      if (a <= 0) return;
      const col = i % colonne, rig = Math.floor(i / colonne);
      const vx = b.x + col * (cw + gap);
      const vy = y + rig * (hv + gap);
      ctx.save();
      ctx.globalAlpha *= a;
      ctx.translate((1 - a) * -26 * S.s, 0);
      vetro(ctx, vx, vy, cw, hv, 16 * S.s, 1, true);
      const lato = hv * 0.62;
      iconaRiquadro(ctx, S, v.icona, vx + 15 * S.s, vy + (hv - lato) / 2, lato, 1);
      ctx.font = F.corpo(600, 28 * S.s);
      ctx.fillStyle = C.bianco;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(v.testo, vx + 15 * S.s + lato + 18 * S.s, vy + hv / 2);
      ctx.restore();
    });
  };

  /* --- 4. tecnoSHIELD ----------------------------------------------- */
  SCENE.shieldBreve = (ctx, S, d, t) => {
    const b = blocco(S);
    const dimNome = S.vert ? 92 * S.s : 104 * S.s;
    const alto = 200 * S.s;
    let y = b.ancora - alto / 2;

    entra(ctx, rapido(t, 0.05), 20 * S.s, () => {
      ctx.font = F.corpo(700, 24 * S.s);
      ctx.fillStyle = C.cyan300;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = `${1.8 * S.s}px`;
      ctx.fillText(d.tagline, b.x, y);
      ctx.letterSpacing = '0px';
    });
    y += 84 * S.s;

    // Il marchio del servizio entra in due tempi: prima "tecno", poi "SHIELD"
    // col gradiente — è l'accento visivo della scena.
    const a1 = rapido(t, 0.2), a2 = rapido(t, 0.42);
    ctx.save();
    ctx.font = F.testa(700, dimNome);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = `${-dimNome * 0.02}px`;
    const w1 = ctx.measureText('tecno').width;
    if (a1 > 0) {
      ctx.save();
      ctx.globalAlpha *= a1;
      ctx.translate((1 - a1) * -30 * S.s, 0);
      ctx.fillStyle = C.bianco;
      ctx.fillText('tecno', b.x, y);
      ctx.restore();
    }
    if (a2 > 0) {
      ctx.save();
      ctx.globalAlpha *= a2;
      ctx.translate((1 - a2) * 30 * S.s, 0);
      const w2 = ctx.measureText('SHIELD').width;
      ctx.fillStyle = gradienteMarchio(ctx, b.x + w1, y, w2, 0);
      ctx.fillText('SHIELD', b.x + w1, y);
      ctx.restore();
    }
    ctx.letterSpacing = '0px';
    ctx.restore();
    y += 76 * S.s;

    entra(ctx, rapido(t, 0.7), 22 * S.s, () => {
      paragrafo(ctx, S, d.testo, b.x, y, b.w, 27 * S.s, 1);
    });

    // Scudo defilato, come filigrana: il protagonista è la parola.
    if (!S.vert) {
      const aScudo = app(t, 0.3, 1.2);
      const lato = S.H * 0.52;
      const sx = S.W - S.m - lato * 0.42, sy = S.cy;
      ctx.save();
      ctx.globalAlpha *= aScudo * 0.5;
      ctx.translate(sx, sy);
      const w = lato * 0.62, h = lato * 0.78;
      const scudo = new Path2D();
      scudo.moveTo(0, -h / 2);
      scudo.lineTo(w / 2, -h / 2 + h * 0.16);
      scudo.lineTo(w / 2, h * 0.08);
      scudo.quadraticCurveTo(w / 2, h / 2 - h * 0.05, 0, h / 2);
      scudo.quadraticCurveTo(-w / 2, h / 2 - h * 0.05, -w / 2, h * 0.08);
      scudo.lineTo(-w / 2, -h / 2 + h * 0.16);
      scudo.closePath();
      ctx.strokeStyle = gradienteMarchio(ctx, -w / 2, -h / 2, w, h);
      ctx.lineWidth = 4 * S.s;
      ctx.stroke(scudo);
      ctx.save();
      ctx.clip(scudo);
      const fase = ((t * 0.5) % 1.4);
      const yl = -h / 2 + fase * h;
      const gl = ctx.createLinearGradient(0, yl - h * 0.18, 0, yl + h * 0.18);
      gl.addColorStop(0, cyanA(0));
      gl.addColorStop(0.5, cyanA(0.34));
      gl.addColorStop(1, cyanA(0));
      ctx.fillStyle = gl;
      ctx.fillRect(-w / 2, yl - h * 0.18, w, h * 0.36);
      ctx.restore();
      spunta(ctx, 0, h * 0.02, w * 0.24, clamp01((t - 0.8) / 0.9), C.cyan300);
      ctx.restore();
    }
  };

  /* --- 5. il check-up ----------------------------------------------- */
  SCENE.checkupBreve = (ctx, S, d, t) => {
    const b = blocco(S);
    const colonne = S.vert ? 2 : 2;
    const righe = Math.ceil(d.passi.length / colonne);
    const gap = 14 * S.s;
    const hp = 56 * S.s;
    const largo = S.vert ? S.cw : S.cw * 0.62;
    const cw = (largo - gap * (colonne - 1)) / colonne;

    const dimT = S.vert ? 54 * S.s : 56 * S.s;
    const altoTitolo = righeTitolo(ctx, d.titolo, b.w, dimT) * dimT * 1.1;

    const alto = 52 * S.s + altoTitolo + 30 * S.s + righe * (hp + gap) + 50 * S.s;
    let y = b.ancora - alto / 2;

    entra(ctx, rapido(t, 0.05), 20 * S.s, () => occhiello(ctx, S, d.occhiello, b.x, y, 1));
    y += 52 * S.s;
    entra(ctx, rapido(t, 0.12), 30 * S.s, () => {
      titolo(ctx, S, d.titolo, b.x, y + dimT * 0.55, b.w, dimT, 1);
    });
    y += altoTitolo + 30 * S.s;

    d.passi.forEach((passo, i) => {
      const inizio = 0.45 + i * 0.16;
      const a = rapido(t, inizio);
      if (a <= 0) return;
      const col = i % colonne, rig = Math.floor(i / colonne);
      const px = b.x + col * (cw + gap);
      const py = y + rig * (hp + gap);
      ctx.save();
      ctx.globalAlpha *= a;
      ctx.translate(0, (1 - a) * 18 * S.s);
      vetro(ctx, px, py, cw, hp, 14 * S.s, 1, true);
      spunta(ctx, px + 30 * S.s, py + hp / 2, 14 * S.s, clamp01((t - inizio - 0.1) / 0.45), C.successo);
      ctx.font = F.corpo(600, 24 * S.s);
      ctx.fillStyle = soft(0.92);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(passo, px + 58 * S.s, py + hp / 2);
      ctx.restore();
    });

    y += righe * (hp + gap) + 16 * S.s;
    entra(ctx, rapido(t, 1.4), 16 * S.s, () => {
      ctx.font = F.corpo(500, 23 * S.s);
      ctx.fillStyle = soft(0.6);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(d.piede, b.x, y);
    });
  };

  /* --- 6. la chiusura ------------------------------------------------ */
  SCENE.chiusuraBreve = (ctx, S, d, t) => {
    const cx = S.W / 2;
    const largLogo = S.vert ? S.cw * 0.62 : 380 * S.s;
    const altoLogo = largLogo * (51 / 180);
    const alto = altoLogo + 300 * S.s;
    let y = S.cy - alto / 2 + altoLogo / 2;

    disegnaLogo(ctx, cx, y, largLogo, rapido(t, 0.05));
    y += altoLogo / 2 + 74 * S.s;

    entra(ctx, rapido(t, 0.25), 30 * S.s, () => {
      titolo(ctx, S, d.titolo, cx, y, S.cw, S.vert ? 66 * S.s : 78 * S.s, 1, 'center');
    });
    y += 96 * S.s;

    const gap = 20 * S.s;
    const colonne = S.vert ? 1 : d.contatti.length;
    const cw = S.vert ? S.cw : Math.min(S.cw, 880 * S.s) / colonne - gap / 2;
    const ch = 80 * S.s;
    const largo = colonne * cw + (colonne - 1) * gap;

    d.contatti.forEach((c, i) => {
      const a = rapido(t, 0.55 + i * 0.14);
      if (a <= 0) return;
      const px = S.vert ? S.m : cx - largo / 2 + i * (cw + gap);
      const py = S.vert ? y + i * (ch + gap) : y;
      ctx.save();
      ctx.globalAlpha *= a;
      ctx.translate(0, (1 - a) * 22 * S.s);
      vetro(ctx, px, py, cw, ch, 20 * S.s, 1, true);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = F.corpo(700, 30 * S.s);
      const larghezzaTesto = ctx.measureText(c.testo).width;
      const inizio = px + (cw - (larghezzaTesto + 46 * S.s)) / 2;
      icona(ctx, c.icona, inizio + 16 * S.s, py + ch / 2, 30 * S.s, C.cyan300);
      ctx.fillStyle = C.bianco;
      ctx.textAlign = 'left';
      ctx.fillText(c.testo, inizio + 46 * S.s, py + ch / 2);
      ctx.restore();
    });

    // Barra del marchio che chiude: entra da sinistra e resta.
    const aBarra = app(t, 1.2, 1.4);
    if (aBarra > 0) {
      const w = S.cw * easeOut(aBarra);
      ctx.save();
      ctx.fillStyle = gradienteMarchio(ctx, S.m, 0, S.cw, 0);
      ctx.fillRect(S.m, S.bot - 6 * S.s, w, 4 * S.s);
      ctx.restore();
    }
  };

  /* ================================================================== */
  /* Composizione                                                        */
  /* ================================================================== */

  let S = null;
  let ctx = null;
  let scaletta = [];
  let durata = 0;

  function costruisciScaletta(contenuti) {
    let inizio = 0;
    scaletta = contenuti.scene.map(d => {
      const voce = { d, inizio, durata: d.secondi, disegna: SCENE[d.tipo] };
      inizio += d.secondi;
      return voce;
    });
    durata = inizio;
  }

  /** Un fotogramma completo all'istante `t` (secondi dall'inizio). */
  function disegna(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, S.W, S.H);

    const voce = scaletta.find(v => t >= v.inizio && t < v.inizio + v.durata) || scaletta[scaletta.length - 1];
    if (!voce || !voce.disegna) return;
    const locale = t - voce.inizio;
    const p = clamp01(locale / voce.durata);

    riproduci(voce.d);

    // Con una clip sotto, la rete di particelle resta ma appena accennata: serve
    // a legare il video al sito, non a farsi notare sopra una ripresa vera.
    const conClip = voce.d.clip ? disegnaClip(ctx, S, voce.d, p) : false;
    if (conClip) {
      ctx.save();
      ctx.globalAlpha = 0.45;
      sfondoRete(ctx, S, t);
      ctx.restore();
    } else {
      sfondo(ctx, S, t);
    }

    // Nel montaggio breve le scene si scambiano in fretta: dissolvenza corta e
    // scivolata più marcata. In quello lungo il passaggio resta quasi invisibile.
    const veloce = voce.durata <= 7;
    const entrata = easeInOut(clamp01(locale / (veloce ? 0.3 : 0.5)));
    const uscita = easeInOut(clamp01((voce.durata - locale) / (veloce ? 0.28 : 0.45)));

    ctx.save();
    ctx.globalAlpha = entrata * uscita;
    ctx.translate(0, (1 - entrata) * (veloce ? 40 : 26) * S.s - (1 - uscita) * (veloce ? 30 : 18) * S.s);
    voce.disegna(ctx, S, voce.d, locale);
    ctx.restore();

    if (veloce) lampo(ctx, S, locale);

    // Filo del marchio in basso: avanzamento del video.
    const av = clamp01(t / durata);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(0, S.H - 4, S.W, 4);
    ctx.fillStyle = gradienteMarchio(ctx, 0, 0, S.W, 0);
    ctx.fillRect(0, S.H - 4, S.W * av, 4);
  }

  /**
   * Lama di luce che attraversa il fotogramma a ogni cambio di scena. È quello
   * che fa leggere lo stacco come voluto invece che come un salto: dura meno di
   * mezzo secondo e cade sul tempo della musica.
   */
  function lampo(ctx, S, locale) {
    const p = clamp01(locale / 0.42);
    if (p >= 1) return;
    const e = easeInOut(p);
    const larghezza = S.W * 0.42;
    const x = -larghezza + e * (S.W + larghezza * 2);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.5 * Math.sin(p * Math.PI);
    ctx.translate(x, 0);
    ctx.transform(1, 0, -0.35, 1, 0, 0);
    const g = ctx.createLinearGradient(0, 0, larghezza, 0);
    g.addColorStop(0, 'rgba(34,211,238,0)');
    g.addColorStop(0.5, 'rgba(103,232,249,0.5)');
    g.addColorStop(1, 'rgba(99,102,241,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, -S.H * 0.2, larghezza, S.H * 1.4);
    ctx.restore();
  }

  /** Carica font, glifi, logo e clip, poi prepara il canvas. Va atteso prima di disegnare. */
  async function prepara(canvas, contenuti, risorse, clip) {
    S = misure(canvas.width, canvas.height);
    ctx = canvas.getContext('2d', { alpha: false });

    const classi = new Set(['bi-building']);
    for (const s of contenuti.scene) {
      for (const chiave of ['nodi', 'carte', 'riquadri', 'settori', 'valori', 'contatti', 'voci']) {
        (s[chiave] || []).forEach(v => v.icona && classi.add(v.icona));
      }
    }

    await Promise.all([
      ...['400 40px Inter', '500 40px Inter', '600 40px Inter', '700 40px Inter',
        '600 40px Poppins', '700 40px Poppins', '40px bootstrap-icons']
        .map(f => document.fonts.load(f).catch(() => {})),
      preparaLogo(risorse.logo, 1400),
      clip ? preparaClip(clip) : Promise.resolve(),
    ]);
    await document.fonts.ready;

    caricaGlifi(classi);
    preparaSfondo(S);
    costruisciScaletta(contenuti);
    return { durata, S };
  }

  /**
   * Porta la clip della scena esattamente al fotogramma dell'istante `t`.
   *
   * In registrazione le clip vanno in riproduzione normale e si sincronizzano da
   * sole, perché anche l'incisione è in tempo reale. Per estrarre un fermo
   * immagine invece bisogna cercare il punto giusto e aspettare: senza, il
   * provino mostrerebbe il fotogramma a caso su cui la clip si era fermata.
   */
  async function preparaFotogramma(t) {
    const voce = scaletta.find(v => t >= v.inizio && t < v.inizio + v.durata) || scaletta[scaletta.length - 1];
    if (!voce || !voce.d.clip) return;
    const v = CLIP[voce.d.clip];
    if (!v) return;
    if (clipInCorso && clipInCorso !== v) clipInCorso.pause();
    clipInCorso = v;
    v.pause();
    const istante = (voce.d.clipDa || 0) + (t - voce.inizio);
    await new Promise(ok => {
      v.onseeked = ok;
      setTimeout(ok, 4000);
      v.currentTime = Math.min(istante, Math.max(0, (v.duration || 1) - 0.05));
    });
  }

  window.TK = { prepara, disegna, preparaFotogramma, get durata() { return durata; } };
})();
