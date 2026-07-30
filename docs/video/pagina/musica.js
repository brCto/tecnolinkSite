/**
 * Colonna sonora del montaggio breve, sintetizzata con la Web Audio API.
 *
 * Non è una traccia scaricata: è generata qui, nota per nota. Due motivi, e il
 * primo è pratico. La musica di repertorio ha licenze proprie da verificare e da
 * rinnovare, e ogni volta che si cambia la durata di una scena bisogna
 * rimontarla; questa invece segue la scaletta da sola. Il secondo è che così i
 * cambi di scena cadono esattamente sul tempo, perché sono le scene a essere
 * state scritte su multipli di due secondi — una battuta a 120 bpm.
 *
 * L'impianto è quello di un sottofondo istituzionale: un basso che pulsa, un
 * tappeto di archi sintetici che tiene l'accordo, un arpeggio che dà movimento e
 * un fruscio che sale a ogni stacco. Sale di intensità verso la chiamata
 * all'azione e si chiude in dissolvenza.
 */

(function () {
  'use strict';

  /* La progressione: una battuta per accordo, quindici battute in trenta secondi.
     La minore → Fa → Do → Sol, il giro più ospitale che ci sia: comincia serio e
     si apre verso la fine, che è esattamente l'arco del video. */
  const ACCORDI = {
    Am: { basso: 110.00, note: [220.00, 261.63, 329.63] },
    F:  { basso: 87.31,  note: [174.61, 220.00, 261.63] },
    C:  { basso: 130.81, note: [261.63, 329.63, 392.00] },
    G:  { basso: 98.00,  note: [196.00, 246.94, 293.66] },
  };

  const GIRO = ['Am', 'Am', 'F', 'F', 'C', 'C', 'G', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F', 'G'];

  /** Rumore bianco, riusato da fruscii e stacchi. */
  function fruscio(ac, durata) {
    const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * durata), ac.sampleRate);
    const dati = buffer.getChannelData(0);
    for (let i = 0; i < dati.length; i++) dati[i] = Math.random() * 2 - 1;
    return buffer;
  }

  /**
   * Costruisce la colonna e la programma tutta in anticipo a partire da `t0`.
   *
   * Programmare in anticipo invece di suonare "quando tocca" è ciò che tiene la
   * musica allineata al video: l'orologio della scheda audio non salta, quello
   * dei fotogrammi sì.
   */
  function componi(ac, { t0, durata, bpm = 120, stacchi = [], narrazione = [] }) {
    const battuta = (60 / bpm) * 4;          // 2 s
    const battito = 60 / bpm;                // 0,5 s
    const destinazione = ac.createMediaStreamDestination();

    // Catena finale: un compressore morbido tiene insieme i livelli, il volume
    // generale entra e esce in dissolvenza.
    const generale = ac.createGain();
    const limite = ac.createDynamicsCompressor();
    limite.threshold.value = -10;
    limite.knee.value = 22;
    limite.ratio.value = 5;
    limite.attack.value = 0.004;
    limite.release.value = 0.18;
    generale.connect(limite);
    limite.connect(destinazione);

    generale.gain.setValueAtTime(0.0001, t0);
    generale.gain.exponentialRampToValueAtTime(0.9, t0 + 0.8);
    generale.gain.setValueAtTime(0.9, t0 + durata - 1.6);
    generale.gain.exponentialRampToValueAtTime(0.0001, t0 + durata - 0.05);

    /* --- il tappeto ------------------------------------------------- */
    const pad = ac.createGain();
    pad.gain.value = 0.16;
    const filtroPad = ac.createBiquadFilter();
    filtroPad.type = 'lowpass';
    filtroPad.frequency.setValueAtTime(700, t0);
    filtroPad.frequency.linearRampToValueAtTime(2200, t0 + durata * 0.8);
    pad.connect(filtroPad);
    filtroPad.connect(generale);

    GIRO.forEach((nome, i) => {
      const inizio = t0 + i * battuta;
      if (inizio >= t0 + durata) return;
      const accordo = ACCORDI[nome];
      for (const nota of accordo.note) {
        // Due oscillatori leggermente scordati per nota: è quello che fa
        // "largo" un suono sintetico, invece di sottile e metallico.
        for (const scarto of [-3, 3]) {
          const o = ac.createOscillator();
          const g = ac.createGain();
          o.type = 'sawtooth';
          o.frequency.value = nota;
          o.detune.value = scarto;
          g.gain.setValueAtTime(0.0001, inizio);
          g.gain.exponentialRampToValueAtTime(0.5, inizio + 0.35);
          g.gain.setValueAtTime(0.5, inizio + battuta - 0.3);
          g.gain.exponentialRampToValueAtTime(0.0001, inizio + battuta + 0.05);
          o.connect(g); g.connect(pad);
          o.start(inizio);
          o.stop(inizio + battuta + 0.1);
        }
      }
    });

    /* --- il basso che pulsa ------------------------------------------ */
    const bassi = ac.createGain();
    bassi.gain.value = 0.5;
    bassi.connect(generale);

    for (let b = 0; b * battito < durata; b++) {
      const quando = t0 + b * battito;
      const accordo = ACCORDI[GIRO[Math.min(Math.floor(b / 4), GIRO.length - 1)]];
      const forte = b % 4 === 0;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(accordo.basso, quando);
      g.gain.setValueAtTime(0.0001, quando);
      g.gain.exponentialRampToValueAtTime(forte ? 0.55 : 0.3, quando + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, quando + (forte ? 0.42 : 0.24));
      o.connect(g); g.connect(bassi);
      o.start(quando);
      o.stop(quando + 0.5);
    }

    /* --- l'arpeggio --------------------------------------------------- */
    // Entra dopo due battute: il video comincia col logo, e partire già pieno
    // toglierebbe alla musica la possibilità di crescere.
    const arp = ac.createGain();
    arp.gain.value = 0.0;
    arp.gain.setValueAtTime(0.0001, t0);
    arp.gain.linearRampToValueAtTime(0.1, t0 + battuta * 2);
    arp.gain.linearRampToValueAtTime(0.16, t0 + battuta * 7);
    arp.gain.linearRampToValueAtTime(0.2, t0 + battuta * 12);

    const eco = ac.createDelay(1);
    eco.delayTime.value = battito / 2;
    const ritorno = ac.createGain();
    ritorno.gain.value = 0.32;
    const filtroEco = ac.createBiquadFilter();
    filtroEco.type = 'highpass';
    filtroEco.frequency.value = 900;
    arp.connect(generale);
    arp.connect(eco); eco.connect(filtroEco); filtroEco.connect(ritorno); ritorno.connect(eco); ritorno.connect(generale);

    for (let ottavo = 0; (ottavo * battito) / 2 < durata; ottavo++) {
      const quando = t0 + (ottavo * battito) / 2;
      if (quando < t0 + battuta * 2) continue;
      const accordo = ACCORDI[GIRO[Math.min(Math.floor(((ottavo * battito) / 2) / battuta), GIRO.length - 1)]];
      const nota = accordo.note[[0, 2, 1, 2][ottavo % 4]] * 2;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'triangle';
      o.frequency.value = nota;
      g.gain.setValueAtTime(0.0001, quando);
      g.gain.exponentialRampToValueAtTime(0.5, quando + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, quando + 0.22);
      o.connect(g); g.connect(arp);
      o.start(quando);
      o.stop(quando + 0.3);
    }

    /* --- gli stacchi -------------------------------------------------- */
    // Un fruscio che sale su ogni cambio di scena: è la controparte sonora
    // della lama di luce che attraversa il fotogramma.
    const bufferFruscio = fruscio(ac, 1.2);
    for (const quando of stacchi) {
      if (quando <= 0.05 || quando >= durata) continue;
      const s = ac.createBufferSource();
      s.buffer = bufferFruscio;
      const f = ac.createBiquadFilter();
      f.type = 'bandpass';
      f.Q.value = 1.2;
      const g = ac.createGain();
      const inizio = t0 + quando - 0.55;
      f.frequency.setValueAtTime(400, inizio);
      f.frequency.exponentialRampToValueAtTime(6000, t0 + quando);
      g.gain.setValueAtTime(0.0001, inizio);
      g.gain.exponentialRampToValueAtTime(0.13, t0 + quando - 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + quando + 0.28);
      s.connect(f); f.connect(g); g.connect(generale);
      s.start(inizio);
      s.stop(t0 + quando + 0.4);
    }

    /* --- la voce ------------------------------------------------------ */
    // Quando c'è il narratore la musica si abbassa: senza, le due cose si
    // coprono a vicenda e non si capisce nessuna delle due.
    const musicaSotto = ac.createGain();
    if (narrazione.length) {
      const voce = ac.createGain();
      voce.gain.value = 1.5;
      voce.connect(destinazione);

      for (const b of narrazione) {
        const s = ac.createBufferSource();
        s.buffer = b.buffer;
        s.connect(voce);
        s.start(t0 + b.quando);

        const a = t0 + b.quando - 0.25;
        const z = t0 + b.quando + b.buffer.duration + 0.3;
        generale.gain.cancelScheduledValues(a);
        generale.gain.setTargetAtTime(0.34, a, 0.12);
        generale.gain.setTargetAtTime(0.9, z, 0.2);
      }
      // La dissolvenza finale va riprogrammata: le abbassate l'hanno sovrascritta.
      generale.gain.setTargetAtTime(0.0001, t0 + durata - 1.2, 0.35);
    }
    musicaSotto.connect(generale);

    return destinazione;
  }

  window.TK_MUSICA = { componi };
})();
