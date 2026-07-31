# Manifesti — una frase sola, grande quanto l'immagine

Otto creativi statici, quattro per pubblico: **una frase, nient'altro**. Nessun elenco,
nessun pulsante disegnato, nessuna illustrazione. Sono l'opposto del visual di
presentazione in [`../`](../), e servono a un momento diverso.

I PNG stanno in `tecnolinkSite/wwwroot/img/campagne/manifesti/`, nominati
`<pubblico>-<concetto>-<misura>.png`, e si guardano tutti insieme da
**`/interno/materiali-campagne`**.

## Perché così poche parole

Il visual di presentazione dice tutto il servizio in un'immagine sola: nome, promessa,
quattro passi, tre garanzie, pulsante, firma. Sono circa sessanta parole. È utile a chi
il servizio lo sta già valutando — ed è la ragione per cui resta — ma nel feed freddo
lavora contro di sé per due motivi indipendenti tra loro:

- **Le piattaforme distribuiscono peggio le immagini molto scritte.** La regola del 20%
  di Meta non esiste più come regola, ma il comportamento è rimasto: al crescere del
  testo l'annuncio costa di più e viene mostrato meno. La soglia pratica che circola
  oggi è **un terzo della superficie**.
- **Chi scorre non legge un paragrafo per decidere se fermarsi.** La raccomandazione
  ricorrente per i creativi statici è **5-10 parole sull'immagine**: il gancio, e basta.
  Tutto il resto va nel campo di testo dell'annuncio, che non pesa sulla distribuzione.

Da qui i manifesti: il gancio in dieci parole, il ragionamento nel copy. Vanno usati
sul traffico freddo; la presentazione resta per il retargeting, dove chi guarda ha già
sentito il nome e sta cercando di capire cosa comprende il servizio.

## Perché quattro concetti e non quattro palette dello stesso

Meta raggruppa gli annunci che si somigliano e li tratta di fatto come uno: dieci
varianti dello stesso impianto rendono quanto una. Quello che serve non è *quantità* ma
**varietà vera** — angoli diversi, superfici diverse, in modo che l'algoritmo abbia
davvero qualcosa da distinguere e il pubblico non veda la stessa immagine per settimane.

Per questo ogni concetto ha la sua superficie: in miniatura, dove si decide se fermarsi,
due creativi con lo stesso fondo si somigliano anche quando dicono cose diverse.

| Concetto | Superficie | La frase | Come apre |
|---|---|---|---|
| **aziende / domanda** | nero | *Sapete dire quali porte ha aperte la vostra rete?* | Una domanda a cui non si sa rispondere |
| **aziende / nis2** | bianco | *NIS2 non chiede se siete sicuri. Chiede se potete dimostrarlo.* | La distinzione che sposta il problema |
| **aziende / esito** | vivido | *Un elenco di cose da sistemare, in ordine di urgenza.* | Il risultato, senza nominare la minaccia |
| **aziende / questionario** | notte | *Il questionario del cliente arriva senza preavviso.* | La pressione che arriva da fuori |
| **privati / wifi** | nero | *Quante cose sono collegate al tuo Wi-Fi adesso?* | Una domanda a cui non si sa rispondere |
| **privati / router** | bianco | *Il router non si aggiorna da solo.* | Un fatto scomodo, detto piano |
| **privati / esito** | vivido | *Ti diciamo cosa sistemare e in che ordine.* | Il risultato, senza nominare la minaccia |
| **privati / telecamere** | notte | *Le telecamere si installano una volta e si dimenticano.* | L'abitudine che crea il problema |

### Il concetto «esito» è il termine di paragone

È l'unico dei quattro che non fa leva sulla paura, ed è lì apposta. Nel marketing della
sicurezza informatica il messaggio allarmistico si è consumato: chi compra sa già che le
minacce esistono, e quello che cerca è **cosa cambia per lui** — un elenco, un ordine di
priorità, qualcosa da poter spiegare in azienda. Il confronto tra «minaccia» ed «esito»
a parità di pubblico e di spesa è la cosa più utile che si può misurare con questi otto
file: dice in che tono conviene parlare a Firenze, non in generale.

## Le tre misure

| Misura | Dove |
|---|---|
| 1080×1350 (4:5) — `feed-verticale` | **La principale.** Feed Facebook, Instagram e LinkedIn |
| 1080×1920 (9:16) — `storia` | Storie e Reel. 250 px liberi in alto e 340 in basso, dove l'app mette i suoi elementi |
| 1080×1080 (1:1) — `quadrato` | Posizionamenti che non accettano il 4:5 |

## Come si usano

**Uno alla volta, con il suo copy.** Il manifesto è solo il gancio: il testo dell'annuncio
deve raccogliere la frase e portarla a conclusione. L'accostamento consigliato tra
manifesto e variante di copy sta in [`../../campagne-ads.md`](../../campagne-ads.md),
insieme agli `utm_content` da usare per distinguerli nei risultati.

**Non tutti e otto insieme.** Valgono le regole già scritte per gli altri formati: con un
budget contenuto due varianti per volta, stesso pubblico, stessa spesa, e chi vince si
sfida con la terza. La cosa da guardare resta il costo per lead, non il CTR.

## Modificare i testi

Tutto sta in `CONTENUTI`, in cima a `genera-manifesti.mjs`: per ogni concetto la
superficie e le righe della frase. **Le righe sono spezzate a mano**, una voce dell'array
per riga, perché si va a capo dove si respira parlando — e restano intere: se una riga non
ci sta in larghezza il titolo viene rimpicciolito, non mandato a capo da solo. Regola
pratica: massimo venti caratteri per riga, e mai più di dieci parole in tutto.

Le superfici stanno in `SUPERFICI`, le misure in `FORMATI`.

```bash
node genera-manifesti.mjs && ./render-manifesti.sh
```

Gli HTML intermedi finiscono in `html/`, i PNG direttamente in
`tecnolinkSite/wwwroot/img/campagne/manifesti/`. Serve Node e Microsoft Edge (il
rendering usa Edge in headless, così Poppins viene reso come sul sito; la prima
generazione richiede la connessione per scaricare il font).

## Quando avrete un numero vero

Il formato più forte in assoluto per questo tipo di annuncio è **una cifra sola, enorme**:
quanti dispositivi si trovano in media in una casa, quante vulnerabilità critiche nel
primo check-up di una PMI. Qui costa una riga: si aggiunge un concetto a `CONTENUTI` con
la cifra al posto della frase. **Non prima di avere il dato dai vostri check-up** — un
numero inventato su LinkedIn è il modo più rapido per farsi segnalare da un concorrente.

## Il ragionamento e le fonti

Le raccomandazioni citate qui sopra, con i link, stanno in
[`../revisione-2026.md`](../revisione-2026.md), insieme al resto della revisione dei
materiali.
