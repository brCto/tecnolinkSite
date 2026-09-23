# Le pagine del sito — a cosa servono e come sono fatte

Questo file mette insieme, in un posto solo, **la finalità di ogni pagina** e le regole
comuni con cui sono costruite. Serve a non dover ricostruire ogni volta perché una pagina
esiste, perché è scritta in un certo modo e cosa si rompe toccandola.

Gli altri documenti del repository coprono altro: i **testi e il targeting degli annunci**
stanno in [`campagne-ads.md`](campagne-ads.md), i **creativi** in
[`creativi/`](creativi/README.md), i **video** in [`video/README.md`](video/README.md) e
il passaggio di consegne in [`video/CONTINUARE.md`](video/CONTINUARE.md).

---

## 1. La mappa, in un colpo d'occhio

| Indirizzo | File | Per chi | Finalità | `Robots` | Modo |
|---|---|---|---|---|---|
| `/` | `Pages/Index.cshtml` | chiunque arrivi da ricerca, passaparola, biglietto da visita | Presentare l'azienda per intero e raccogliere richieste di consulenza | index | sito |
| `/offerte/vulnerability-assessment` | `Offerte/VulnerabilityAssessment.cshtml` | chi cerca "check-up sicurezza" e non è del mestiere | Spiegare il servizio partendo da zero — è la pagina **indicizzabile** del check-up | index | sito |
| `/offerte/vulnerability-assessment-intermedio` | `…Intermedio.cshtml` | chi ha una infarinatura | Stessa cosa, un gradino più concreto | index | sito |
| `/offerte/vulnerability-assessment-tecnico` | `…Tecnico.cshtml` | responsabili IT, consulenti, gare | Metodologia, CVSS, VA ≠ PT: la pagina da mandare a chi valuta | index | sito |
| `/offerte/vulnerability-assessment/aziende` | `…Aziende.cshtml` | traffico **acquistato** LinkedIn | Trasformare un clic in una richiesta di analisi | **noindex** | **landing** |
| `/offerte/vulnerability-assessment/privati` | `…Privati.cshtml` | traffico **acquistato** Facebook/Instagram | Idem, sul check-up della rete di casa | **noindex** | **landing** |
| `/soluzioni/<settore>` (12 pagine) | `Soluzioni/*.cshtml` | un settore alla volta | Pagina da mandare in trattativa: "abbiamo capito il vostro mestiere" | **noindex** | sito |
| `/interno/materiali-campagne` | `Interno/MaterialiCampagne.cshtml` | noi | Indice interno dei creativi delle campagne | **noindex, nofollow** | sito |
| `/privacy` | `Privacy.cshtml` | obbligo | Informativa GDPR, linkata da ogni modulo | index | sito |
| `/Error/{codice}` | `Error.cshtml` | incidenti | 404 e altri errori senza far uscire dal sito | noindex | sito |

Tre note che valgono più della tabella:

- **Le landing sono le uniche pagine progettate per costare soldi.** Ogni loro scelta —
  niente menu, un solo pulsante, modulo corto — nasce da lì. Vederle come "pagine del
  sito" porta a ottimizzarle nel modo sbagliato.
- **Le pagine `noindex` non sono pagine di serie B**: sono pagine il cui traffico arriva
  da un link che diamo noi (un annuncio, una mail, una trattativa), non da Google.
- **Le tre versioni del check-up sono la stessa offerta raccontata a tre livelli.**
  Non sono tre servizi. Il selettore in cima a ognuna (`Base · Intermedia · Tecnica`)
  serve al lettore per scegliersi il livello da solo, senza che noi si debba indovinare.

---

## 2. Le pagine, una famiglia alla volta

### 2.1 La home — `/`

**Finalità:** far capire in trenta secondi chi siamo, cosa facciamo e come si comincia, a
chiunque arrivi senza sapere niente di noi.

Sequenza delle sezioni: hero → numeri → video → servizi → soluzioni avanzate →
tecnoSHIELD → chi siamo → Security Check → FAQ → contatti.

Cose non ovvie:

- **Il marchio grande in cima all'hero** (logo + "Sicurezza informatica a Firenze") non è
  decorazione: chi arriva da un annuncio o da una ricerca deve capire dove è finito senza
  cercare il logo piccolo nella barra.
- **Il video sta in pagina due volte, con lo stesso file.** Da desktop è nell'hero,
  tagliato in diagonale sulla metà destra; da telefono è nella sezione `#video` più in
  basso, dove c'è spazio. Ne parte **uno solo** — quello nascosto non viene nemmeno
  scaricato: è per questo che sui tag non c'è `autoplay`, che li scaricherebbe entrambi.
  La logica sta in fondo a `wwwroot/js/site.js`.
- **⚠️ La classe `has-video` sull'hero della home è obbligatoria e vale solo lì.** Accende
  le regole del taglio in diagonale in `site.css` (griglia al 46%, contenitore a tutta
  larghezza, immagine nascosta). Senza quella classe le stesse regole colpivano anche gli
  hero delle pagine del check-up e rompevano il selettore Base/Intermedia/Tecnica. Il
  motivo è scritto sia in `Index.cshtml` sia in `site.css`, dove lo si va a cercare.
- **Il Security Check** è un widget con animazione a quattro passi, ma dietro c'è una
  richiesta vera a `/api/security-check`: l'animazione gira mentre la chiamata parte, e
  l'esito si mostra solo se la richiesta è andata a buon fine. Non è una finta.
- **La foto di "Chi siamo" è nostra** (`~/img/chi-siamo.jpg`, un fotogramma delle clip del
  video). Prima c'era una foto d'archivio con scritto `alt="Il team Tecnolink al lavoro"`:
  gente che con Tecnolink non c'entrava niente, presentata come il team.

### 2.2 Le tre pagine del check-up di sicurezza

Stesso servizio, tre livelli di lettura, collegati fra loro dal selettore in cima.
Tutte e tre sono **indicizzabili**: sono il lavoro SEO sul check-up.

**Base — `/offerte/vulnerability-assessment`.** Parte da "cos'è una rete" e arriva al
report, usando l'analogia porte/serrature/edificio dall'inizio alla fine. Contiene il
diagramma di rete animato (SVG + scanline) e il semaforo CVSS spiegato senza sigle.
È la pagina da linkare a chi non è del mestiere, ed è quella che risponde anche ai
privati (c'è una FAQ apposta).

**Intermedia — `/offerte/vulnerability-assessment-intermedio`.** Per chi sa già cos'è un
router: le 6 fasi del percorso, il punteggio da 0 a 10, cosa si riceve.

**Tecnica — `/offerte/vulnerability-assessment-tecnico`.** Asset discovery, enumerazione
dei servizi, detection su NVD/CVE, CVSS v3.1, scansioni authenticated/unauthenticated/
agentless, **Vulnerability Assessment ≠ Penetration Test**, ciclo di remediation. È la
pagina da mandare a un responsabile IT o da citare in un questionario di fornitura — ed è
l'unico posto in cui "Vulnerability Assessment" fa da protagonista invece che da glossa.

### 2.3 Le due landing delle campagne

Sono le pagine di destinazione degli annunci a pagamento, e le uniche con
`ViewData["Landing"] = true`.

**`/offerte/vulnerability-assessment/aziende`** — traffico LinkedIn, PMI di Firenze e
province limitrofe. Il filo del discorso: *«siamo troppo piccoli per interessare a
qualcuno»* → non è più solo rischio, è una **richiesta formale** (NIS2, questionari dei
clienti, polizze) → cos'è il check-up → sei passaggi → semaforo delle priorità → cosa
ricevi → garanzie → **cosa succede dopo che compili il modulo** → FAQ → modulo.

**`/offerte/vulnerability-assessment/privati`** — traffico Facebook/Instagram, famiglie
entro 25 km da Firenze. Il filo: cosa può succedere → *«controlliamo la tua casa come
farebbe un ladro»* → stanza per stanza → come funziona → **auto-test a caselle** →
cosa ottieni → quanto costa → quattro miti → perché fidarti → FAQ → modulo.

Quello che le distingue dal resto del sito:

- **Modalità landing** (vedi §3.3): niente menu di navigazione, footer ridotto. Il
  traffico è pagato, e ogni via d'uscita è un clic buttato. Restano però **il logo che
  riporta alla home e una voce "Home" esplicita**: il logo ci porta già, ma non tutti lo
  sanno o ci provano.
- **Moduli più corti e con il messaggio facoltativo.** Sulle landing un campo di testo
  obbligatorio costa più lead di quanti ne qualifichi — il controllo lato server lo
  rispecchia: obbligatori solo nome ed email.
- **Un campo in più per pubblico:** su aziende il menu "quanti dispositivi avete in rete"
  (qualifica la richiesta prima della chiamata), su privati il telefono con la formula
  "se preferisci che ti chiamiamo".
- **L'impegno di ricontatto è scritto sopra al pulsante**, non in fondo: *entro 24 ore
  lavorative* (aziende), *entro 24 ore* (privati), con la promessa esplicita di dire di
  no se il servizio non serve.
- **Barra CTA fissa solo da telefono** su privati (`va-sticky-cta`): sul mobile il pulsante
  deve restare a portata di pollice per tutta la lettura. Attenzione a non affiancarla ad
  altri pulsanti fissi — era già successo che due si sovrapponessero.
- **La foto dell'hero privati non viene scaricata sotto i 576 px**: nasconderla col CSS non
  bastava, il browser la prendeva lo stesso (85 KB e una richiesta a un server esterno).
  C'è una `<source>` vuota alla stessa soglia a cui la nascondiamo.

### 2.4 Le dodici pagine per settore — `/soluzioni/<settore>`

Avvocati, commercialisti, studi notarili, studi medici, studi di architettura, farmacie,
hotel, ristorazione, e-commerce, agenzie immobiliari, assicurazioni, concessionarie auto.

**Finalità:** avere, per ogni settore che ci interessa, una pagina che dimostri in trenta
secondi che ne conosciamo i problemi specifici — il Wi-Fi ospiti di un hotel, i fascicoli
di uno studio legale, il PMS che non deve fermarsi in alta stagione. Si mandano in
trattativa, per mail o dopo una fiera; non aspettano traffico da Google.

**Struttura identica per tutte**, ed è voluta: hero con badge di settore → "cosa rischi"
(tre carte) → "come ti proteggiamo" (tre servizi, sempre con tecnoSHIELD in testa) → la
citazione su privacy e sicurezza → modulo con `data-source` uguale al settore. Cambiano i
testi, le icone e la foto.

Da sapere: sono **tutte `noindex, follow`**. Non c'è una nota che spieghi la decisione —
è coerente con dodici pagine di struttura identica (Google le leggerebbe come contenuto
sottile e duplicato), ma se un giorno si volesse usarle per posizionarsi va **prima**
differenziato il contenuto, e solo dopo tolto il `noindex`.

### 2.5 Le pagine di servizio

**`/interno/materiali-campagne`** — l'indice dei creativi delle campagne: tutti i visual,
i comandi per rigenerarli e le direzioni non ancora provate. `noindex, nofollow` ma **non
protetta da password**: chi conosce l'indirizzo entra. Non metterci dentro niente che non
possa essere letto da un estraneo.

**`/privacy`** — informativa GDPR, linkata dalla riga in piccolo di ogni modulo e dal
banner dei cookie. Va tenuta allineata a cosa raccogliamo davvero.

**`/Error/{codice}`** — 404 e altri errori, agganciata da
`UseStatusCodePagesWithReExecute`. Non è una pagina di scuse: è pensata per riportare in
carreggiata chi ci è finito.

---

## 3. L'impalcatura comune

### 3.1 Cosa c'è sotto

ASP.NET Core **Razor Pages**. Quasi tutte le pagine sono **solo `.cshtml`**, senza page
model: non hanno niente da calcolare lato server. Il `.cshtml.cs` esiste solo dove serve
davvero (`Index`, `Privacy`, `Error`). Gli indirizzi "belli" sono scritti nella direttiva
`@page` di ciascuna (`@page "/offerte/vulnerability-assessment/aziende"`), non dedotti dal
percorso del file.

I moduli parlano con due endpoint minimal API registrati in `Program.cs` via
`MapLeadEndpoints()`. Niente database: un lead è una mail.

### 3.2 Il contratto con il layout: quattro `ViewData`

Ogni pagina dichiara in cima quello che il layout deve sapere. Sono quattro chiavi, e
sono l'unico modo che una pagina ha per cambiare la propria cornice:

| Chiave | Cosa fa | Se manca |
|---|---|---|
| `Title` | `<title>`, `og:title`, `twitter:title` (con ` - Tecnolink` in coda) | titolo generico dell'azienda |
| `Description` | meta description + le due Open Graph | descrizione generica |
| `Robots` | `<meta name="robots">` | `index, follow` — **quindi il `noindex` va sempre scritto a mano** |
| `Landing` | `true` accende la modalità landing | modalità sito |

Il resto lo mette `_Layout.cshtml` da solo: canonical calcolata dalla richiesta, immagine
OG, favicon, font, e il **JSON-LD `ProfessionalService`** con indirizzo, telefono, mail e
raggio d'azione di 30 km da Firenze. Se cambiano recapiti o sede, il JSON-LD è il posto
che tutti si dimenticano.

### 3.3 La modalità landing

Una riga (`ViewData["Landing"] = true`) e il layout cambia comportamento:

- il menu di navigazione sparisce, resta la voce **Home**, la cornetta e un solo pulsante
  ("Richiedi un'analisi", che punta a `#contatti` della pagina stessa);
- il footer si riduce a marchio, recapiti, P.IVA e link alla privacy.

Le pagine restano comunque raggiungibili dal menu del sito normale finché ci sono le voci
temporanee (vedi §4).

### 3.4 Aspetto: un foglio comune, e stili locali con prefisso

`wwwroot/css/site.css` è il design system: le variabili in `:root` (navy/cyan/violet,
gradiente del marchio, raggi, ombre, Poppins per i titoli e Inter per il testo) e tutte le
classi `tk-*` — `tk-hero`, `tk-section`, `tk-service-card`, `tk-feature-card`, `tk-form`,
`tk-faq`, `eyebrow`, `btn-tk`, `reveal`.

**Regola pratica: si compone con le classi `tk-*`.** Una pagina scrive CSS proprio solo
per quello che è suo e di nessun altro, in un `<style>` in cima al file e **con un prefisso
per pagina**: `va-` per il check-up e le landing, `vi-` per la versione intermedia, `vat-`
per la tecnica. Serve a evitare che una regola scritta per una pagina vada a toccarne
un'altra — è esattamente il tipo di incidente costato l'hero-video.

**Gotcha di Razor:** dentro un `<style>` in un `.cshtml`, `@media` e `@keyframes` vanno
scritti **`@@media` e `@@keyframes`**, altrimenti Razor li legge come codice C#. Vale
anche per `@@context`/`@@type` nel JSON-LD del layout.

### 3.5 Comportamenti condivisi — `wwwroot/js/site.js`

Un file solo, blocchi indipendenti, ognuno che esce subito se il suo elemento non c'è in
pagina. In ordine:

1. **Attribuzione campagne.** Gli UTM del **primo** ingresso finiscono in `sessionStorage`
   e restano per tutta la sessione, così il lead resta collegato all'annuncio anche dopo
   altri clic. Raccoglie anche `fbclid`, `li_fat_id` e `gclid` quando gli UTM mancano.
2. **Analytics con consenso.** GA4, Meta Pixel e LinkedIn Insight Tag si caricano **solo
   dopo l'accettazione** sul banner. Gli ID stanno in `appsettings.json` sotto `Analytics:`
   — se sono vuoti, il banner non compare nemmeno. All'invio di un modulo scatta la
   conversione su tutte e tre (`generate_lead`, `Lead`, `conversion_id`), e i clic su
   `tel:` e `mailto:` mandano un evento secondario.
3. **Navbar** (ombra allo scroll, menu mobile), **reveal allo scroll**, **barra di
   avanzamento**, **torna in cima**, **contatori animati**, **spotlight sulle carte**,
   **canvas animato dell'hero** (rispetta `prefers-reduced-motion`).
4. **Modulo di contatto** → `/api/contact`.
5. **Widget Security Check** → `/api/security-check`.
6. **Video di presentazione** (vedi §2.1). Qui `prefers-reduced-motion` **non** viene
   guardato, di proposito: su Windows quell'impostazione risulta attiva a un sacco di gente
   che non l'ha mai toccata, e il video restava fermo sul poster senza che si capisse
   perché. Non ha traccia audio e c'è il comando di pausa, quindi parte sempre.

### 3.6 Dal modulo alla casella di posta

Tutti i moduli del sito hanno `id="tkContactForm"` e un attributo **`data-source`** che
dice da quale pagina arriva la richiesta (`Home`, `VA-Aziende`, `VA-Privati`, `Hotel`, …).
È quello che permette di leggere la provenienza a colpo d'occhio in casella.

Il percorso completo: `fetch` su `/api/contact` → **honeypot** (campo nascosto `hp_field`:
se è pieno la richiesta viene scartata fingendo successo) → **limite di 5 invii ogni 10
minuti per IP** → validazione (solo nome ed email obbligatori) → mail HTML a
`Smtp:ToAddress` con dentro pagina di provenienza, recapiti, dimensione della rete,
**campagna e UTM**, messaggio.

Due dettagli che sembrano bug e non lo sono:

- **Il mittente resta un indirizzo Tecnolink**, mai quello di chi compila: spedire "da"
  lui sarebbe spoofing e finirebbe in spam. Nel nome visualizzato c'è comunque chi ha
  scritto, e il `Reply-To` fa sì che "Rispondi" scriva davvero a lui.
- **Se l'SMTP non è configurato l'utente vede lo stesso il messaggio di successo**, e la
  richiesta finisce nei log. Per le prove si valorizza `Smtp:PickupDirectory` e le mail
  vengono scritte come file `.eml` invece di essere spedite — in produzione va vuota.

### 3.7 Farlo girare

```bash
dotnet run --project tecnolinkSite/tecnolinkSite.csproj
```

I profili sono in `.claude/launch.json` (`tecnolinkSite-http`, `-https`, `-watch`).
In produzione: Docker + Caddy come reverse proxy con HTTPS automatico; il container
dell'app è raggiungibile **solo** da Caddy, ed è per questo che `Program.cs` si fida degli
header inoltrati da qualunque sorgente. Se un giorno si esponesse la porta dell'app
direttamente, quella parte va rivista — il commento nel file lo dice.

---

## 4. Regole di contenuto, decise con il cliente

Valgono per **ogni testo nuovo**, su qualsiasi pagina. Le riporto qui perché sono la cosa
che si perde per prima, e riproporre uno di questi claim significa rifare il lavoro.

- **Niente "20 anni di esperienza"**, in nessuna forma. Tolto il 31/07/2026 da tutto il
  sito, dai creativi e dal video. Motivo dato dal cliente: nel settore tech quel claim non
  interessa quasi a nessuno. Attenzione, compariva anche in forma numerica separata
  (`20+`, badge, contatore con `data-target="20"`), che cercando "20 anni" non si trova.
- **Nessuna statistica o testimonianza non verificata.** Dove servirebbe un dato reale,
  nei documenti è segnato `[DA COMPILARE]`. Non inventarli.
- **Il nome del servizio** è "Check-up di sicurezza informatica" per le aziende e
  "Check-up della rete di casa" per i privati. *Vulnerability Assessment* compare nel
  corpo dei materiali business e sulla pagina tecnica — mai come nome commerciale.
- **Niente promesse di gratuità**: "senza impegno" e "preventivo prima di iniziare".
- **Policy Meta** (vale per landing e annunci): mai affermare qualcosa sulla situazione
  personale di chi legge. "La tua telecamera è esposta" viene rifiutato. Solo domande,
  ipotesi e fatti generali.
- **Il telefono è `055 617008`** → `tel:+39055617008`. C'era un `6` di troppo nei link
  `tel:`, quindi ogni tocco sul numero da telefono componeva un numero inesistente.
- **Le voci di menu `VA · Aziende`, `VA · Privati` e `Materiali`** in `_Layout.cshtml` sono
  temporanee (cerca il commento `TEMP`) e **vanno tolte prima di lanciare gli annunci**:
  servono solo a noi per arrivare alle landing senza cliccare un annuncio.

---

## 5. Cose ancora aperte

- **L'immagine di un report vero.** Il riquadro a destra dell'hero delle pagine check-up è
  un disegno segnaposto (`Pages/Shared/_HeroReport.cshtml`), con i numeri dichiarati come
  esempio dentro l'immagine stessa — farli passare per il referto di un cliente sarebbe una
  bugia, oltre che un problema in caso di verifica sugli annunci. Serve la foto o la
  schermata di un report reale, ripulita dai dati del cliente, verticale 4:5 (es.
  840×1050). Le istruzioni per sostituirla sono scritte in cima alla partial: si cambia un
  file solo e cambia su tutte le pagine che la usano.
- **Un prezzo di riferimento per il check-up di casa.** Sul traffico Facebook l'assenza di
  qualsiasi indicazione economica è il primo motivo di abbandono. Il punto in cui metterlo
  è già predisposto e segnalato con un commento nella pagina privati.
- **Testimonianze e loghi dei clienti.** Sulla pagina aziende è quello che manca di più.
- **Gli ID di GA4, Meta Pixel e LinkedIn.** Il codice è pronto e aspetta solo i valori in
  `appsettings.json`. Senza, le campagne partono cieche.
- **Le foto d'archivio Unsplash** sono ancora agganciate al dominio esterno su home,
  pagine check-up e Soluzioni. Funzionano, ma dipendono da un servizio terzo e non sono
  ottimizzate: prima o poi vanno portate sul nostro dominio, come già fatto per
  `chi-siamo.jpg`.
- **Il `noindex` sulle dodici pagine Soluzioni** (vedi §2.4): decisione da confermare, e
  comunque non reversibile con una riga.

---

## 6. Aggiungere una pagina nuova

1. Crea il `.cshtml` sotto la cartella giusta (`Offerte/`, `Soluzioni/`, `Interno/`) e
   dagli un indirizzo esplicito con `@page "/…"`, tutto minuscolo e con i trattini.
2. Scrivi i quattro `ViewData` in cima. **Se la pagina non deve finire su Google, il
   `Robots` va messo a mano** — il valore che manca vuol dire "indicizza".
3. Componi con le classi `tk-*`. Se serve CSS solo tuo, mettilo in un `<style>` in cima
   con un prefisso di pagina, e ricordati di `@@media`.
4. Riusa il modulo: `class="tk-form" id="tkContactForm"` con un `data-source` nuovo e
   riconoscibile, il campo honeypot `hp_field`, i due `div` di esito. Il JavaScript lo
   aggancia da solo, non c'è niente da registrare.
5. Se è la pagina di destinazione di una campagna: `ViewData["Landing"] = true`, modulo
   corto (obbligatori solo nome ed email), impegno di ricontatto sopra al pulsante, e
   l'indirizzo con gli UTM va scritto in [`campagne-ads.md`](campagne-ads.md).
6. Rileggi il §4 prima di consegnare i testi.
