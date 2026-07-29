# Campagne Check-up di sicurezza — LinkedIn (aziende) e Facebook (privati)

Materiale pronto per Campaign Manager e Meta Ads Manager.
Tutto il testo è in italiano, già dimensionato per i limiti dei due formati.

> **Nota sui numeri.** In questi annunci non compare nessuna statistica, percentuale o
> testimonianza: non ne avevamo di verificate. Dove inserire dati reali è segnalato con
> `[DA COMPILARE]`. Non inventarli: su LinkedIn le affermazioni non sostenibili sono anche
> il motivo più comune di segnalazione da parte dei concorrenti.

---

## 0. Da fare prima di spendere il primo euro

Senza questi quattro punti le campagne partono cieche.

| Cosa | Dove | Stato |
|---|---|---|
| Insight Tag LinkedIn | `appsettings.json` → `Analytics:LinkedInPartnerId` | predisposto, **ID da inserire** |
| Conversione "Lead" LinkedIn | `Analytics:LinkedInLeadConversionId` | predisposto, **ID da inserire** |
| Pixel Meta | `Analytics:MetaPixelId` | predisposto, **ID da inserire** |
| GA4 | `Analytics:GA4MeasurementId` | predisposto, **ID da inserire** |

Come si comportano: i tag si caricano **solo dopo il consenso** sul banner cookie, e
all'invio del form scatta la conversione su tutte e tre le piattaforme
(`generate_lead` su GA4, `Lead` su Meta, `conversion_id` su LinkedIn).

Rimuovere prima del lancio le tre voci di menu temporanee `VA · Aziende`, `VA · Privati`
e `Materiali` in `Pages/Shared/_Layout.cshtml` (cerca il commento `TEMP`). La pagina
`/interno/materiali-campagne` resta comunque raggiungibile per chi conosce l'indirizzo:
è `noindex, nofollow`, non protetta da password.

### URL di destinazione

Gli UTM vengono catturati al primo ingresso, tenuti per tutta la sessione e allegati alla
mail del lead — così ogni richiesta arriva già attribuita all'annuncio che l'ha generata.
Vengono raccolti anche `fbclid` e `li_fat_id` quando gli UTM mancano.

**LinkedIn** (un `utm_content` diverso per ogni variante, così si capisce quale funziona):

```
https://www.tecnolink.it/offerte/vulnerability-assessment/aziende?utm_source=linkedin&utm_medium=paid_social&utm_campaign=va-pmi-2026&utm_content=nis2
```

**Facebook / Instagram:**

```
https://www.tecnolink.it/offerte/vulnerability-assessment/privati?utm_source=facebook&utm_medium=paid_social&utm_campaign=va-casa-2026&utm_content=wifi
```

### Immagini

Tutti i creativi si guardano insieme dalla pagina interna **`/interno/materiali-campagne`**
(non indicizzata, raggiungibile dal menu del sito): è il posto da cui ritrovarli senza
cercare nel repository. I file stanno in `tecnolinkSite/wwwroot/img/campagne/singola/`,
nominati `<pubblico>-<palette>-<misura>.png`:

- **pubblico**: `aziende` (dice "Check-up di sicurezza informatica") e `privati` ("Check-up della rete di casa") — usa quella giusta per la campagna, il nome sull'immagine deve combaciare con quello della landing
- **palette**: `chiaro` (fondo bianco) e `vivido` (gradiente del marchio) — due direzioni diverse, da far girare entrambe e tenere quella che porta i lead a meno
- **misura**: `feed-verticale` 1080×1350 (**la principale**, occupa più schermo nel feed da telefono), `storia` 1080×1920 per storie e reel, `quadrato` 1080×1080 di riserva

È **una presentazione generale del servizio**, uguale per tutte le varianti di testo qui
sotto: si tiene fisso il visual e si mette alla prova il copy, altrimenti non si capisce
cosa ha fatto la differenza. Per cambiare i testi dell'immagine vedi
[`creativi/README.md`](creativi/README.md).

**Caroselli in bianco e nero.** A parte, in [`creativi/caroselli/`](creativi/caroselli/),
ci sono due sequenze da quattro carte 1080×1080, una per pubblico: minaccia → cosa c'è in
gioco → come si risolve → CTA. Formato, palette e ordine delle carte sono motivati nel
README di quella cartella. Hanno copy e UTM propri (`utm_content=carosello-bn`) e vanno
misurati contro le varianti a immagine singola qui sotto.

---

## 1. LinkedIn — aziende

**Obiettivo campagna:** Lead generation (o Website conversions una volta che la
conversione "Lead" ha accumulato dati). **Formato:** Sponsored Content, immagine singola.

### Targeting

- **Località:** Firenze e province limitrofe (Prato, Pistoia, Arezzo, Siena) — per località *di residenza o azienda*, non "di recente visita"
- **Dimensione azienda:** 11-50, 51-200, 201-500 dipendenti
- **Qualifiche:** Titolare, Amministratore Delegato, Direttore Generale, Direttore Operativo, Responsabile IT, Responsabile Amministrativo, CFO
- **Settori:** manifatturiero, servizi professionali (studi legali, commercialisti), logistica e trasporti, sanità privata, commercio all'ingrosso
- **Escludere:** aziende del settore IT e sicurezza informatica (sono concorrenti, non clienti)
- **Disattivare** l'espansione automatica del pubblico: su un bacino locale sballa il targeting

**Limiti di formato:** testo introduttivo 600 caratteri, ma **si vedono solo i primi ~150**
prima del "…altro" — il gancio deve stare lì. Titolo max 200 caratteri, meglio sotto i 70.
Come immagine va bene il formato verticale 1080×1350: anche su LinkedIn la maggior parte
delle visualizzazioni arriva da telefono.

---

### Variante A — NIS2 / conformità *(da testare per prima)*

**Testo introduttivo**
> La domanda non arriva più dagli hacker: arriva dal vostro cliente più grande, dall'assicurazione o dalla normativa.
>
> Con il recepimento della NIS2 (D.lgs. 138/2024) gli obblighi di gestione del rischio informatico si sono estesi a molti più settori — e toccano anche i fornitori delle aziende già obbligate.
>
> Il check-up di sicurezza informatica — il Vulnerability Assessment — è il punto di partenza: controlliamo ogni dispositivo collegato alla vostra rete, misuriamo la gravità di ciò che troviamo e vi consegniamo un piano di intervento in ordine di priorità.
>
> Ne parliamo senza impegno. Tecnolink, Firenze.

**Titolo:** `NIS2, GDPR, polizze cyber: sapete cosa rispondere?`
**Descrizione:** `Check-up di sicurezza informatica per PMI — Tecnolink, Firenze`
**CTA:** Scopri di più

---

### Variante B — "Siamo troppo piccoli"

**Testo introduttivo**
> "Siamo troppo piccoli per interessare a qualcuno."
>
> È la frase che sentiamo più spesso, ed è anche il motivo per cui le PMI sono un bersaglio comodo: gli attacchi oggi sono automatici e cercano difese deboli, non nomi importanti.
>
> Un check-up di sicurezza informatica vi dice esattamente dove siete esposti — computer, server, stampanti, gestionali, telecamere — e cosa sistemare per primo. Nessun fermo del lavoro, i dati restano dentro la vostra azienda.
>
> Ne parliamo senza impegno. Siamo a Firenze.

**Titolo:** `Quante porte aperte ha la rete della vostra azienda?`
**Descrizione:** `Check-up di sicurezza informatica — Tecnolink, Firenze`
**CTA:** Scopri di più

---

### Variante C — catena di fornitura

**Testo introduttivo**
> Vi è mai arrivato un questionario di sicurezza da un cliente, con la richiesta di compilarlo entro una settimana?
>
> Succede sempre più spesso: le aziende strutturate girano ai fornitori le verifiche che sono tenute a fare, e chi non sa rispondere resta fuori dalla fornitura.
>
> Il check-up di sicurezza vi dà le risposte documentate: cosa avete in rete, quali vulnerabilità note ci sono, quanto sono gravi e cosa state facendo per chiuderle.
>
> Ne parliamo mezz'ora, senza impegno, e vi diciamo se fa al caso vostro.

**Titolo:** `Il vostro cliente vi chiede garanzie sulla sicurezza IT?`
**Descrizione:** `Check-up di sicurezza informatica — Tecnolink, Firenze`
**CTA:** Scopri di più

---

### Variante D — messaggio locale

**Testo introduttivo**
> Ci occupiamo di sistemi informatici e sicurezza per le aziende di Firenze e dintorni. Persone con cui parlare, non un ticket in coda.
>
> Se non avete mai fatto un controllo di sicurezza sulla rete aziendale, il check-up di sicurezza è il modo più semplice per partire: individuiamo i punti deboli su ogni dispositivo collegato e vi spieghiamo di persona cosa sistemare, in che ordine e perché.
>
> Il primo confronto è senza impegno, e il preventivo arriva prima di qualsiasi attività.

**Titolo:** `Sicurezza informatica per le PMI di Firenze`
**Descrizione:** `Preventivo prima di iniziare — Tecnolink`
**CTA:** Scopri di più

---

### Da testare in parallelo: Lead Gen Form nativo

Vale la pena mettere a confronto **una variante con Lead Gen Form LinkedIn** contro la
stessa variante che porta alla landing. Il modulo nativo si precompila dal profilo e su
traffico freddo converte quasi sempre meglio; la landing però qualifica di più.
Campi da chiedere: nome, cognome, email aziendale, azienda, qualifica. Niente di più.

> Attenzione: i lead del modulo nativo **non passano dal form del sito**, quindi non
> arrivano via mail come gli altri. Vanno scaricati da Campaign Manager o collegati a un
> CRM/Zapier, altrimenti restano lì.

---

## 2. Facebook / Instagram — privati

**Obiettivo campagna:** Lead (conversione sul sito, evento `Lead`).
Partire con **Traffico** solo se il pixel non ha ancora dati.

### Targeting

- **Località:** Firenze + 25 km — *persone che vivono in questa località*
- **Età:** 30-65+ · **Tutti i generi**
- **Interessi (broad, un solo gruppo):** domotica, videosorveglianza, smart home, sicurezza domestica, Google Nest, tecnologia
- **Posizionamenti:** automatici (il grosso arriverà da Feed e Reels su mobile)
- Con budget contenuto, **conviene un pubblico ampio senza interessi**: su un bacino locale ristretto, restringere ancora fa solo salire il costo

**Limiti di formato:** testo principale — solo le prime ~125 battute si vedono prima del
"Altro". Titolo max ~40 caratteri. Immagine 1080×1350 nel feed (verticale, occupa più
schermo del quadrato) e 1080×1920 per storie e reel.

> **Politiche Meta — importante.** Meta rifiuta gli annunci che *affermano* o lasciano
> intendere di sapere qualcosa della situazione personale di chi legge. "La tua telecamera
> è stata violata" viene bocciato. Le versioni qui sotto usano **domande e ipotesi**, mai
> affermazioni sul destinatario: è anche il motivo per cui non trovi "sei stato hackerato"
> in nessuna delle varianti.

---

### Variante A — Wi-Fi *(da testare per prima)*

**Testo principale**
> Sai dire quanti dispositivi sono collegati al tuo Wi-Fi in questo momento?
>
> Tra telefoni, TV, telecamere, prese intelligenti e computer, in una casa normale sono più di dieci. Ne basta uno con una protezione debole per aprire la porta a tutti gli altri.
>
> Noi controlliamo la rete di casa tua come farebbe un malintenzionato — ma per proteggerti — e ti spieghiamo con parole semplici cosa conviene sistemare.
>
> 🏠 Preventivo prima di iniziare
> 📍 Firenze e dintorni
> 🔒 I tuoi dati restano tuoi

**Titolo:** `Chi è collegato al tuo Wi-Fi?`
**Descrizione:** `Check-up della rete di casa · Tecnolink Firenze`
**CTA:** Scopri di più

---

### Variante B — telecamere e dispositivi smart

**Testo principale**
> Hai una telecamera, un campanello smart o un baby monitor collegati a internet?
>
> Sono tra i dispositivi che si installano una volta e non si toccano più: password di fabbrica mai cambiate, aggiornamenti mai fatti. Ed è proprio lì che si infila chi cerca una porta aperta.
>
> Controlliamo tutti i dispositivi collegati alla tua rete e ti diciamo, senza paroloni, quali sono a posto e quali no.
>
> Siamo a Firenze e dintorni. Ne parliamo senza impegno.

**Titolo:** `La tua telecamera è davvero al sicuro?`
**Descrizione:** `Check-up della rete di casa · Tecnolink`
**CTA:** Scopri di più

---

### Variante C — password e conti

**Testo principale**
> Home banking, email, foto, social: oggi passa tutto dalla rete di casa.
>
> Se un solo dispositivo collegato ha una protezione debole, può diventare la strada per arrivare a tutto il resto — e di solito non te ne accorgi, perché chi entra ha tutto l'interesse a non farsi notare.
>
> Guardiamo la tua rete con occhi esperti e ti diciamo in modo chiaro cosa sistemare. Se preferisci, lo facciamo noi al posto tuo.
>
> Siamo a Firenze: persone vere con cui parlare, non un servizio anonimo.

**Titolo:** `Quanto è sicura la tua rete di casa?`
**Descrizione:** `Check-up della rete di casa · Firenze`
**CTA:** Scopri di più

---

### Variante D — il router dell'operatore

**Testo principale**
> "Il router me l'ha dato l'operatore, quindi sarà sicuro."
>
> Ci arriva con impostazioni standard, identiche a quelle di migliaia di altre case — e quasi nessuno le cambia o lo aggiorna mai. È il primo punto che andiamo a guardare, ed è anche quello che più spesso riserva sorprese.
>
> Ti facciamo un check-up completo della rete di casa e ti spieghiamo cosa conviene fare, senza tecnicismi.
>
> Il prezzo lo sai prima di iniziare.

**Titolo:** `Il router di casa non è mai stato aggiornato?`
**Descrizione:** `Check-up della rete di casa · Tecnolink Firenze`
**CTA:** Scopri di più

---

## 3. Impostazione dei test

Non far girare quattro varianti in contemporanea con un budget piccolo: nessuna raccoglie
abbastanza dati per dire qualcosa.

1. **Primo giro:** varianti A e B, budget uguale, stesso pubblico, 10-14 giorni.
2. Guarda **il costo per lead**, non il CTR: un annuncio che porta molti clic e nessuna
   richiesta sta solo bruciando budget.
3. Chi vince resta, e ci si affianca C (o D) contro di lui.
4. Su LinkedIn **cambia la creatività ogni 4-6 settimane**: il bacino locale è piccolo e
   si satura in fretta.

**Budget iniziale:** `[DA DECIDERE]` — tieni presente che LinkedIn ha un minimo di circa
10 €/giorno per gruppo di annunci e un costo per clic molto più alto di Meta, quindi va
valutato su un orizzonte di settimane, non di giorni.

### Cosa guardare nei risultati

Ogni lead arriva via mail con **pagina di provenienza, campagna e UTM** già dentro: si
capisce a colpo d'occhio quale annuncio ha portato quale richiesta. Da confrontare:

- costo per lead, per variante
- quanti lead diventano un appuntamento vero (LinkedIn ne porta meno ma più qualificati)
- sulla pagina privati, quante persone completano il test interattivo prima di scrivere

---

## 4. Da sistemare quando avrete il materiale

Cose che oggi mancano e che alzerebbero la resa più di qualsiasi ritocco al testo:

- **Testimonianze di clienti** (anche solo nome di battesimo + settore + una frase). Sulla
  pagina aziende è quello che manca di più.
- **Loghi dei clienti** che accettano di essere citati, nella sezione "Perché Tecnolink".
- **Un prezzo di riferimento per il controllo casa**: sul traffico Facebook l'assenza di
  qualsiasi indicazione economica è il primo motivo di abbandono.
- **Il link LinkedIn nel footer** punta a `https://www.linkedin.com` invece che alla pagina
  aziendale (`Pages/Shared/_Layout.cshtml`). Da correggere prima di mandarci traffico.
