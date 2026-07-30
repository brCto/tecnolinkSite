/**
 * Montaggio breve: 30 secondi, con clip di repertorio e base musicale.
 *
 * È la versione da campagna — ritmo veloce, una sola idea per scena, testi
 * pensati per essere letti mentre sotto scorre un video. Il montaggio lungo
 * (1:29, senza clip) sta in `contenuti.js` ed è più adatto alla home del sito.
 *
 * Le durate sono multipli di 2 secondi: a 120 battute al minuto una battuta dura
 * esattamente 2 s, così ogni cambio di scena cade sul tempo della musica invece
 * che a caso. È da lì che viene la sensazione di ritmo.
 *
 * `clip` è il nome di una clip dichiarata in `clip/scarica.mjs`; `clipDa` è il
 * secondo da cui parte, scelto per prendere la parte più leggibile della ripresa.
 * `voce` è il testo del narratore, generato a parte e mixato solo nella versione
 * con voce.
 */

window.TK_CONTENUTI_BREVE = {

  bpm: 120,

  scene: [

    /* 1 --- 0 → 4 ------------------------------------------------------- */
    {
      tipo: 'aperturaBreve',
      secondi: 4,
      clip: 'ufficio', clipDa: 1.5, zoom: [1.18, 1.04],
      sottotitolo: 'Sistemi informatici e cybersecurity',
      luogo: 'Firenze',
      voce: 'Tecnolink. Sicurezza informatica.',
    },

    /* 2 --- 4 → 8 ------------------------------------------------------- */
    {
      tipo: 'dichiarazione',
      secondi: 4,
      clip: 'tecnico', clipDa: 2, zoom: [1.05, 1.2],
      righe: [
        [{ t: 'Se si fermano i sistemi,' }],
        [{ t: 'si ferma ' }, { t: 'il lavoro', g: true }, { t: '.' }],
      ],
      sotto: 'Email, gestionale, backup, dispositivi dei collaboratori.',
      voce: 'Se si fermano i sistemi, si ferma il lavoro.',
    },

    /* 3 --- 8 → 14 ------------------------------------------------------ */
    {
      tipo: 'serviziRapidi',
      secondi: 6,
      clip: 'circuito', clipDa: 0.5, zoom: [1.1, 1.24],
      occhiello: 'Cosa facciamo',
      titolo: 'Quattro aree, un solo interlocutore.',
      voci: [
        { icona: 'bi-diagram-3', testo: 'Sistemi informatici' },
        { icona: 'bi-headset', testo: 'Helpdesk e assistenza' },
        { icona: 'bi-shield-lock', testo: 'Cybersicurezza' },
        { icona: 'bi-mortarboard', testo: 'Consulenza e formazione' },
      ],
      voce: 'Progettiamo, assistiamo, proteggiamo e formiamo.',
    },

    /* 4 --- 14 → 20 ----------------------------------------------------- */
    {
      tipo: 'shieldBreve',
      secondi: 6,
      // Velatura rinforzata: nella ripresa scorrono log di sistema, e su un
      // video di un'azienda di sicurezza la parola "ERROR" a schermo non ci va.
      // Resta la texture di codice, non si legge più cosa dice.
      clip: 'codice', clipDa: 1, zoom: [1.06, 1.18], velatura: 1.45,
      tagline: 'Fiducia. Trasparenza. Tranquillità.',
      testo: 'Analizziamo i rischi e costruiamo un piano d’azione su misura, orientato alla prevenzione più che alla reazione.',
      voce: 'Con tecno shield la sicurezza è su misura.',
    },

    /* 5 --- 20 → 24 ----------------------------------------------------- */
    {
      tipo: 'checkupBreve',
      secondi: 4,
      clip: 'riunione', clipDa: 3, zoom: [1.16, 1.04],
      occhiello: 'Da dove si comincia',
      titolo: 'Check-up di sicurezza informatica',
      passi: [
        'Rete e accessi',
        'Aggiornamenti e patch',
        'Backup e recovery',
        'Formazione del personale',
      ],
      piede: 'Senza impegno · preventivo prima di iniziare',
      voce: 'Si parte da un check-up di sicurezza.',
    },

    /* 6 --- 24 → 30 ----------------------------------------------------- */
    {
      tipo: 'chiusuraBreve',
      secondi: 6,
      clip: 'openspace', clipDa: 2, zoom: [1.2, 1.05],
      titolo: 'Parliamo del tuo progetto.',
      contatti: [
        { icona: 'bi-telephone', testo: '055 617008' },
        { icona: 'bi-globe', testo: 'www.tecnolink.it' },
      ],
      voce: 'Parliamo del tuo progetto. Tecnolink.',
    },
  ],
};
