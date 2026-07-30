/**
 * Testi e scaletta del video di presentazione.
 *
 * Tutto il contenuto parlato dal video sta qui: per riscrivere una frase o
 * cambiare la durata di una scena si tocca solo questo file e si rigenera.
 * `secondi` è la durata della singola scena, non l'istante di inizio: se ne
 * allunghi una, le successive slittano da sole.
 *
 * I testi vengono dal sito (Pages/Index.cshtml, Pages/Offerte/, Pages/Soluzioni/)
 * e seguono i vincoli decisi per i materiali delle campagne: nessun dato o
 * testimonianza non verificabile, nessuna promessa di gratuità ("senza impegno",
 * "preventivo prima di iniziare"), nessuna affermazione sulla situazione
 * personale di chi guarda.
 */

window.TK_CONTENUTI = {

  azienda: {
    nome: 'Tecnolink',
    sito: 'www.tecnolink.it',
    telefono: '055 617008',
    email: 'info@tecnolink.it',
    sede: 'Via Aretina 167/M, 50136 Firenze',
  },

  scene: [

    /* 1 ------------------------------------------------------------------ */
    {
      tipo: 'apertura',
      secondi: 5,
      sottotitolo: 'Sistemi informatici e cybersecurity',
      luogo: 'Firenze',
    },

    /* 2 ------------------------------------------------------------------ */
    {
      tipo: 'problema',
      secondi: 8,
      occhiello: 'Il punto di partenza',
      titolo: ['Oggi il lavoro passa tutto', 'dai sistemi informatici.'],
      testo: 'Email, gestionale, backup, dispositivi dei collaboratori: quando qualcosa si ferma, si ferma l’azienda.',
      nodi: [
        { icona: 'bi-envelope', etichetta: 'Email' },
        { icona: 'bi-hdd-network', etichetta: 'Server' },
        { icona: 'bi-laptop', etichetta: 'Postazioni' },
        { icona: 'bi-cloud-arrow-up', etichetta: 'Backup' },
        { icona: 'bi-phone', etichetta: 'Mobile' },
        { icona: 'bi-router', etichetta: 'Rete' },
      ],
    },

    /* 3 ------------------------------------------------------------------ */
    {
      tipo: 'chiSiamo',
      secondi: 8,
      occhiello: 'Chi siamo',
      // Righe già spezzate a mano: i segmenti con `g: true` prendono il gradiente
      // cyan → viola del marchio.
      titoloRighe: [
        [{ t: 'Tecnolink.' }],
        [{ t: 'Da ' }, { t: 'vent’anni', g: true }, { t: ' a Firenze.' }],
      ],
      testo: 'Affianchiamo aziende e professionisti di Firenze e delle zone limitrofe nella gestione dei sistemi informatici: sicurezza, efficienza e attenzione al dettaglio.',
      dati: [
        { valore: '20+', etichetta: 'Anni di esperienza' },
        { valore: '24/7', etichetta: 'Monitoraggio continuo' },
        { valore: '100%', etichetta: 'Soluzioni su misura' },
      ],
    },

    /* 4 ------------------------------------------------------------------ */
    {
      tipo: 'servizi',
      secondi: 14,
      occhiello: 'Cosa facciamo',
      titolo: 'Quattro aree, un solo interlocutore.',
      carte: [
        {
          icona: 'bi-diagram-3',
          titolo: 'Sistemi Informatici',
          testo: 'Consulenza, progettazione e fornitura su misura, dal singolo apparato all’infrastruttura.',
        },
        {
          icona: 'bi-headset',
          titolo: 'Helpdesk e Assistenza',
          testo: 'Un riferimento sempre raggiungibile per ogni imprevisto tecnico, in sede e da remoto.',
        },
        {
          icona: 'bi-shield-lock',
          titolo: 'Cybersicurezza',
          testo: 'Protezione proattiva, non reattiva, con strumentazione sempre aggiornata.',
        },
        {
          icona: 'bi-mortarboard',
          titolo: 'Consulenza e Formazione',
          testo: 'Scelte tecnologiche guidate e team formato a un uso sicuro degli strumenti digitali.',
        },
      ],
    },

    /* 5 ------------------------------------------------------------------ */
    {
      tipo: 'continuativi',
      secondi: 8,
      occhiello: 'Ogni giorno, senza pensarci',
      titolo: 'Il controllo che non si vede.',
      riquadri: [
        {
          icona: 'bi-cloud-arrow-up',
          titolo: 'Backup Monitor',
          testo: 'Verifichiamo che le copie siano integre e aggiornate, per prevenire ogni perdita di dati.',
        },
        {
          icona: 'bi-search',
          titolo: 'Check Sicurezza',
          testo: 'Controllo e manutenzione della sicurezza, svolti da operatori esperti giorno dopo giorno.',
        },
        {
          icona: 'bi-cpu',
          titolo: 'Verifica Hardware',
          testo: 'Diagnostica periodica dell’hardware, per anticipare il guasto invece di subirlo.',
        },
      ],
      piede: '24/7 · Monitoraggio continuo',
    },

    /* 6 ------------------------------------------------------------------ */
    {
      tipo: 'shield',
      secondi: 11.5,
      tagline: 'Fiducia. Trasparenza. Tranquillità.',
      testo: 'Il servizio di cybersecurity esclusivo Tecnolink: analizziamo i rischi, valutiamo la tua situazione e costruiamo un piano d’azione su misura, orientato alla prevenzione più che alla reazione.',
      vantaggi: [
        'Personalizzazione del servizio',
        'Attenzione ad ogni cliente',
        'Anticipazione dei problemi',
        'Gestione trasparente',
      ],
    },

    /* 7 ------------------------------------------------------------------ */
    {
      tipo: 'checkup',
      secondi: 9.5,
      occhiello: 'Da dove si comincia',
      titolo: 'Check-up di sicurezza informatica',
      testo: 'Controlliamo i dispositivi collegati alla rete per individuare i punti deboli prima che vengano sfruttati.',
      passi: [
        'Verifica configurazione di rete e accessi',
        'Controllo aggiornamenti e patch di sicurezza',
        'Analisi policy di backup e recovery',
        'Valutazione formazione del personale',
      ],
      piede: 'Senza impegno · preventivo prima di iniziare',
    },

    /* 8 ------------------------------------------------------------------ */
    {
      tipo: 'settori',
      secondi: 8,
      occhiello: 'Con chi lavoriamo',
      titolo: 'Chi gestisce dati sensibili, ogni giorno.',
      settori: [
        { icona: 'bi-briefcase', nome: 'Studi legali' },
        { icona: 'bi-calculator', nome: 'Commercialisti' },
        { icona: 'bi-heart-pulse', nome: 'Studi medici' },
        { icona: 'bi-file-earmark-text', nome: 'Studi notarili' },
        { icona: 'bi-capsule', nome: 'Farmacie' },
        { icona: 'bi-building', nome: 'Hotel' },
        { icona: 'bi-cup-hot', nome: 'Ristorazione' },
        { icona: 'bi-cart', nome: 'E-commerce' },
        { icona: 'bi-house-door', nome: 'Agenzie immobiliari' },
        { icona: 'bi-umbrella', nome: 'Assicurazioni' },
        { icona: 'bi-car-front', nome: 'Concessionarie' },
        { icona: 'bi-rulers', nome: 'Studi di architettura' },
      ],
    },

    /* 9 ------------------------------------------------------------------ */
    {
      tipo: 'perche',
      secondi: 7.5,
      occhiello: 'Perché Tecnolink',
      citazione: '“Non chiediamo ai nostri clienti di scegliere tra privacy o sicurezza. Noi offriamo loro il meglio di entrambi.”',
      valori: [
        {
          icona: 'bi-award',
          titolo: 'Affidabilità',
          testo: 'Sistemi monitorati costantemente e competenza tecnica su cui contare.',
        },
        {
          icona: 'bi-lightning-charge',
          titolo: 'Innovazione',
          testo: 'Personale specializzato e sempre aggiornato sulle nuove minacce.',
        },
      ],
    },

    /* 10 ----------------------------------------------------------------- */
    {
      tipo: 'chiusura',
      secondi: 9.5,
      titolo: 'Parliamo del tuo progetto.',
      testo: 'Prima consulenza senza impegno: capiamo le tue esigenze e ti proponiamo la soluzione più adatta.',
      contatti: [
        { icona: 'bi-telephone', testo: '055 617008' },
        { icona: 'bi-envelope', testo: 'info@tecnolink.it' },
        { icona: 'bi-globe', testo: 'www.tecnolink.it' },
        { icona: 'bi-geo-alt', testo: 'Via Aretina 167/M, Firenze' },
      ],
    },
  ],
};
