# Come continuare a lavorare sul video

Questo file è scritto per la prossima sessione di Claude Code che mette mano a
`docs/video/`. Leggilo prima di toccare qualsiasi cosa: contiene lo stato reale,
il problema ancora aperto e una decina di trappole che sono già costate tempo una
volta. Il `README.md` accanto spiega invece *cosa* fa il sistema.

---

## 1. Stato al 30 luglio 2026

Nella cartella convivono **due montaggi**, che condividono lo stesso motore.

| Montaggio | Durata | Contenuti | Audio | Clip | Stato |
|---|---|---|---|---|---|
| **lungo** | 1:29 | `pagina/contenuti.js` | no | no | ✅ finito, registrato e verificato |
| **breve** | 0:30 | `pagina/contenuti-breve.js` | musica (+ voce opzionale) | sì, 7 | ⚠️ **non ancora registrato bene** |

I file finiti stanno in `mp4/` e sono versionati:

- `tecnolink-presentazione-1920x1080.mp4` — 89 s, 9,8 MB
- `tecnolink-presentazione-1080x1920.mp4` — 89 s, 8,8 MB

Il montaggio breve **non ha un file consegnabile**. Vedi il punto 2.

---

## 2. Il problema aperto: il montaggio breve perde fotogrammi

L'ultima registrazione del 30 s in 1920×1080 ha disegnato **358 fotogrammi su
900**: 542 persi, il 60%. Il video risulta a scatti. Il file difettoso è in
`provini/30s-A-SCATTI-da-rifare.mp4` — tienilo come termine di paragone, non
consegnarlo.

**Perché succede.** `MediaRecorder` incide in tempo reale e marca i fotogrammi con
l'orologio di sistema: non si può registrare più lentamente e poi accelerare. Ogni
fotogramma del montaggio breve deve, entro 33 ms e **senza GPU**:

1. decodificare un fotogramma di una clip 720p,
2. ingrandirlo a 1080p con Ken Burns,
3. sovrapporre velatura, vignettatura e rete di particelle,
4. disegnare testo e riquadri,
5. e in più l'encoder H.264 software lavora sullo stesso processore.

Il montaggio lungo non ha questo problema (25 fotogrammi persi su 2670) proprio
perché non ha clip da decodificare.

**Due ottimizzazioni sono già state applicate** ma **non ancora misurate**, perché
la registrazione di verifica non è stata lanciata:

- i segmenti della rete di particelle sono raggruppati in pochi `Path2D` invece di
  oltre mille `stroke()` singoli;
- la velatura è disegnata una volta e poi ricopiata.

**Da fare, in ordine di efficacia:**

1. **Ri-registra e misura.** È il primo passo obbligatorio: senza il numero non si
   sa se le ottimizzazioni bastano.
   ```bash
   cd docs/video && node registra.mjs --montaggio breve 16x9
   ```
   Guarda la riga `N fotogrammi disegnati, M persi`. Sotto il 5% va bene.

2. **Se non basta, scendi a 1280×720.** È la strada che risolve davvero: le clip
   sono girate a 720p, quindi l'ingrandimento sparisce del tutto e il costo di
   codifica cala di più della metà. Per un video da feed social 720p è più che
   sufficiente. Si aggiunge un formato in `FORMATI` dentro `registra.mjs` e in
   `pagina/index.html` — il motore si adatta da solo alla dimensione.

3. **Se ancora non basta, 25 fps** invece di 30 (parametro `fps` in `tkRegistra`).
   Guadagno modesto, e in Italia 25 fps è comunque lo standard televisivo.

4. Ultima spiaggia: togliere la rete di particelle sopra le clip
   (`sfondoRete` in `disegna()` di `pagina/scena.js`, ramo `conClip`).

Non provare a rendere la registrazione più lenta del tempo reale: non è una
questione di parametri, è come funziona `MediaRecorder`. L'alternativa vera
sarebbe estrarre i fotogrammi uno a uno e assemblarli con ffmpeg, ma **ffmpeg non
è installato su questa macchina** e scaricarlo richiede il consenso esplicito
dell'utente.

Quando il 16:9 è a posto, registra anche il verticale e la versione con voce:

```bash
node registra.mjs --montaggio breve
node registra.mjs --montaggio breve --voce
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

**Due cose lasciate in sospeso con il cliente:**

1. Il montaggio lungo dice "Da vent'anni a Firenze". Sulla home c'è, ma dai
   materiali delle campagne era stato tolto perché nel settore tech quel claim
   interessa a pochi. Nel montaggio breve non compare. Va confermato.
2. Il sito mostra ovunque il telefono come `055 617008`, ma i link `tel:` puntano
   a `+390556617008` — un `6` in più. Uno dei due è sbagliato. Il video usa la
   forma mostrata sul sito. **Non è stato ancora verificato con il cliente.**

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

---

## 7. Modo di lavorare consigliato

Non registrare per vedere se un testo sta bene: **costa quanto dura il video**.
Usa i provini, che sono immediati:

```bash
node provini.mjs --montaggio breve          # un fermo immagine per scena
node provini.mjs --montaggio breve 9x16     # in verticale
node provini.mjs --montaggio breve 12 19.5  # istanti precisi
```

I PNG finiscono in `provini/`. **Guardali davvero**, uno per uno, a dimensione
piena: i difetti di impaginazione che contano — un titolo su due righe che copre
la fila sotto, un logo che tocca il testo — si vedono solo così.

Per l'anteprima animata basta aprire `pagina/index.html` nel browser
(`?montaggio=breve`, `?formato=9x16`): parte da sola e c'è la barra per scorrere.
Le clip però non si vedono, perché arrivano da Node solo in registrazione.

---

## 8. Cose sensate da fare, non ancora fatte

- Chiudere il problema dei fotogrammi persi (punto 2). **È la priorità.**
- Registrare le versioni mancanti del breve: verticale, e con voce.
- Far sentire al cliente la voce sintetica di Windows e decidere se tenerla o far
  leggere il copione a una persona. Il copione sta nei campi `voce` di
  `contenuti-breve.js`; `narrazione.mjs` dice anche se ogni battuta sta dentro la
  sua scena.
- Un formato 1:1 per i post quadrati: i formati stanno in cima a `registra.mjs` e
  in `pagina/index.html`, il motore si adatta da solo.
- Una versione 720p leggera da mettere in autoplay sulla home del sito.
- Valutare se pubblicare il video sulla pagina interna dei materiali campagne
  (`/interno/materiali-campagne`), dove stanno già i creativi statici.
