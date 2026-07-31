# Come continuare a lavorare sul video

Questo file è scritto per la prossima sessione di Claude Code che mette mano a
`docs/video/`. Leggilo prima di toccare qualsiasi cosa: contiene lo stato reale e
una decina di trappole che sono già costate tempo una volta. Il `README.md`
accanto spiega invece *cosa* fa il sistema.

---

## 1. Stato al 31 luglio 2026

Nella cartella convivono **due montaggi**, che condividono lo stesso motore.

| Montaggio | Durata | Contenuti | Audio | Clip | Stato |
|---|---|---|---|---|---|
| **lungo** | 1:29 | `pagina/contenuti.js` | no | no | ✅ finito, registrato e verificato |
| **breve** | 0:30 | `pagina/contenuti-breve.js` | musica (+ voce opzionale) | sì, 7 | ✅ finito a 720p, registrato e verificato |

I file finiti stanno in `mp4/` e sono versionati:

- `tecnolink-presentazione-1920x1080.mp4` — 89 s, 9,8 MB
- `tecnolink-presentazione-1080x1920.mp4` — 89 s, 8,8 MB
- `tecnolink-presentazione-30s-1280x720.mp4` — 30 s, con musica
- `tecnolink-presentazione-30s-720x1280.mp4` — 30 s, con musica
- `tecnolink-presentazione-30s-voce-1280x720.mp4` — 30 s, con musica e voce
- `tecnolink-presentazione-30s-voce-720x1280.mp4` — 30 s, con musica e voce
- `tecnolink-presentazione-30s-muto-1280x720.mp4` — 30 s, **senza audio**, è la
  copia che gira sulla home del sito (punto 8)

Il montaggio breve esce a **720p**, e non è un ripiego: vedi il punto 2.

Le due domande che erano aperte col cliente (il claim "vent'anni" e il numero di
telefono) **sono state chiuse**, e il video è allineato a entrambe: punto 4.

---

## 2. I fotogrammi persi del montaggio breve (risolto)

Questo era **il** problema aperto, ed è chiuso. Lo racconto per intero perché il
numero da guardare e la strada che funziona valgono anche per le prossime scene
pesanti.

**Il sintomo.** Il 30 s registrato a 1920×1080 disegnava 358 fotogrammi su 900:
542 persi, il 60%, video a scatti.

**Perché.** `MediaRecorder` incide in tempo reale e marca i fotogrammi con
l'orologio di sistema: non si può registrare più lentamente e poi accelerare. Ogni
fotogramma del montaggio breve deve, entro 33 ms e **senza GPU**:

1. decodificare un fotogramma di una clip 720p,
2. ingrandirlo a 1080p con Ken Burns,
3. sovrapporre velatura, vignettatura e rete di particelle,
4. disegnare testo e riquadri,
5. e in più l'encoder H.264 software lavora sullo stesso processore.

Il montaggio lungo non ha mai avuto il problema (25 persi su 2670) proprio perché
non ha clip da decodificare.

**Come è andata a finire.** Le due ottimizzazioni già applicate (i segmenti della
rete raggruppati in pochi `Path2D` invece di oltre mille `stroke()`, e la velatura
disegnata una volta e ricopiata) da sole non bastavano: hanno portato le perdite
da 542 a 112 su 900, cioè dal 60% al 12,4%, e il 12% si vedeva ancora. **A
risolvere è stato scendere a 720p**, come previsto: le clip sono girate a 720p,
quindi a 1280×720 l'ingrandimento sparisce del tutto e la codifica costa meno
della metà.

Misurato alternando i due formati di fila, nella stessa mezz'ora e sulla stessa
macchina, musica sola, 16:9:

| | Persi su 900 |
|---|---|
| 1080p | 193, 193 |
| **720p** | **115, 43** |

### Il numero dei fotogrammi persi dipende dalla macchina, non solo dalla scena

È la cosa più importante da sapere prima di rimettere mano a questa parte, e non
era chiara alla sessione precedente. **La stessa identica configurazione** (breve,
16:9, 720p, musica) nel giro di un'ora ha dato **26 persi e 199 persi**. Non è
cambiato niente nel codice: era cambiato il carico della macchina.

Due cause viste dal vivo:

- **Una copia di `pagina/index.html` aperta in un browser.** La pagina parte da
  sola e disegna la sua animazione di continuo: mangia un core per tutta la durata
  della registrazione. Basta averla lasciata aperta in una scheda per raddoppiare
  le perdite. Chiudila prima di registrare.
- **Il calore.** Dopo mezz'ora di registrazioni di fila la codifica H.264 software
  scalda il processore e le prestazioni calano in modo evidente e duraturo. Le
  misure migliori sono quelle a macchina fredda.

Conseguenze pratiche:

1. **Non fidarti di una misura sola** per decidere se una modifica ha peggiorato
   le cose. Confronta sempre due configurazioni **di fila**, come nella tabella
   qui sopra: è l'unico confronto che regge.
2. **Registra a macchina scarica**, un formato alla volta, e se il numero non ti
   piace **rilancia e tieni il migliore** — la variabilità fra due tentativi
   identici è più grande della differenza fra molte scelte di progetto.
3. Per la cronaca: si era sospettato che la voce narrante costasse tanto (aveva
   dato 251 persi). Non è vero, era solo la macchina carica: rifatta a macchina
   scarica, la versione **verticale con voce** ha dato **25 persi su 900**, il
   miglior risultato di tutta la sessione.

I quattro file consegnati sono stati registrati così, tenendo il tentativo
migliore: 26, 64, 76 e 25 persi su 900. Sono stati riaperti e decodificati con
`node verifica.mjs`, e i fotogrammi estratti guardati a dimensione piena.

Se un domani la scena si appesantisse davvero, la leva successiva è **25 fps**
invece di 30 (parametro `fps` in `tkRegistra`): in Italia è comunque lo standard
televisivo.

Due cose da non rifare:

- **Non provare a rendere la registrazione più lenta del tempo reale.** Non è una
  questione di parametri, è come funziona `MediaRecorder`. L'alternativa vera
  sarebbe estrarre i fotogrammi uno a uno e assemblarli con ffmpeg, ma **ffmpeg
  non è installato su questa macchina** e scaricarlo richiede il consenso
  esplicito dell'utente.
- **Non alzare la risoluzione del breve "per avere più qualità".** A 1080p non
  c'è più dettaglio da mostrare — le clip sono 720p — e si torna dritti ai
  fotogrammi persi.

Per rifare i quattro file del breve:

```bash
node registra.mjs --montaggio breve          # 720p, i due formati
node registra.mjs --montaggio breve --voce   # gli stessi due, con la voce
node verifica.mjs
```

---

## 3. Prima di registrare: prendi le clip

Le clip **non sono versionate** (35 MB, e sono di Mixkit, non nostre: la licenza
ci lascia usarle nei nostri video, non ridistribuirle). Chi clona il repo deve
riscaricarle:

```bash
cd docs/video && node clip/scarica.mjs
node narrazione.mjs        # solo se serve la voce
```

Se `scarica.mjs` viene interrotto da errori `429`, non è rotto: è Cloudflare che
limita le richieste. Ha già le attese e i ritentativi dentro — rilancialo dopo un
minuto e riprende da dove si era fermato.

---

## 4. Vincoli da rispettare (non sono opinioni)

**Licenza delle clip.** Mixkit ha **due** licenze per i video e dall'URL del file
non si distinguono:

- **Free License** — uso commerciale, pubblicità e social aziendali permessi,
  nessuna attribuzione richiesta. ✅ le uniche utilizzabili.
- **Restricted License** — *"personal projects only"*, vieta esplicitamente
  progetti commerciali, pubblicità, social aziendali e YouTube. ❌

Un video istituzionale di Tecnolink è a tutti gli effetti un uso commerciale. Se
aggiungi o sostituisci una clip, **non fidarti del fatto che sta su un sito di
"free stock video"**: mettila in `clip/elenco.mjs` e lancia
`node clip/scarica.mjs`, che rilegge la licenza dalla pagina e si ferma se non è
la Free. Alla prima scelta di clip, 5 su 8 erano Restricted.

Coverr è stato scartato apposta: consente l'uso commerciale ma **richiede
attribuzione** sui download gratuiti, e un credito a schermo su un video
istituzionale non ci sta.

**Contenuto.** Valgono i vincoli già decisi per le campagne (vedi
`docs/campagne-ads.md`):

- nessun dato o testimonianza non verificabile;
- niente promesse di gratuità: si dice "senza impegno" e "preventivo prima di
  iniziare";
- niente affermazioni sulla situazione personale di chi guarda (policy Meta);
- il servizio si chiama "Check-up di sicurezza informatica"; *Vulnerability
  Assessment* solo nel corpo dei materiali business, mai come nome.

**Le due cose che erano in sospeso col cliente sono state chiuse**, e il video è
già stato allineato a entrambe:

1. **Il claim sugli anni è stato tolto da tutto il sito**, non solo dai materiali
   delle campagne. Il montaggio lungo diceva "Da vent'anni a Firenze" e mostrava
   il dato "20+ Anni di esperienza": il titolo ora riprende parola per parola
   quello che ha sostituito il claim nell'hero della home ("Sicurezza informatica
   a Firenze"), e il dato è stato tolto come lì, lasciandone due invece di tre.
   Nel montaggio breve il claim non compariva. **I due MP4 del lungo sono stati
   rifatti**: quelli di prima dicevano ancora "vent'anni", non riusarli.
2. **Il telefono giusto è `055 617008`**, cioè `tel:+39055617008` — confermato
   dal cliente, dal sito in produzione e dalla scheda LinkedIn. I link `tel:` del
   repo avevano un `6` di troppo e sono stati corretti sul sito (sul branch
   `claude/agent-instructions-review-b92eb5`, non ancora unito a master). Il video
   mostra il numero scritto, nella forma giusta, e non ha link: non c'era niente
   da correggere qui.

Il titolo del "Chi siamo" sta su **tre righe** e non due: "Sicurezza informatica a
Firenze." su una riga sola esce dai margini in verticale, dove la riga utile è
940 px su 1080. È il tipo di difetto che si vede solo guardando il provino a
dimensione piena.

---

## 5. Come è fatto

Il video è un `<canvas>` disegnato fotogramma per fotogramma e inciso con
`MediaRecorder` dentro Edge in headless, pilotato via DevTools Protocol. Nessuna
dipendenza npm: il progetto non ha un `package.json`, e bastano il `WebSocket`
globale di Node 22+ e il browser già installato. Stessa impostazione dei creativi
statici in `docs/creativi/`.

| File | Cosa fa |
|---|---|
| `pagina/contenuti.js` | Testi e scaletta del montaggio **lungo** |
| `pagina/contenuti-breve.js` | Testi, scaletta, clip e battute di voce del montaggio **breve** |
| `pagina/scena.js` | Il motore: sfondo, clip, tipografia, tutte le scene |
| `pagina/musica.js` | La colonna sonora, sintetizzata con Web Audio |
| `pagina/risorse.js` | Il logo come data URI (generato, non modificare a mano) |
| `pagina/index.html` | La pagina: anteprima a mano e registrazione |
| `registra.mjs` | Registra i video |
| `provini.mjs` | Estrae fermo immagine, per lavorare in fretta |
| `verifica.mjs` | Riapre i video prodotti e li decodifica davvero |
| `narrazione.mjs` + `.ps1` | Generano la voce narrante con la sintesi di Windows |
| `clip/elenco.mjs` | Quali clip, con quale licenza da verificare |
| `clip/scarica.mjs` | Verifica le licenze e scarica |
| `risorse.mjs` | Passaggio dei binari fra Node e la pagina |
| `cdp.mjs` | Client DevTools Protocol |

**La regola d'oro del motore:** `TK.disegna(t)` dipende **solo** da `t`. Nessuno
stato che si accumula fra un fotogramma e l'altro. È ciò che rende le
registrazioni ripetibili e permette a `provini.mjs` di saltare a un istante
qualsiasi. Se aggiungi un effetto, calcolalo dal tempo, non incrementando una
variabile a ogni chiamata. L'unica eccezione dichiarata è la riproduzione delle
clip, che va in tempo reale e si sincronizza da sé perché anche l'incisione è in
tempo reale (`preparaFotogramma()` esiste apposta per rimettere le clip al punto
giusto quando si estrae un fermo immagine).

**Il ritmo del montaggio breve** è costruito su multipli di 2 secondi, cioè una
battuta a 120 bpm. Se cambi la durata di una scena, tienila multipla di 2: è il
motivo per cui gli stacchi cadono sul tempo della musica invece che a caso. La
musica si riadatta da sola, la scaletta no.

---

## 6. Trappole già scoperte

Ognuna di queste è costata tempo. Non riscoprirle.

1. **Chromium rifiuta i media da `file://`** — `MEDIA_ELEMENT_ERROR: Media load
   rejected by URL safety check`. Clip e video vanno passati alla pagina come
   byte e ricomposti in un `Blob` (vedi `risorse.mjs`). Vale sia per le clip in
   ingresso sia per rileggere i video prodotti in `verifica.mjs`.
2. **Un'immagine caricata da `file://` contamina il canvas** e `captureStream()`
   smette di funzionare. Per questo il logo è incorporato come data URI in
   `pagina/risorse.js`.
3. **`[Oo]ut/` è nel `.gitignore` standard .NET** e si mangia qualsiasi cartella
   chiamata `out/`. È il motivo per cui i video stanno in `mp4/` e non in `out/`.
4. **Non mandare l'output di `registra.mjs` in `tail` o `head`**: bufferizza tutto
   e ti perdi avanzamento e statistiche finali, che sono l'unico modo di sapere
   quanti fotogrammi sono saltati.
5. **I messaggi CDP hanno un limite pratico**: video e clip viaggiano a pezzi da
   3-4 MB. Un base64 da dieci milioni di caratteri in un solo messaggio fa cadere
   la connessione, e succede a metà lavoro.
6. **`parseFloat('16x9')` vale `16`**: usare `Number` quando si separano i formati
   dagli istanti negli argomenti da riga di comando.
7. **`document.fonts.ready` non basta**: per il canvas vanno caricate
   esplicitamente le combinazioni famiglia/peso con `document.fonts.load()`,
   altrimenti il primo fotogramma esce col font di ripiego.
8. **I glifi delle icone** si leggono dal `content` dello pseudo-elemento di
   Bootstrap Icons, non scrivendo i codepoint a mano: così un aggiornamento della
   libreria non rompe le icone in silenzio.
9. **Edge tiene i file del profilo per qualche istante dopo il `kill()`**: la
   cancellazione va ritentata, altrimenti lo script muore con `EPERM` *dopo* aver
   salvato il video.
10. **Attenzione a cosa si legge nelle clip.** Nella ripresa `codice` scorrono log
    di sistema con la parola `ERROR` in rosso: su un video di un'azienda di
    sicurezza informatica non ci può stare. È stata alzata la velatura di quella
    scena (`velatura: 1.45` in `contenuti-breve.js`). Guarda sempre i provini a
    dimensione piena prima di registrare.
11. **I formati stanno in tre file**, non in uno: `registra.mjs`, `provini.mjs` e
    `pagina/index.html`. Aggiungerne uno solo in `registra.mjs` fa registrare a
    una risoluzione e impaginare a un'altra, e il difetto si vede solo nel video
    finito, cioè dopo aver speso una registrazione in tempo reale.
12. **"Il motore si adatta da solo alla dimensione" era vero a metà.** La scala
    tipografica sì, ma i margini erano in pixel fissi, quindi a 720p il testo
    sarebbe finito più stretto e più in alto invece che semplicemente più piccolo.
    Ora tutto passa per `S.r` in `misure()`. Se aggiungi una costante in pixel al
    layout, moltiplicala per `S.r`, non per `S.s`: `S.s` è la scala del testo e in
    verticale vale 1,08 apposta.
13. **`registra.mjs` finiva il lavoro e non usciva.** Salvava i video, stampava
    "Fatto." e restava lì a zero CPU: il WebSocket verso Edge e l'handle del
    processo tengono vivo il ciclo di eventi. Chi lanciava il comando lo vedeva
    "ancora in corso" per sempre. Risolto uscendo a mano in fondo allo script,
    come faceva già `verifica.mjs` — ma svuotando prima `stdout`, altrimenti si
    perdono proprio le ultime righe, quelle dei fotogrammi persi.
14. **Se interrompi una registrazione a mano, controlla che Edge sia morto.** Un
    Edge headless orfano continua a disegnare l'animazione a tutta velocità e
    falsa tutte le misure successive senza che si veda da nessuna parte:
    ```powershell
    Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" |
      Where-Object { $_.CommandLine -like '*tk-video*' }
    ```
    Il filtro su `tk-video` prende solo i nostri profili temporanei, non il
    browser dell'utente.

---

## 7. Modo di lavorare consigliato

Non registrare per vedere se un testo sta bene: **costa quanto dura il video**.
Usa i provini, che sono immediati:

```bash
node provini.mjs --montaggio breve             # un fermo immagine per scena
node provini.mjs --montaggio breve 9x16-720    # in verticale, come si consegna
node provini.mjs --montaggio breve 12 19.5     # istanti precisi
```

I formati sono `16x9`, `9x16`, `16x9-720` e `9x16-720`. Per il breve guarda i
`-720`: sono quelli che si consegnano.

I PNG finiscono in `provini/`. **Guardali davvero**, uno per uno, a dimensione
piena: i difetti di impaginazione che contano — un titolo su due righe che copre
la fila sotto, un logo che tocca il testo — si vedono solo così.

Per l'anteprima animata basta aprire `pagina/index.html` nel browser
(`?montaggio=breve`, `?formato=9x16`): parte da sola e c'è la barra per scorrere.
Le clip però non si vedono, perché arrivano da Node solo in registrazione.

---

## 8. Cose sensate da fare, non ancora fatte

**Da far decidere al cliente:**

- Far sentire la voce sintetica di Windows e decidere se tenerla o far leggere il
  copione a una persona. Il copione sta nei campi `voce` di `contenuti-breve.js`;
  `narrazione.mjs` dice anche se ogni battuta sta dentro la sua scena. Le due
  versioni con voce sono già registrate, si possono far sentire così come sono.

**Lavoro tecnico, quando serve:**

- Un formato 1:1 per i post quadrati. I formati stanno in `registra.mjs`,
  `provini.mjs` e `pagina/index.html` — tutti e tre (trappola 11). Il quadrato è
  l'unico caso che il motore non ha mai visto: decide fra orizzontale e verticale
  con `H > W`, e a 1080×1080 finirebbe nel ramo orizzontale. Da guardare con i
  provini prima di registrare.
- ~~Mettere il montaggio breve in autoplay sulla home.~~ **Fatto**, e in due
  posti diversi a seconda della larghezza:
  - **da desktop** (≥992px) sta **nell'hero, a destra**, al posto della foto di
    repertorio: arriva fino al bordo dello schermo ed è tagliato in diagonale
    (`.tk-hero-video`). Il taglio è al **7%** e non di più — il video ha un
    margine interno del 7,8% prima che cominci il testo, e una diagonale più
    profonda entra nelle lettere: si legge "OSA FACCIAMO" invece di "COSA
    FACCIAMO". Il blocco ha lo stesso rapporto del video (16:9), altrimenti
    `cover` taglierebbe via la fine delle scritte.
  - **da telefono** (≤991px) resta la sezione `.tk-video` sotto la barra dei
    numeri, e nell'hero torna la foto.

  Sono due tag `<video>` sullo stesso file, ma **ne parte sempre uno solo**: per
  questo sul tag non c'è l'attributo `autoplay` — li farebbe scaricare tutti e
  due — e a farli partire è `site.js`, che guarda la stessa soglia dei 992px.
  Il file è `wwwroot/video/tecnolink-presentazione-30s.mp4`, 3,3 MB, **senza
  traccia audio**, con `wwwroot/img/video-presentazione-poster.jpg` (39 KB) come
  anteprima.

  **`prefers-reduced-motion` non viene guardato, ed è voluto.** Prima sì, e il
  video restava fermo sul poster: su Windows quell'impostazione risulta attiva a
  molta gente che non l'ha mai toccata (basta avere spenti gli effetti di
  animazione), e il risultato era "a me il video non parte" senza che si capisse
  perché. Non ha audio e c'è il comando di pausa, quindi parte sempre.

  Due cose che si sono sistemate da sé male e sono state corrette a mano:
  - i riquadri "Backup Monitor" e "Check Sicurezza" stavano sopra all'immagine
    dell'hero; ora l'immagine è il video, e coprirlo non aveva senso. Sono
    scesi sotto al testo (`.tk-hero-badges`): nella fascia libera sotto al video
    non ci stavano senza accavallarsi ai numeri.
  - la colonna del testo è in **percentuale** e non in `fr`, perché il video
    parte dal bordo destro e con gli `fr` il titolo gli finiva sotto. Sotto ai
    ~600px di colonna i due pulsanti si impilano: per questo fra 992 e 1365px
    c'è uno scalino che restringe il video e allarga il testo.

  **Trappola, costata una segnalazione del cliente (corretta il 31/07/2026).**
  Tutte le regole qui sopra valgono **solo per l'hero della home**, che porta la
  classe `has-video` (`.tk-hero.has-video` in `site.css`). All'inizio non era
  così: stavano su `.tk-hero` e basta, e l'hero del sito non è uno solo. Sopra i
  992px nascondevano l'illustrazione a destra (`.frame { display: none }`) e
  rendevano statica la colonna su **ogni** pagina — comprese le cinque del
  check-up, che il video non ce l'hanno. Lì spariva il disegno a destra e i due
  riquadri, rimasti assoluti rispetto all'hero invece che alla colonna,
  cadevano in alto a sinistra: sopra al selettore Base/Intermedia/Tecnica.
  **Chi aggiunge regole per il video le metta sotto `.tk-hero.has-video`**, e
  prima di dire fatto guardi anche `/offerte/vulnerability-assessment` e le sue
  quattro sorelle, non solo la home.
- Valutare se pubblicare il video sulla pagina interna dei materiali campagne
  (`/interno/materiali-campagne`), dove stanno già i creativi statici.
- Se un domani il verticale scendesse sotto il tempo reale, la leva è 25 fps
  (punto 2).
