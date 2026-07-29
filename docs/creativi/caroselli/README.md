# Caroselli — due sequenze da quattro carte, in due varianti grafiche

Un carosello per pubblico, differenziato nel contenuto e nel tono, identico
nell'impianto. Quattro carte ciascuno, in quest'ordine:

| | Facebook / Instagram — privati | LinkedIn — aziende |
|---|---|---|
| **01** ⬛ | *Ogni cosa che colleghi al Wi-Fi è una porta su casa tua.* La minaccia, detta in modo che riguardi chiunque abbia un router. | *La domanda non arriva più dagli hacker. Arriva dal vostro cliente più grande.* Non paura: una scadenza. |
| **02** ⬜ | *Non cercano i tuoi segreti. Cercano i tuoi accessi.* Cosa c'è in gioco, in quattro voci. | *Quattro strade diverse, la stessa domanda.* NIS2, GDPR art. 32, polizze, questionari fornitori. |
| **03** ⬜ | *Si scopre in poche ore. E quasi sempre si sistema con poco.* La via d'uscita. | *Vulnerability Assessment: dall'inventario al piano di intervento.* Cosa fa il servizio, in concreto. |
| **04** ⬛ | *Scopri quali porte sono aperte.* + CTA | *Sapete dire dove siete esposti?* + CTA |

## Le quattro varianti

Ogni sequenza esiste in quattro versioni con **le stesse identiche parole**. Cambia solo
quanto spazio prende la fotografia, in ordine crescente di invadenza:

| | Com'è | Quando conviene |
|---|---|---|
| **`bn`** | Carte piene, nessuna foto | In un feed saturo di colore si stacca per contrasto invece che per saturazione, si decodifica più in fretta e regge la miniatura |
| **`foto`** | Foto a tutto fondo, velo scuro sopra | Massimo impatto, ma il testo deve difendersi da qualunque cosa ci sia sotto: una foto molto dettagliata lo indebolisce |
| **`fascia`** | Foto a filo nella parte alta, testo sotto su nero | Nessuna sovrapposizione: la foto attira e il testo si legge come su carta. È il compromesso più sicuro |
| **`riquadro`** | Foto in un riquadro con aria intorno, su nero | La più composta. Sembra una pagina e non un annuncio, e per questo scavalca l'abitudine a saltare le pubblicità |

Le due carte centrali sono **identiche in tutte e quattro**, ed è voluto: la differenza
da misurare sta nella prima carta, che da sola predice la resa del carosello. Cambia solo
la superficie, mai il testo — così se una variante vince si sa esattamente cosa ha vinto.

> **Non provarle tutte e quattro insieme.** Con un budget contenuto nessuna raccoglierebbe
> abbastanza dati per dire qualcosa. Se ne scelgono due, si confrontano a parità di
> pubblico e di spesa, e la vincente si sfida con una terza.

I PNG stanno dentro il sito, in
`tecnolinkSite/wwwroot/img/campagne/caroselli/<pubblico>-<variante>-<formato>-<n>.png`
— `facebook` / `linkedin`, `bn` / `foto` / `fascia` / `riquadro`, `quadrato` 1080×1080 e
`storia` 1080×1920. Si
guardano tutti insieme da **`/interno/materiali-campagne`**, la pagina interna che
indicizza i materiali delle campagne (non indicizzata dai motori, raggiungibile dal menu).

## Le fotografie

Quattro scatti da [Pexels](https://www.pexels.com), in
`tecnolinkSite/wwwroot/img/campagne/foto/`. Licenza gratuita, uso commerciale
consentito, nessuna attribuzione obbligatoria.

| File | Origine | Dove |
|---|---|---|
| `privati-router.jpg` | [Router Wi-Fi 6 su pavimento in legno](https://www.pexels.com/photo/modern-wifi-6-router-on-wooden-desk-32698507/) | Facebook, carta 01 |
| `privati-telecamera.jpg` | [Telecamera smart da interno](https://www.pexels.com/photo/smart-home-security-camera-24347621/) | Facebook, carta 04 |
| `aziende-switch.jpg` | [Switch di rete con cavi collegati](https://www.pexels.com/photo/ethernet-cables-plugged-in-network-switch-2881224/) | LinkedIn, carta 01 |
| `aziende-porte.jpg` | [Prese ethernet a muro](https://www.pexels.com/photo/close-up-of-plugged-in-ethernet-ports-with-led-37717004/) | LinkedIn, carta 04 |

**Criteri di scelta, se un giorno vanno sostituite.** Niente volti riconoscibili: le
licenze Pexels e Unsplash coprono il diritto d'autore del fotografo, **non** il consenso
della persona ritratta, e in Italia usare l'immagine di qualcuno a fini pubblicitari
senza liberatoria è vietato (art. 96 L. 633/1941). Niente marchi in vista sui dispositivi
— è un problema di marchio e le piattaforme a volte lo contestano. E niente corridoi di
data center: è l'immagine più abusata del settore e comunica la scala sbagliata a
un'azienda di venti persone.

## Perché è fatto così

**La prima carta fa quasi tutto il lavoro.** Il tasso di swipe sulla carta 1 predice
la resa dell'intero carosello: se nessuno scorre, le altre tre non esistono. Per
questo è nera, con una frase sola e nient'altro a contendersi l'attenzione — nessuna
illustrazione, nessun elenco, nessun logo in evidenza.

**La minaccia da sola non converte: serve la via d'uscita.** È il punto più importante
di tutta la sequenza. La ricerca sui messaggi che fanno leva sulla paura (modello EPPM)
è concorde: una minaccia senza una soluzione praticabile produce *evitamento*, non
azione — chi si spaventa e non vede cosa può farci scorre oltre e basta. Per questo la
carta 03 è sempre "si sistema, ed ecco come": è quella che trasforma lo spavento della
prima in un clic. Se un giorno si taglia il carosello per fare spazio, **la 03 non si
tocca**.

**Bianco e nero, non per gusto.** In un feed saturo di colore un annuncio monocromatico
si stacca per contrasto invece che per saturazione, si decodifica più in fretta e regge
la miniatura. È anche l'unica palette che non litiga mai con l'interfaccia della
piattaforma. L'alternanza nero–bianco–bianco–nero dà il ritmo: le due carte nere aprono
e chiudono, si capisce a colpo d'occhio a che punto si è.

**1080×1080 e non 4:5.** Il quadrato è la misura del carosello sia su Meta sia su
LinkedIn, e Meta lo ha riportato al centro delle specifiche anche per le sovrapposizioni
nei Reels e per Marketplace. Il 4:5 resta migliore per l'immagine singola nel feed (è il
formato dei creativi in [`../`](../)), non per il carosello.

**Testo grande, leggibile senza audio e in miniatura.** Ogni carta si legge da ferma, in
mezzo secondo, senza sonoro. Non c'è nessuna informazione affidata solo alla grafica.

## I testi del post

### Facebook / Instagram — privati

Le prime ~125 battute sono le uniche garantite prima del "Altro".

> **In casa tua ci sono più di dieci dispositivi collegati a internet. Sai dire quanti sono protetti davvero?**
>
> Router, smart TV, telecamere, campanelli, prese intelligenti, telefoni: ognuno è una porta. Ne basta una lasciata aperta perché qualcuno arrivi a tutto il resto — e di solito non te ne accorgi, perché chi entra ha tutto l'interesse a non farsi notare.
>
> Non cercano i tuoi segreti: cercano i tuoi accessi. Email, home banking, foto, la tua rubrica per scrivere ai tuoi amici a nome tuo.
>
> La buona notizia è che si scopre in poche ore e quasi sempre si sistema con interventi semplici. Guardiamo la tua rete come farebbe un malintenzionato — per proteggerti — e ti diciamo in parole semplici cosa conviene fare.
>
> 📍 Firenze e dintorni · 🔒 I tuoi dati restano tuoi · Preventivo prima di iniziare

**Titolo (max ~40 car.):** `Quante porte hai lasciate aperte?`
**Descrizione:** `Check-up della rete di casa · Tecnolink Firenze`
**CTA:** Scopri di più

### LinkedIn — aziende

Le prime ~150 battute sono le uniche visibili prima del "…altro".

> **La domanda sulla sicurezza informatica non arriva più dagli hacker: arriva dal vostro cliente più grande, dall'assicurazione o dalla normativa.**
>
> Con il recepimento della NIS2 (D.lgs. 138/2024) gli obblighi di gestione del rischio si sono estesi a molti più settori — e toccano anche i fornitori delle aziende già obbligate. Nel frattempo i committenti strutturati girano ai fornitori i questionari di sicurezza che sono tenuti a fare, e le polizze cyber chiedono evidenza di controlli periodici.
>
> Il punto non è rispondere bene. È sapere di poter rispondere.
>
> Il check-up di sicurezza informatica — il Vulnerability Assessment — mappa ogni dispositivo collegato alla vostra rete, cerca le vulnerabilità note, ne misura la gravità con lo standard CVSS e vi consegna un piano in ordine di priorità. Senza fermare il lavoro, con i dati che restano in azienda.
>
> Ne parliamo senza impegno. Tecnolink, Firenze.

**Titolo:** `NIS2, polizze, questionari dei clienti: sapete rispondere?`
**Descrizione:** `Check-up di sicurezza informatica — Tecnolink, Firenze`
**CTA:** Scopri di più

### URL con UTM

```
https://www.tecnolink.it/offerte/vulnerability-assessment/privati?utm_source=facebook&utm_medium=paid_social&utm_campaign=va-casa-2026&utm_content=carosello-bn
```

```
https://www.tecnolink.it/offerte/vulnerability-assessment/aziende?utm_source=linkedin&utm_medium=paid_social&utm_campaign=va-pmi-2026&utm_content=carosello-bn
```

## Come pubblicarlo

**Carosello sponsorizzato** — le quattro carte `quadrato` di **una** variante, in ordine,
stesso link su ogni scheda. Su LinkedIn il carosello dà il meglio con 3-5 carte: quattro
è dentro. Per confrontare due varianti, due annunci nello stesso gruppo, stesso pubblico
e stesso budget: cambia solo la creatività.

**Storie e Reel** — le carte `storia`, una per schermata. Per un Reel: 2 s alla prima,
2,5 s alle due centrali, 3 s alla CTA (~10 secondi). Il primo fotogramma deve essere la
carta 01, non il logo.

**Da non fare:** usare la carta 01 come annuncio a immagine singola. Da sola è una
minaccia senza soluzione — esattamente la configurazione che la ricerca indica come
controproducente. Se serve un'immagine singola, si usa la 03 o la 04.

## Cosa guardare

Vale la regola delle altre campagne: **costo per lead, non CTR**. In più, questo formato
rende disponibile un dato che l'immagine singola non ha: **quante carte vengono viste**.
Se quasi nessuno arriva alla 03, il problema è la prima carta o la seconda, non l'offerta.

Benchmark utile su LinkedIn: un CTR dello 0,5-0,8% su Sponsored Content è nella norma,
sopra l'1% è ottimo. Su Meta il numero da confrontare resta il costo per lead.

## Modificare i testi

Tutto sta in `CONTENUTI`, in cima a `genera-caroselli.mjs`: una voce per pubblico, con
le quattro carte in ordine. Ogni carta ha `fondo` (`nero` o `bianco`), `occhiello`,
`titolo` e, a scelta, `testo`, `elenco`, `cta`, `piede` e `foto` (il nome del file in
`wwwroot/img/campagne/foto/`, usato dalle varianti che mostrano una fotografia). Le misure
stanno in `FORMATI` — lì `fascia` e `riquadro` sono i due numeri più delicati del file:
alzarli comprime il testo sotto fino a far toccare il titolo e il piede. Le due superfici
sono in `NERO` e `BIANCO`, il velo scuro sulle foto in `VELO`, l'elenco delle varianti in
`VARIANTI`.

```bash
node genera-caroselli.mjs && ./render-caroselli.sh
```

Gli HTML intermedi finiscono in `html/`, i PNG direttamente in
`tecnolinkSite/wwwroot/img/campagne/caroselli/`. Serve Node e Microsoft Edge
(il rendering usa Edge in headless, così Poppins e Inter vengono resi come sul sito; la
prima generazione richiede la connessione per scaricare i font).

## Nota sulle policy Meta

Nessuna carta afferma qualcosa sulla situazione personale di chi legge. *"Ogni cosa che
colleghi al Wi-Fi è una porta su casa tua"* è un fatto generale; *"la tua telecamera è
esposta"* sarebbe un'affermazione sul destinatario, e viene rifiutata. È la stessa linea
seguita in [`../../campagne-ads.md`](../../campagne-ads.md), e vale anche quando si
riscrivono i testi: la minaccia si può descrivere, non attribuire.

## Fonti

- [Meta Ads Creative Best Practices: 2026 Field Guide — adlibrary.com](https://adlibrary.com/posts/meta-ads-creative-best-practices)
- [Facebook Carousel Ads: 2026 Setup, Specs, and Tactics — ecomparkour.com](https://ecomparkour.com/blog/facebook-carousel-ads-guide)
- [Facebook Ad Creative Trends 2026: Formats, Hooks & CTAs — adligator.com](https://adligator.com/blog/facebook-ad-creative-trends-2026)
- [LinkedIn Sponsored Content: Types & Best Practices 2026 — benly.ai](https://benly.ai/learn/linkedin-ads/linkedin-sponsored-content)
- [LinkedIn Ads Playbook 2026: B2B Lead Generation Tactics — uncommonlogic.com](https://blog.uncommonlogic.com/linkedin-ads-playbook-b2b-2026)
- [How fear-appeal advertising works — University of Melbourne](https://pursuit.unimelb.edu.au/articles/how-fear-appeal-advertising-works)
- [Using Fear Appeals in Advertising — marketingstudyguide.com](https://www.marketingstudyguide.com/fear-appeals-advertising/)
- [The Impact of Black and White Advertising](https://www.black-advertising-agency.com/what-does-black-and-white-mean-in-advertising)
