# Creativi — presentazione del servizio

> Questo è il visual di presentazione per l'**immagine singola**, uno solo, da affiancare
> a tutte le varianti di copy. I **caroselli**, differenziati per pubblico e in quattro
> varianti grafiche, sono un formato a sé e stanno in [`caroselli/`](caroselli/).

Un solo visual, generale sul servizio, pensato per essere letto in verticale dal
telefono. Lo stesso impianto in **due pubblici**, **due palette** e **tre misure**.

I PNG stanno dentro il sito, in
`tecnolinkSite/wwwroot/img/campagne/singola/<pubblico>-<palette>-<misura>.png`, e si
guardano tutti insieme da **`/interno/materiali-campagne`** — la pagina interna che
indicizza i materiali delle campagne.

### I due pubblici

| Pubblico | Nome del servizio sull'immagine | Campagne |
|---|---|---|
| **aziende** | Check-up di sicurezza informatica | LinkedIn |
| **privati** | Check-up della rete di casa | Facebook e Instagram |

Cambiano anche gli esempi di dispositivi e la CTA, perché devono corrispondere alla
landing su cui atterra il clic: se l'annuncio promette una cosa e la pagina ne dice
un'altra, il lead si perde proprio lì in mezzo.

Sulla pagina aziende il termine tecnico *Vulnerability Assessment* resta — serve per
gare, questionari dei clienti e ricerche su Google — ma nel corpo del testo, non nel
nome. Sulla pagina privati non compare da nessuna parte.

La landing aziende promette ora un ricontatto "entro 24 ore lavorative" nel passo
"Cosa succede dopo che compili il modulo". Se in futuro si vuole testare questo impegno
anche nel creativo o nella CTA, o nelle varianti di copy in `docs/campagne-ads.md`, va
tenuto allineato a quanto scritto sulla landing — vale lo stesso principio di coerenza
annuncio/pagina descritto sopra.

### Le due palette

| Palette | Com'è | Quando conviene |
|---|---|---|
| **chiaro** | Fondo bianco, testo blu notte, logo nero, CTA scura | Il più leggibile dei due. In un feed fatto quasi tutto di immagini scure, un annuncio bianco si stacca parecchio. |
| **vivido** | Fondo con il gradiente del marchio (cyan → viola), testo bianco, CTA bianca | Più riconoscibile come Tecnolink e più "acceso". Regge bene su Instagram, dove le immagini sature funzionano. |

Sono due direzioni diverse, non una migliore dell'altra: la cosa sensata è farle girare
entrambe sullo stesso pubblico e tenere quella che porta i lead a meno.

### Le tre misure

| Misura | Dove si usa |
|---|---|
| 1080×1350 (4:5) — `feed-verticale` | **La principale.** Feed Facebook e Instagram: è il formato che occupa più schermo su mobile. Va bene anche su LinkedIn. |
| 1080×1920 (9:16) — `storia` | Storie e Reel. Contenuti già dentro l'area sicura: 250 px liberi in alto e 340 px in basso, dove l'app sovrappone nome account, didascalia e pulsanti. |
| 1080×1080 (1:1) — `quadrato` | Di riserva, per i posizionamenti che non accettano il 4:5. |

Il visual è **lo stesso per tutte le varianti di testo** delle campagne: si tiene fisso
l'annuncio grafico e si mette alla prova il copy. Se poi si vuole testare anche la
grafica, si cambia una cosa alla volta — altrimenti non si capisce cosa ha funzionato.

## Modificare i testi

Tutto il contenuto sta in `CONTENUTI`, in cima a `genera.mjs`, una voce per pubblico:
nome del servizio, titolo, introduzione, i quattro passi, le garanzie, la CTA e la riga
finale. Il layout si adatta da solo alle tre misure, e se un testo diventa più lungo il
blocco viene rimpicciolito quel tanto che basta invece di essere tagliato.

I colori stanno in `TEMI`, subito sotto: per ritoccare una palette o aggiungerne una
terza si lavora solo lì. Nota che il logo del sito è bianco su trasparente, quindi sulla
palette chiara viene portato a nero con `filter: brightness(0)`.

```bash
node genera.mjs && ./render.sh
```

Gli HTML intermedi finiscono in `html/`, i PNG direttamente in
`tecnolinkSite/wwwroot/img/campagne/singola/`. Per vedere l'anteprima senza rigenerare i
PNG basta aprire un file di `html/` nel browser.

**Serve:** Node e Microsoft Edge (già presenti su Windows). Il rendering usa Edge in
headless, così i font Poppins e Inter vengono resi come sul sito. Poppins e Inter sono
caricati da Google Fonts: la prima generazione richiede la connessione.

## Nota sulle immagini

Sono creativi **grafici**, costruiti con la stessa identità visiva del sito (stessi
colori, stesso radar con lo scudo, stesso logo). Non sono fotografie: per quelle serve
materiale proprio oppure stock con licenza commerciale.

Se in futuro volete provare la fotografia — un ufficio vero, un router di casa, un
salotto la sera — è un test che vale la pena fare: sul pubblico Facebook lo scatto
realistico spesso batte la grafica, mentre su LinkedIn la grafica sobria regge bene.
