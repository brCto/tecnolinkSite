# Le fotografie, tagliate per i social

Le quattro fotografie di campagna (`wwwroot/img/campagne/foto/`) sono tutte **2000×1333,
cioè 3:2 orizzontale**. È il rapporto con cui escono dalle banche immagini ed è il
peggiore possibile per il feed: su mobile un'immagine orizzontale occupa meno della metà
dello schermo che occuperebbe un 4:5, e lo spazio sullo schermo è la prima variabile del
tasso di arresto dello scroll.

Questo script le rifà nelle tre misure che servono. Gli originali non si toccano: i
ritagli finiscono in `wwwroot/img/campagne/foto/ritagli/` e si guardano tutti insieme da
**`/interno/materiali-campagne`**.

```bash
powershell -ExecutionPolicy Bypass -File ritaglia-foto.ps1
```

**Serve:** solo Windows PowerShell 5.1, che c'è già. Nessuna dipendenza da installare —
il disegno lo fa `System.Drawing`, cioè GDI+, che è parte del sistema. È l'unico
generatore della cartella `creativi/` che non passa da Node ed Edge, ed è voluto: qui non
si compone una pagina HTML da fotografare, si ritaglia della fotografia, e per quello un
motore di rendering è lo strumento sbagliato.

## Le tre misure

| Misura | File | Dove si usa |
|---|---|---|
| 1080×1350 (4:5) | `-feed-verticale` | **La principale.** Feed Facebook e Instagram. |
| 1080×1080 (1:1) | `-quadrato` | Di riserva, per i posizionamenti che non accettano il 4:5. |
| 1080×1920 (9:16) | `-storia` | Storie e Reel. |

Il 4:5 e l'1:1 escono a risoluzione piena o quasi: il ritaglio usa tutta l'altezza
dell'originale e si perde solo sui lati.

## Il punto di fuoco

Ogni foto ha un `fuoco`: dove sta il soggetto in orizzontale, da 0 a 1. Serve perché
**in nessuna delle quattro il soggetto sta al centro geometrico**, e qualunque taglio
automatico — `center/cover` in CSS, il ritaglio di Ads Manager, l'anteprima di un CMS —
taglia lì.

| Foto | Fuoco | Perché |
|---|---|---|
| `privati-router` | 0.56 | Il router sta nella metà destra, in diagonale: centrato perde le antenne. |
| `privati-telecamera` | 0.50 | Già centrata. Il bianco intorno è lo spazio per il titolo, va tenuto. |
| `aziende-switch` | 0.45 | L'unica parte leggibile è la fila di porte numerate, a sinistra del centro. |
| `aziende-porte` | 0.38 | Le due placche e il bagliore rosso stanno nella metà sinistra. |

Se un giorno si sostituisce una fotografia, il numero da rivedere è questo — è l'unica
cosa nello script che dipende dall'immagine.

## Perché la storia non è un ritaglio

Un 9:16 ricavato a morsi da un 3:2 userebbe **il 37% dell'originale**, che poi andrebbe
ingrandito del 44% per arrivare a 1080×1920: molle, e con il soggetto tagliato ai lati.

Quindi la storia è composta: la foto resta intera a tutta larghezza (1080×720, tagliata
del minimo indispensabile), posata a 520 px dall'alto, e il resto dell'altezza lo riempie
una copia di sé stessa sfocata e scurita col blu notte del marchio. Il soggetto non si
tocca mai, la risoluzione resta nativa, e sopra e sotto restano due fasce piene su cui
scrivere. La posizione tiene conto delle zone che le app coprono — 250 px in alto per il
nome account, 340 px in basso per didascalia e pulsanti: sopra la foto restano 270 px
liberi, sotto 340.

La sfocatura è fatta rimpicciolendo a 22×39 px e riportando alla misura piena. Non è una
gaussiana vera, ma per uno sfondo che deve solo stare indietro è indistinguibile ed è
istantanea. Il francobollo non va ingrandito: già a 44 px il soggetto ridiventa
riconoscibile e la storia sembra avere due foto invece di una.

### Una trappola di GDI+

Il velo scuro sopra lo sfondo va steso con `CompositingQuality.Default`, non con
`HighQuality`. `HighQuality` fonde con la correzione gamma, e un velo nero all'85% steso
così perde metà della sua forza: sopra il bianco esce 110 invece di 47. Va benissimo per
ridimensionare, è sbagliato per coprire. Se un giorno lo sfondo delle storie torna chiaro
senza motivo apparente, è quella riga.

## Cosa manca

Il ritaglio risolve la misura, non il contenuto. Restano due cose vere:

- **I ritagli sono fotografia nuda, senza testo.** Vanno bene come sono per il feed, dove
  il copy sta accanto all'immagine; per le storie il titolo va aggiunto — è lo spazio che
  le fasce scure lasciano apposta.
- **Manca una foto con una persona.** Sul pubblico privati la faccia di un tecnico vero
  batte quasi sempre l'oggetto. Serve la liberatoria di chi compare: la licenza Pexels
  copre il fotografo, non il consenso del soggetto. È già segnata come proposta in
  [`../revisione-2026.md`](../revisione-2026.md).
