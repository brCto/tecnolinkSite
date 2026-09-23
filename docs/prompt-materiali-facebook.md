# Prompt per generare materiale Facebook/Instagram Ads — pubblico **privati**

Libreria di prompt pronti da incollare in un modello generativo (testo, immagini, video)
per produrre creativi e copy del **Check-up della rete di casa**, la versione consumer del
Vulnerability Assessment.

Tutto quello che c'è qui dentro è ricavato dalla landing
`Pages/Offerte/VulnerabilityAssessmentPrivati.cshtml` e dalle regole già stabilite in
[`campagne-ads.md`](campagne-ads.md), [`creativi/README.md`](creativi/README.md) e
[`creativi/revisione-2026.md`](creativi/revisione-2026.md). I prompt **non sostituiscono**
quei documenti: servono a produrre il materiale che oggi manca, senza rifare da capo
quello che c'è.

> **Regola d'oro.** Nessun prompt di questa raccolta chiede al modello di inventare numeri,
> percentuali, testimonianze o schermate di report. Dove servirebbe un dato vero, il prompt
> deve restituire `[DA COMPILARE]`. È la stessa linea di `campagne-ads.md`, ed è anche la
> ragione per cui le varianti esistenti non contengono statistiche.

---

## Cosa conviene generare per primo

Ordine di resa attesa sui lead, per il pubblico privati su Meta, coerente con l'analisi in
`revisione-2026.md`:

| # | Materiale | Perché | Prompt |
|---|---|---|---|
| 1 | **Statici fotografici** per traffico freddo | I creativi che avete sono grafici; sul feed Facebook consumer lo scatto realistico batte spesso la grafica, e non è ancora stato provato | [§2](#2--creativi-fotografici-traffico-freddo) |
| 2 | **Nuove varianti di copy** da mettere contro le A–E esistenti | Il copy è la variabile che state già misurando a visual fisso: alimentarlo costa zero | [§1](#1--copy-degli-annunci) |
| 3 | **Carosello** | Sulla lead generation il carosello ha il costo per conversione più basso dei formati statici | [§3](#3--carosello-4-6-carte) |
| 4 | **Modulo istantaneo** (domande + follow-up) | Su un servizio locale a ticket contenuto porta più lead a costo più basso | [§5](#5--modulo-istantaneo-meta) |
| 5 | **Reel 15-20 s** | Costa di più e porta clic più cari: si fa dopo, per rinnovare una campagna che ha già trovato il messaggio | [§4](#4--reel-15-20-secondi) |

---

## BLOCCO BASE — da incollare in cima a **ogni** prompt

Questo è il contesto condiviso. Senza, il modello inventa un'azienda generica di
cybersecurity e scrive in "aziendalese".

```
CONTESTO — leggi tutto prima di rispondere.

AZIENDA
Tecnolink, Firenze. Informatica e sicurezza per aziende e privati della zona.
Telefono: 055 617008. Persone reali con cui parlare, non un call center.

SERVIZIO (nome pubblico, da usare sempre così)
"Check-up della rete di casa".
Il termine tecnico "Vulnerability Assessment" NON deve MAI comparire nei materiali
rivolti ai privati: non lo cercano e non lo capiscono.

PROMESSA CENTRALE — è quello che ci distingue, deve emergere sempre
Controlliamo la rete di casa e tutti i dispositivi collegati come li vedrebbe un
malintenzionato, ma per proteggere. Poi NON lasciamo un elenco di problemi da risolvere
da soli: vengono i nostri tecnici e sistemano. Troviamo E sistemiamo.

COSA GUARDIAMO
Router e Wi-Fi · telecamere e campanelli smart · smart TV e box TV · computer e tablet ·
smartphone · smart home e assistenti vocali (prese intelligenti, termostati, speaker).
In una casa normale i dispositivi collegati sono più di dieci.

COME FUNZIONA, IN 4 PASSI
1. Guardiamo cosa è collegato al Wi-Fi (spesso salta fuori qualcosa di dimenticato)
2. Troviamo le porte lasciate aperte (password deboli, impostazioni di fabbrica, software vecchio)
3. Spieghiamo cosa sistemare, in ordine di importanza e con parole di tutti i giorni
4. Sistemiamo noi quello che non va (o diamo le indicazioni a chi preferisce fare da sé)

GARANZIE CHE POSSIAMO DIRE
Preventivo prima di iniziare, sia per il controllo sia per la riparazione ·
Ricontatto entro 24 ore · Nessun abbonamento nascosto · I tuoi dati restano tuoi
(non copiamo né vendiamo nulla, non curiosiamo nei contenuti) · Zona Firenze e dintorni ·
Non serve essere pratici di computer.

I 4 RISCHI raccontati sulla landing
Qualcuno usa il tuo Wi-Fi · password e dati rubati (home banking, email, social, foto) ·
telecamere e baby monitor visti da estranei · truffe e ricatti a nome tuo verso amici e familiari.

I 4 LUOGHI COMUNI da smontare
"Ho l'antivirus, sono a posto" · "Non ho niente da nascondere" ·
"Il router me l'ha dato l'operatore, sarà sicuro" · "Se succedesse qualcosa me ne accorgerei".

PUBBLICO
Privati, Firenze + 25 km, 30-65+, tutti i generi. Non sono tecnici. Hanno una casa piena
di dispositivi che nessuno ha mai controllato. Molti hanno figli o genitori anziani in casa.

TONO DI VOCE
Italiano parlato, "tu", frasi brevi. Parole di tutti i giorni: "porte lasciate aperte",
non "superficie di attacco". Zero sigle, zero inglesismi (mai: hacker, cyber, breach,
security, smart working). Calmo e concreto, mai allarmistico: chi legge deve sentirsi
preso sul serio, non spaventato. Metafora di casa: porte, finestre, chiavi, serrature.

DIVIETI ASSOLUTI
1. Nessuna affermazione sulla situazione di chi legge. Meta rifiuta gli annunci che
   lasciano intendere di sapere qualcosa di personale. Si usano DOMANDE e IPOTESI:
   "Sai quanti dispositivi sono collegati al tuo Wi-Fi?" SÌ.
   "La tua telecamera è stata violata" / "Sei stato hackerato" NO.
2. Nessun numero, percentuale, statistica, premio, certificazione o testimonianza:
   non ne abbiamo di verificati. Dove servirebbe, scrivi [DA COMPILARE].
3. Nessun prezzo finché non è stato deciso: scrivi [DA COMPILARE].
4. Niente urgenza finta ("solo oggi", "ultimi posti"), niente conto alla rovescia.
5. Niente immagini di finti report con dati inventati, né finti screenshot di app.
```

---

## 1 — Copy degli annunci

Le varianti A–E esistono già in `campagne-ads.md` (Wi-Fi, telecamere, password e conti,
router dell'operatore, esito). Questo prompt serve a produrne di **nuove e diverse**, non a
riscrivere quelle.

```
[INCOLLA QUI IL BLOCCO BASE]

COMPITO
Scrivi 5 nuove varianti di annuncio Facebook/Instagram per il pubblico privati.

ANGOLI GIÀ USATI — non ripeterli, servono angoli nuovi:
A) quanti dispositivi sono collegati al Wi-Fi
B) telecamere e campanelli smart mai aggiornati
C) home banking e password
D) il router dell'operatore
E) l'esito: cosa sistemare e in che ordine

Angoli nuovi da esplorare (scegline 5, uno per variante):
- il Wi-Fi degli ospiti e di chi entra in casa (colf, ripetizioni, vicini)
- i genitori anziani a cui hai installato tu qualcosa e non l'ha più toccato nessuno
- i dispositivi dimenticati: la vecchia stampante, il tablet dei bambini, la smart TV in cucina
- chi lavora da casa e usa la stessa rete dell'ufficio
- il trasloco / la fibra nuova / il router cambiato da poco
- "l'ho fatto installare da un ragazzo bravo" — e poi non si è più visto nessuno
- cosa succede DOPO che ci chiami (nessuno racconta mai la parte semplice)

STRUTTURA di ogni variante
- Testo principale: 4 blocchi separati da riga vuota. Le prime 125 battute devono
  reggere da sole, perché il resto sta sotto "Altro": apri con una domanda o un fatto
  concreto, mai con "Sapevi che…" o "Nel mondo di oggi…".
  Ultimo blocco: 3 righe corte con emoji di servizio, come nelle varianti esistenti
  (🏠 preventivo prima di iniziare · 📍 Firenze e dintorni · 🔒 i tuoi dati restano tuoi).
- Titolo: massimo 40 caratteri, spazi inclusi. Contali e scrivi il numero tra parentesi.
- Descrizione: massimo 30 caratteri circa, deve contenere "Check-up della rete di casa".
- CTA: scegli tra "Scopri di più", "Invia messaggio", "Contattaci".
- utm_content: una parola sola, minuscola, che identifica l'angolo.

FORMATO DELLA RISPOSTA
Markdown, una sezione per variante, esattamente come in docs/campagne-ads.md §2.
Alla fine aggiungi una riga per variante che dice contro quale delle A–E esistenti va
messa a confronto e perché.

CONTROLLO PRIMA DI CONSEGNARE
Rileggi ogni variante e verifica: (a) nessuna frase afferma qualcosa sulla situazione di
chi legge; (b) nessun numero non verificato; (c) il titolo è davvero sotto i 40 caratteri;
(d) niente inglesismi. Se una variante non passa, riscrivila prima di mostrarla.
```

### 1-bis — Variante corta per il rimarketing

```
[INCOLLA QUI IL BLOCCO BASE]

COMPITO
Scrivi 6 testi brevissimi (massimo 2 righe, sotto le 125 battute) per il retargeting su
chi ha già visitato la pagina del check-up di casa senza compilare il modulo.
Chi legge conosce già il servizio: non rispiegarlo, togli l'ultimo dubbio.
Un testo per ciascuno di questi dubbi:
1. "quanto mi costa?" (senza dare cifre: si risponde con il preventivo prima di iniziare)
2. "devo far entrare qualcuno in casa?"
3. "ci capisco poco di computer"
4. "ci penso" / rimando
5. "ho poche cose collegate, non ne vale la pena"
6. "come faccio a fidarmi?"
Per ognuno: testo principale + titolo (max 40 caratteri, conta i caratteri).
```

---

## 2 — Creativi fotografici (traffico freddo)

Perché servono: i creativi attuali sono **grafici** e molto scritti — vanno bene in
retargeting, lavorano contro di sé nel feed freddo. Lo scatto realistico è il test che
manca. Le immagini vanno generate **senza testo dentro**: i modelli scrivono in italiano
male, e il testo lo sovrapponete voi con la pipeline dei manifesti
(`docs/creativi/manifesti/genera-manifesti.mjs`), che già gestisce font, safe area e misure.

### 2.1 Prompt per il modello di immagini — scheletro riutilizzabile

I prompt per le immagini vanno in inglese: i modelli rendono molto meglio.

```
Photorealistic editorial photograph, [SCENA].
Italian home interior, ordinary and lived-in, not a showroom. Natural light,
[LUCE]. Shot on 35mm, shallow depth of field, muted realistic colours,
slight film grain. Composition: subject in the lower two thirds, [SPAZIO NEGATIVO]
left deliberately empty and uncluttered for text overlay.
No text, no letters, no numbers, no logos, no watermarks, no user interface elements,
no screens showing readable content.
--ar 4:5 --style raw
```

Negative prompt da tenere sempre (per i modelli che lo prevedono):

```
text, letters, words, numbers, watermark, logo, ui, hud, dashboard, code, matrix,
green code rain, hooded figure, hacker, balaclava, dark room with many monitors,
padlock icon, shield icon, fingerprint, glowing blue lines, futuristic, sci-fi,
3d render, cgi, illustration, cartoon, stock photo smile, plastic skin, extra fingers
```

> **Perché quei divieti.** Il repertorio "hacker col cappuccio + codice verde" è il
> linguaggio visivo che il pubblico ha imparato a ignorare, e per di più racconta una
> minaccia astratta invece della casa di chi guarda. Qui la forza è il riconoscimento:
> *quella è casa mia*.

### 2.2 Le sei scene, pronte

Ogni scena regge una variante di copy: l'immagine è il gancio, il testo la porta a
conclusione. La colonna «frase» è quella da sovrapporre dopo, non da far scrivere al
modello.

| # | Scena | Frase da sovrapporre (5-10 parole) | Copy abbinato |
|---|---|---|---|
| 1 | Il router dimenticato | *Il router non si aggiorna da solo.* | D — router dell'operatore |
| 2 | Il campanello smart | *Le telecamere si installano una volta e si dimenticano.* | B — telecamere |
| 3 | Il salotto la sera | *Quante cose sono collegate al tuo Wi-Fi adesso?* | A — Wi-Fi |
| 4 | Il tecnico in casa | *Non ti lasciamo l'elenco in mano.* | E — esito |
| 5 | La cameretta | *Anche il baby monitor è un dispositivo collegato.* | nuovo angolo |
| 6 | La porta di casa | *Le porte di casa le controlli. Quelle digitali no.* | nuovo angolo |

**Scena 1 — il router dimenticato**
```
Photorealistic editorial photograph, a domestic Wi-Fi router half hidden behind a piece
of furniture in an Italian living room, dusty, cables tangled, small status lights glowing,
clearly untouched for years. Italian home interior, ordinary and lived-in, not a showroom.
Natural light, late afternoon light from a window on the left, warm and soft. Shot on 35mm,
shallow depth of field, muted realistic colours, slight film grain. Composition: router in
the lower right third, the upper half of the frame left deliberately empty and uncluttered
for text overlay. No text, no letters, no numbers, no logos, no watermarks, no user
interface elements, no screens showing readable content. --ar 4:5 --style raw
```

**Scena 2 — il campanello smart**
```
Photorealistic editorial photograph, close-up of a small smart video doorbell mounted next
to the entrance door of an Italian apartment building, plaster wall, brass nameplate out of
focus, evening light. Ordinary and lived-in, not a showroom. Shot on 35mm, shallow depth of
field, muted realistic colours, slight film grain. Composition: doorbell in the lower left
third, large empty wall surface in the upper right for text overlay. No text, no letters,
no numbers, no logos, no watermarks, no user interface elements. --ar 4:5 --style raw
```

**Scena 3 — il salotto la sera**
```
Photorealistic editorial photograph, an Italian living room at night seen from the doorway,
television on standby, several small device lights glowing in the dark — router, speaker,
set-top box, phone charging — nobody in the room. Ordinary and lived-in, not a showroom.
Only ambient light from the standby lights and a street lamp through the window. Shot on
35mm, shallow depth of field, muted realistic colours, slight film grain. Composition: room
in the lower two thirds, dark empty ceiling area at the top for text overlay. No text, no
letters, no numbers, no logos, no watermarks, no readable screen content. --ar 4:5 --style raw
```

**Scena 4 — il tecnico in casa**
```
Photorealistic editorial photograph, a calm technician in his forties, plain dark polo
shirt, sitting at a kitchen table next to a couple in their fifties, laptop closed on the
table, explaining something with his hands, all three relaxed, natural expressions, no
forced smiles. Italian home, ordinary and lived-in. Natural window light, warm. Shot on
35mm, shallow depth of field, muted realistic colours, slight film grain. Composition:
people in the lower two thirds, empty wall above for text overlay. No text, no letters, no
numbers, no logos, no watermarks, no readable screen content. --ar 4:5 --style raw
```
> Attenzione: questa scena mostra persone generate. Non va mai presentata come "i nostri
> tecnici" o "i nostri clienti" — è un'immagine di scena. Se volete mostrare i vostri
> tecnici veri serve uno scatto vero, ed è comunque il creativo più forte dei due.

**Scena 5 — la cameretta**
```
Photorealistic editorial photograph, a baby monitor camera on a shelf in a child's bedroom,
soft toys slightly out of focus, curtains drawn, early morning light. Italian home, ordinary
and lived-in. Shot on 35mm, shallow depth of field, muted realistic colours, slight film
grain. Composition: monitor in the lower left third, empty wall in the upper right for text
overlay. Calm and tender atmosphere, not threatening. No text, no letters, no numbers, no
logos, no watermarks, no readable screen content. --ar 4:5 --style raw
```

**Scena 6 — la porta di casa**
```
Photorealistic editorial photograph, close-up of the front door of an Italian apartment
from the inside, keys left in the lock, door slightly ajar, hallway light. Ordinary and
lived-in, not a showroom. Natural light. Shot on 35mm, shallow depth of field, muted
realistic colours, slight film grain. Composition: door and lock in the lower right, large
flat empty door surface in the upper left for text overlay. No text, no letters, no numbers,
no logos, no watermarks. --ar 4:5 --style raw
```

### 2.3 Misure e finitura

Rigenerate ogni scena in tre misure cambiando solo il parametro e la nota di composizione:

| Misura | Parametro | Nota da aggiungere alla composizione |
|---|---|---|
| 1080×1350 — feed verticale (**la principale**) | `--ar 4:5` | spazio libero in alto |
| 1080×1920 — storie e reel | `--ar 9:16` | `keep the top 15% and the bottom 20% of the frame empty` |
| 1080×1080 — riserva | `--ar 1:1` | spazio libero su un lato |

Poi il testo si sovrappone con la pipeline esistente: una frase sola, corpo grande, barra
gradiente `#22d3ee → #6366f1` e logo in basso, come i manifesti. Il testo deve restare
**sotto un terzo della superficie** — oltre quella soglia Meta distribuisce peggio e
l'annuncio costa di più.

---

## 3 — Carosello 4-6 carte

Il carosello ha il costo per conversione più basso sulla lead generation. Ne avete già uno
(minaccia → posta in gioco → soluzione → CTA) e uno sui luoghi comuni: questo prompt serve a
produrre **una sequenza nuova** già nel formato che la vostra pipeline mangia.

```
[INCOLLA QUI IL BLOCCO BASE]

COMPITO
Scrivi i testi di un carosello Facebook da 5 carte per il pubblico privati, sul tema
"la stanza per stanza": ogni carta è un punto della casa e il dispositivo che ci vive.

Carte: 1) copertina · 2) ingresso: campanello e telecamera · 3) salotto: smart TV e box ·
4) studio/cucina: computer, stampante, prese intelligenti · 5) chiusura con invito.

REGOLE DI SCRITTURA PER CARTA
- Titolo: massimo 6 parole, una frase che si legge in miniatura
- Corpo: massimo 22 parole, una cosa sola per carta
- La carta 5 dice cosa succede se ci scrivi, non "contattaci subito"
- Nessun numero, nessuna affermazione sul lettore

FORMATO DELLA RISPOSTA
Un oggetto JavaScript pronto da incollare in CONTENUTI di
docs/creativi/caroselli/genera-caroselli.mjs, con questa forma:
{ chiave: 'stanze', pubblico: 'privati', carte: [ { titolo: '...', corpo: '...' }, ... ] }
Sotto l'oggetto, in italiano: due righe che spiegano contro quale carosello esistente va
messo a confronto e con quale utm_content.
```

---

## 4 — Reel 15-20 secondi

Da fare **dopo** gli statici. Due prompt: uno per lo script, uno per le inquadrature se il
video lo genera un modello.

### 4.1 Script

```
[INCOLLA QUI IL BLOCCO BASE]

COMPITO
Scrivi 3 script per Reel verticali da 15-20 secondi, pubblico privati, girabili in una
casa vera con un telefono e senza attori professionisti.

VINCOLI
- I primi 2 secondi devono reggere da soli, con l'audio spento: la frase di apertura va
  anche come testo sullo schermo
- Voce fuori campo in italiano parlato, massimo 45 parole in tutto lo script
- 4-6 inquadrature, ognuna descritta in una riga (cosa si vede, quanto dura)
- Chiusura: "Check-up della rete di casa · Tecnolink, Firenze" + CTA parlata
- Niente musica drammatica, niente conto alla rovescia, niente allarmismo
- Sottotitoli obbligatori: scrivili, tempo per tempo

I 3 script devono avere aperture diverse:
1. la mano che stacca e riattacca il router — l'oggetto più ignorato della casa
2. il giro della casa contando ad alta voce le cose collegate
3. il tecnico che spiega al tavolo della cucina cosa ha trovato (senza mostrare dati)

FORMATO
Tabella per script: tempo · inquadratura · voce fuori campo · testo a schermo.
```

### 4.2 Inquadrature per un modello video

```
Vertical 9:16 video, 5 seconds, photorealistic, handheld, natural light, Italian home
interior, ordinary and lived-in. [INQUADRATURA DALLO SCRIPT].
Muted realistic colours, slight grain, no camera movement other than a slow handheld drift.
No text, no letters, no numbers, no logos, no watermarks, no readable screen content,
no hooded figures, no code, no futuristic effects.
```

---

## 5 — Modulo istantaneo Meta

Sul pubblico privati il modulo nativo porta più lead a costo più basso, mediamente meno
qualificati: su un check-up di casa è un compromesso che regge. Ricordate che quei lead
**non passano dal form del sito**, quindi non arrivano via mail e non portano gli UTM.

```
[INCOLLA QUI IL BLOCCO BASE]

COMPITO
Prepara il contenuto di un modulo istantaneo Meta per il check-up della rete di casa.

Serve:
1. Titolo del modulo (max 60 caratteri) e testo introduttivo (max 3 righe): deve dire
   cosa succede dopo l'invio, non rivendere il servizio
2. I campi: nome, telefono, città — e nient'altro. Scrivi l'etichetta di ciascuno
3. UNA domanda personalizzata a scelta multipla, utile a qualificare senza pesare.
   Proponi 3 alternative fra cui scegliere, con le loro opzioni di risposta
4. Testo della schermata di ringraziamento (max 2 righe) + testo del pulsante finale
5. Uno script telefonico di 6 righe per richiamare entro 24 ore: prima frase, come si
   spiega il check-up in 20 secondi, la domanda che porta all'appuntamento, e come si
   chiude se la persona dice "ci penso"

REGOLE
Chi compila un modulo istantaneo non sta aspettando la vostra chiamata come chi ha
compilato la landing: lo script deve ricordarglielo con garbo nella prima riga.
Nessuna promessa che la landing non fa. Nessun prezzo: [DA COMPILARE].
```

---

## 6 — Prompt di controllo (da usare sempre, alla fine)

Prima di caricare qualunque cosa in Ads Manager, fate rileggere il materiale a un modello
con questo prompt. Trova quasi sempre almeno una frase da correggere.

```
Sei un revisore di annunci Facebook per un'azienda italiana di informatica.
Ti do sotto il materiale di un annuncio (testo e descrizione dell'immagine).

Controlla, una per una, e segnala ogni violazione citando la frase esatta:
1. Ci sono affermazioni su ciò che sta succedendo a chi legge, invece di domande o
   ipotesi? (Meta rifiuta gli annunci che lasciano intendere di sapere qualcosa della
   situazione personale del destinatario)
2. Ci sono numeri, percentuali, statistiche, premi, certificazioni o testimonianze?
3. Ci sono promesse che la pagina di destinazione non fa? La pagina promette: controllo
   di tutti i dispositivi collegati, spiegazione in parole semplici, riparazione fatta dai
   tecnici, preventivo prima di iniziare, ricontatto entro 24 ore, dati che restano privati.
4. Ci sono sigle, inglesismi o termini tecnici? (vietati, compreso "vulnerability assessment")
5. Il titolo supera i 40 caratteri? Il gancio sta nelle prime 125 battute del testo?
6. Il testo sull'immagine supera un terzo della superficie o le 10 parole?
7. C'è urgenza artificiale, senso di colpa o paura gratuita?

Rispondi con: elenco dei problemi (frase citata + perché + riscrittura proposta), e in
fondo un verdetto: PUBBLICABILE oppure DA CORREGGERE.
Se non trovi problemi, dillo senza inventarne.
```

---

## URL di destinazione

Ogni variante nuova deve avere il suo `utm_content`, altrimenti nei risultati non si
distingue nulla:

```
https://www.tecnolink.it/offerte/vulnerability-assessment/privati?utm_source=facebook&utm_medium=paid_social&utm_campaign=va-casa-2026&utm_content=<angolo>
```

---

## Quello che nessun prompt può darvi

Sono le tre cose che alzerebbero la resa più di qualsiasi creativo nuovo, e vanno decise
da voi — sono già segnalate in `campagne-ads.md §4`:

- **Un prezzo di riferimento** per il controllo casa. Sul traffico Facebook l'assenza di
  qualsiasi indicazione economica è il primo motivo di abbandono.
- **Una testimonianza vera**, anche solo nome di battesimo + quartiere + una frase.
- **Un numero vostro**, dopo i primi dieci check-up: dispositivi trovati in media, cosa si
  sistema in un pomeriggio. Con i manifesti costa una riga di codice ed è il creativo
  statico più forte in assoluto. Non prima di avere il dato.
