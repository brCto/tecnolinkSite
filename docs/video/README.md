# Video di presentazione dell'azienda

Video generati interamente da codice: nessun montaggio, nessun file di progetto da
aprire. I contenuti stanno in un file di testo e il video si rigenera con un
comando.

> Se sei una sessione di Claude Code che riprende questo lavoro, leggi prima
> **[CONTINUARE.md](CONTINUARE.md)**: stato reale, problema aperto e trappole già
> scoperte.

Ci sono **due montaggi**, con lo stesso impianto grafico ma due usi diversi.

| Montaggio | Durata | Com'è | Dove si usa |
|---|---|---|---|
| **lungo** | 1:29 | Grafica animata, niente clip né audio | Home del sito, presentazioni, schermo in sede |
| **breve** | 0:30 | Clip di repertorio, musica, ritmo veloce | Campagne, LinkedIn, reel e storie |

## I file finiti

In `mp4/`, H.264 in contenitore MP4 a 30 fotogrammi al secondo:

| File | Misura | Note |
|---|---|---|
| `tecnolink-presentazione-1920x1080.mp4` | 1920×1080 | Montaggio lungo, 9,8 MB |
| `tecnolink-presentazione-1080x1920.mp4` | 1080×1920 | Montaggio lungo, 8,8 MB |
| `tecnolink-presentazione-30s-1280x720.mp4` | 1280×720 | Montaggio breve, musica |
| `tecnolink-presentazione-30s-720x1280.mp4` | 720×1280 | Montaggio breve, musica |
| `tecnolink-presentazione-30s-voce-1280x720.mp4` | 1280×720 | Come sopra, con voce narrante |
| `tecnolink-presentazione-30s-voce-720x1280.mp4` | 720×1280 | Come sopra, con voce narrante |
| `tecnolink-presentazione-30s-muto-1280x720.mp4` | 1280×720 | **Senza traccia audio**, 2,5 Mbps — è la copia che va sul sito |

Quest'ultimo è quello che gira sulla home, copiato in
`tecnolinkSite/wwwroot/video/tecnolink-presentazione-30s.mp4`. Non ha proprio la
traccia audio: `muted` nell'HTML basterebbe a non far uscire suono, ma la traccia
si scaricherebbe lo stesso e un domani basterebbe un `muted` tolto per
distrazione perché la home si mettesse a suonare addosso a chi legge. Per
rifarlo, e rifare anche il fotogramma di anteprima:

```bash
node registra.mjs --montaggio breve --muto --bitrate 2.5 16x9-720
cp mp4/tecnolink-presentazione-30s-muto-1280x720.mp4 \
   ../../tecnolinkSite/wwwroot/video/tecnolink-presentazione-30s.mp4
node poster.mjs
```

Il montaggio breve esce a **720p, ed è la risoluzione giusta, non un ripiego**: le
clip di repertorio sono girate a 720p, quindi a 1280×720 non c'è nessun
ingrandimento da fare e la codifica costa meno della metà. È anche ciò che tiene
la registrazione dentro il tempo reale — a 1080p perdeva fotogrammi, la storia sta
in [CONTINUARE.md](CONTINUARE.md#2-i-fotogrammi-persi-del-montaggio-breve-risolto).
Il lungo resta a 1080p perché non ha clip da decodificare.

Il montaggio lungo **non ha audio**, ed è una scelta: nei feed parte in muto e
tutto il messaggio è già scritto a schermo. Il breve invece ha una colonna sonora
sintetizzata, e può avere anche una voce narrante.

---

## Il montaggio lungo — 1:29

| # | Scena | Durata | Cosa dice |
|---|---|---|---|
| 1 | Apertura | 5,0 s | Logo, "sistemi informatici e cybersecurity", Firenze |
| 2 | Il punto di partenza | 8,0 s | Il lavoro passa dai sistemi informatici — la rete, un nodo che si ferma |
| 3 | Chi siamo | 8,0 s | Sicurezza informatica a Firenze, i due numeri della home |
| 4 | Cosa facciamo | 14,0 s | Le quattro aree di servizio |
| 5 | Ogni giorno | 8,0 s | Backup Monitor, Check Sicurezza, Verifica Hardware |
| 6 | tecnoSHIELD | 11,5 s | Il servizio esclusivo e i suoi quattro vantaggi |
| 7 | Check-up di sicurezza | 9,5 s | I quattro passi del controllo, senza impegno |
| 8 | Con chi lavoriamo | 8,0 s | I dodici settori delle pagine `Soluzioni/` |
| 9 | Perché Tecnolink | 7,5 s | La citazione su privacy e sicurezza, affidabilità e innovazione |
| 10 | Chiusura | 9,5 s | "Parliamo del tuo progetto" e i contatti |

Testi in `pagina/contenuti.js`.

```bash
cd docs/video && node registra.mjs
```

## Il montaggio breve — 0:30

Sei scene sopra altrettante clip di repertorio, con una base musicale.

| # | s | Scena | Clip |
|---|---|---|---|
| 1 | 0–4 | Logo e posizionamento | ufficio al lavoro |
| 2 | 4–8 | "Se si fermano i sistemi, si ferma il lavoro" | schermo riflesso negli occhiali |
| 3 | 8–14 | Le quattro aree | circuito stampato |
| 4 | 14–20 | tecnoSHIELD | codice che scorre |
| 5 | 20–24 | Check-up di sicurezza | riunione con il cliente |
| 6 | 24–30 | "Parliamo del tuo progetto" | open space |

Le durate sono **multipli di 2 secondi**, cioè una battuta a 120 bpm: è per
questo che ogni stacco cade sul tempo della musica invece che a caso. Se cambi la
durata di una scena, tienila multipla di 2.

Testi in `pagina/contenuti-breve.js`.

```bash
cd docs/video && node clip/scarica.mjs     # una volta: prende le clip
node registra.mjs --montaggio breve         # con la sola musica
node registra.mjs --montaggio breve --voce  # con anche il narratore
```

### Le clip

Sette riprese di **Mixkit** sotto **Free License**: uso commerciale e social
aziendali permessi, nessuna attribuzione richiesta. Non sono versionate — sono di
Mixkit, e la licenza ci lascia usarle nei nostri video, non ridistribuirle.

Mixkit ha però anche una *Restricted License*, che vieta esplicitamente proprio
l'uso commerciale, e dall'URL del file non si distingue. Per questo
`clip/scarica.mjs` **rilegge la licenza dalla pagina prima di ogni scaricamento**
e si ferma se non è quella libera. Per sostituire una ripresa si cambiano `id` e
`slug` in `clip/elenco.mjs` e si rilancia lo script.

```bash
node clip/scarica.mjs --ricontrolla   # riverifica le licenze senza scaricare
```

### La musica

Sintetizzata nota per nota con la Web Audio API (`pagina/musica.js`), non
scaricata: basso che pulsa, tappeto di accordi, arpeggio che cresce verso la
chiamata all'azione, un fruscio su ogni stacco. Così non ci sono licenze musicali
da verificare, e se cambia la durata di una scena la colonna si riadatta da sola.

### La voce narrante

Generata con la sintesi vocale di Windows (`System.Speech`, voce *Microsoft Elsa*
in italiano), una traccia per scena:

```bash
node narrazione.mjs
```

Lo script dice anche se ogni battuta sta dentro la sua scena, e avvisa quando è
troppo lunga. È una voce SAPI5: si capisce benissimo ma si sente che è sintetica —
va ascoltata e decisa. Il testo sta nei campi `voce` di `contenuti-breve.js` ed è
comunque il copione pronto, se si preferisce far leggere le battute a una persona.

---

## Modificare i testi

Tutto il contenuto sta in `pagina/contenuti.js` (lungo) e
`pagina/contenuti-breve.js` (breve), una voce per scena. Si cambia la frase, si
rigenera, fine. `secondi` è la durata della singola scena e non l'istante di
inizio: se se ne allunga una, le altre slittano da sole.

Per vedere il risultato **senza rigenerare niente** apri `pagina/index.html` nel
browser: il video parte da solo e c'è una barra per scorrere avanti e indietro.
`?montaggio=breve` e `?formato=9x16` scelgono versione e formato. Le clip non si
vedono in anteprima, perché arrivano da Node solo in registrazione.

## Controllare senza registrare

```bash
node provini.mjs --montaggio breve
```

Estrae un fermo immagine per scena in `provini/`, in un attimo: è il modo giusto
per controllare l'impaginazione mentre si lavora ai testi, invece di registrare
mezzo minuto per vedere una riga andata a capo male. Accetta anche istanti
precisi: `node provini.mjs --montaggio breve 12 19.5`.

```bash
node verifica.mjs
```

Riapre i video prodotti in un lettore vero, ne legge durata e risoluzione ed
estrae tre fotogrammi in `verifica/`. Serve perché un MP4 troncato pesa comunque:
qui il file viene decodificato davvero.

## Rigenerare: cosa aspettarsi

La registrazione è **in tempo reale** — il video viene inciso mentre viene
disegnato — quindi ogni formato costa quanto dura il video, più il trasferimento.
Non mandare l'output in `tail` o simili: nasconde l'avanzamento e le statistiche
finali.

A fine registrazione lo script dice quanti fotogrammi ha disegnato e quanti ne ha
persi. Qualche fotogramma perso è fisiologico; oltre il 5% avvisa da solo, e vuol
dire che la macchina non ce la faceva a stare dietro al tempo reale.

**Quel numero misura tanto la macchina quanto la scena.** La stessa
configurazione, nella stessa ora, ha dato 26 fotogrammi persi e 199: in mezzo non
era cambiato il codice, era cambiato il carico. Le due cause viste dal vivo sono
una copia di `pagina/index.html` lasciata aperta in un browser (parte da sola e
disegna di continuo) e il processore che scalda dopo qualche registrazione di
fila. Quindi: registra a macchina scarica, un formato alla volta, e se il numero
non ti piace rilancia e tieni il migliore. Per capire se una modifica ha
peggiorato le cose, confronta due configurazioni **di fila** — una misura sola non
dice niente. Il dettaglio è in
[CONTINUARE.md](CONTINUARE.md#il-numero-dei-fotogrammi-persi-dipende-dalla-macchina-non-solo-dalla-scena).

---

## Com'è fatto

Un `<canvas>` disegnato fotogramma per fotogramma e inciso con `MediaRecorder`
dentro Edge in headless, pilotato via DevTools Protocol. Nessuna dipendenza npm:
il progetto non ha un `package.json` e bastano il `WebSocket` di Node 22+ e il
browser già installato. Stessa impostazione dei creativi statici in
`docs/creativi/`.

| File | Cosa fa |
|---|---|
| `pagina/contenuti.js` · `contenuti-breve.js` | I testi e le scalette. **Sono i file da toccare.** |
| `pagina/scena.js` | Il motore: sfondo, clip, tipografia, tutte le scene |
| `pagina/musica.js` | La colonna sonora |
| `pagina/risorse.js` | Il logo incorporato come data URI (generato) |
| `pagina/index.html` | La pagina: anteprima a mano e registrazione |
| `registra.mjs` · `provini.mjs` · `verifica.mjs` | I tre comandi |
| `poster.mjs` | Il fotogramma di anteprima del video sulla home, in JPEG |
| `narrazione.mjs` · `narrazione.ps1` | La voce narrante |
| `clip/elenco.mjs` · `clip/scarica.mjs` | Le clip e la verifica della licenza |
| `risorse.mjs` · `cdp.mjs` | Passaggio dei binari e client DevTools Protocol |

Tre dettagli che sembrano capricci e non lo sono:

- **`TK.disegna(t)` dipende solo dal tempo.** Nessuno stato che si accumula fra un
  fotogramma e l'altro: due registrazioni della stessa scaletta vengono identiche,
  e un fotogramma lento non sposta quelli dopo.
- **Clip e logo non si caricano da `file://`.** Chromium rifiuta i media da
  `file://` e un'immagine così contaminerebbe il canvas, impedendo di registrarlo.
  Il logo è un data URI, le clip arrivano da Node come byte e diventano `Blob`.
- **I binari viaggiano a pezzi da 3-4 MB.** Un base64 da dieci milioni di
  caratteri in un solo messaggio del DevTools Protocol fa cadere la connessione.

I colori, i font e lo sfondo a rete di particelle sono quelli del sito
(`wwwroot/css/site.css` e l'hero di `wwwroot/js/site.js`): il video e la home si
somigliano perché guardano lo stesso design system, non perché sono stati
accostati a occhio.

## Se serve un altro formato

I formati stanno in cima a `registra.mjs`, in `provini.mjs` e in
`pagina/index.html` — vanno aggiunti in tutti e tre. Il motore si adatta da solo:
cambia scala tipografica, margini e disposizione a seconda che il fotogramma sia
orizzontale o verticale. Un 1:1 per i post quadrati si aggiunge con poche righe.

I margini sono in pixel, ma vengono moltiplicati per `S.r`, cioè quanto la
risoluzione è più piccola di quella di riferimento del suo formato (1920×1080 e
1080×1920). Senza quel fattore un 720p non sarebbe la stessa impaginazione
rimpicciolita ma un'altra impaginazione, col testo più stretto e più schiacciato
in alto. Alle risoluzioni di riferimento `S.r` vale 1.

In verticale, a 1080×1920, il contenuto sta fra 210 px dal bordo alto e 270 px da
quello basso, per non finire sotto ai comandi che l'app sovrappone nelle storie.

I tratti sottili — i bordi dei riquadri di vetro, la rete di particelle — restano
invece a 1 e 1,5 px a ogni risoluzione: sono capelli, e rimpicciolirli li farebbe
sparire.
