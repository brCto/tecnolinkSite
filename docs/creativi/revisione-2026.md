# Revisione dei materiali social — luglio 2026

Rilettura di tutto quello che è stato prodotto per le campagne del check-up di sicurezza
(creativi a immagine singola, caroselli, testi degli annunci) alla luce di quello che
oggi viene indicato come funzionante su Meta e LinkedIn. Tre interventi fatti, una lista
di modifiche proposte in ordine di quanto pagherebbero.

> **Sui numeri citati qui sotto.** Vengono da agenzie e piattaforme di media buying, non
> da dati ufficiali di Meta o LinkedIn: servono a scegliere una direzione, non a fare
> previsioni. **Nessuno di questi numeri deve finire in un annuncio o sul sito** — vale
> la regola già stabilita per tutti i materiali di queste campagne: nessuna statistica
> che non sia vostra e verificabile. Le fonti sono in fondo.

---

## 1. Cosa dicono le raccomandazioni 2026

Otto punti, quelli che toccano davvero il materiale che avete.

**1. Sull'immagine ci va il gancio, non il servizio.** La raccomandazione ricorrente per
i creativi statici è di **5-10 parole sull'immagine**, con il messaggio lungo spostato
nel campo di testo dell'annuncio. Il motivo non è estetico: la regola del 20% di testo di
Meta non esiste più come regola, ma il comportamento è rimasto — al crescere del testo
sull'immagine l'annuncio viene distribuito meno e costa di più. La soglia pratica che
circola è **un terzo della superficie**.

**2. Più CTA sull'immagine, meno conversioni.** Ogni invito all'azione aggiuntivo
peggiora il risultato: uno solo, e possibilmente quello del pulsante della piattaforma.

**3. Varietà, non quantità.** Meta raggruppa gli annunci che si somigliano e li tratta di
fatto come uno solo: dieci varianti dello stesso impianto rendono quanto una. Quello che
serve sono **concetti davvero distinti** — angolo diverso, superficie diversa, formato
diverso.

**4. Gli statici non sono un ripiego.** Restano la parte più grossa delle conversioni su
Meta, e con un costo per acquisizione più basso del video (il video prende più clic, ma
più cari). Sono anche l'unico modo economico di produrre la varietà del punto 3.

**5. Il carosello batte l'immagine singola sulla lead generation**, con un costo per
conversione sensibilmente più basso e un tempo di attenzione molto più lungo. Perde solo
su pubblici freddissimi, dove un'immagine sola e forte funziona meglio.

**6. Su LinkedIn il Document Ad è il formato con il miglior rapporto tra costo e
attenzione**, davanti all'immagine singola. Le indicazioni convergono: documento
realmente utile, sotto le dieci pagine, e la vendita rimandata al retargeting.

**7. Su Meta il modulo istantaneo porta molti più lead a costo più basso** — con lead
mediamente meno qualificati. Per un servizio locale a ticket contenuto (i privati) è il
compromesso giusto; per le aziende no.

**8. Nella sicurezza informatica il messaggio allarmistico si è consumato.** Chi compra
sa già che le minacce esistono. Quello che sposta oggi è la **specificità del risultato**:
cosa cambia concretamente, in quanto tempo, e cosa si potrà dire internamente per
giustificare la spesa.

---

## 2. Cosa ho già cambiato

### a) I dodici PNG di presentazione erano vecchi

Sulle immagini in `wwwroot/img/campagne/singola/` c'era ancora scritto **«Tecnolink ·
Firenze, da oltre 20 anni»**. Il testo era già stato tolto dal generatore quando il
cliente ha chiesto di eliminare quel claim, ma i PNG non erano mai stati rifatti: sono
file binari, e a differenza del codice non si accorgono di essere rimasti indietro.
Sarebbero andati in campagna con la frase che si era deciso di togliere.

Rigenerati tutti e dodici (`node genera.mjs && ./render.sh`): ora la firma è
«Tecnolink · Firenze e dintorni», come nel sorgente.

> **Da tenere presente:** ogni volta che si tocca un testo in `genera.mjs`,
> `genera-caroselli.mjs` o `genera-manifesti.mjs`, i PNG vanno rifatti e ricommittati.
> Nessuno se ne accorge finché non si guardano le immagini una per una.

### b) Otto creativi nuovi, una frase ciascuno

Il visual di presentazione ha circa **sessanta parole** sull'immagine: nome, promessa,
quattro passi numerati, tre garanzie, pulsante, firma. È l'esatto contrario dei punti 1 e
2 qui sopra — su traffico freddo è il tipo di creativo che le piattaforme distribuiscono
peggio, ed è anche un'immagine che si legge solo se ci si è già fermati.

Ho aggiunto una famiglia nuova in [`manifesti/`](manifesti/): **quattro concetti per
pubblico, una frase sola, quattro superfici diverse** (nero, bianco, gradiente,
notte) — pensati come gancio da traffico freddo, con tutto il ragionamento spostato nel
copy dell'annuncio. Le motivazioni e la tabella dei concetti stanno nel
[README della cartella](manifesti/README.md).

Uno degli otto, il concetto **«esito»**, è deliberatamente l'unico che non nomina nessuna
minaccia: *«Un elenco di cose da sistemare, in ordine di urgenza»*. Serve a misurare il
punto 8 sul vostro pubblico invece che in generale — minaccia contro risultato, stesso
pubblico, stessa spesa.

### c) Quattro formati nuovi, uno per tipo

Il punto 3 chiede varietà vera. Otto manifesti sono otto ganci, ma tutti costruiti allo
stesso modo: in [`formati/`](formati/) ci sono quattro **impostazioni** diverse, prodotte
per poterle confrontare.

| Tipo | Cos'è | Dove |
|---|---|---|
| **confronto** | Due metà: sopra quello che si vede, sotto quello che guardiamo noi | Traffico freddo — si legge senza leggere |
| **checklist** | Cinque domande con le caselle vuote | Storie e retargeting, **non** il feed freddo |
| **miti** | Carosello da sei carte sulle convinzioni che lasciano la porta aperta | Privati, Facebook e Instagram |
| **anatomia** | La forma del report, senza il contenuto | Aziende, retargeting |

I testi dei miti sono quelli già sulla landing privati: se cambiano lì vanno cambiati
anche qui. L'anatomia mostra i nomi delle quattro parti del report e non i risultati —
un report finto con numeri finti sarebbe un documento falso, e non è una strada
percorribile.

### d) Il Document Ad per LinkedIn, fatto

Era la proposta numero 1 di questa revisione. Il PDF di otto pagine c'è, in
[`documento/`](documento/), con l'indice e le regole seguite nel README di quella
cartella. Due pagine hanno un `[DA COMPILARE]`, in un riquadro che si vede: le domande
vere dei questionari che ricevete e una pagina di report anonimizzata. Sono le due cose
che lo rendono vostro invece che generico.

### e) Il visual di presentazione non va buttato: va spostato

Resta un buon creativo **per il retargeting**, dove chi guarda ha già visto il nome e sta
cercando di capire cosa comprende il servizio: lì i quattro passi e le tre garanzie
rispondono a domande che il lettore si sta già facendo. Il cambiamento è di impiego, non
di file: traffico freddo → manifesti e caroselli, retargeting → presentazione.

---

## 3. Modifiche proposte, in ordine di resa

### 1. Un Document Ad per LinkedIn — ~~*l'intervento che paga di più*~~ **fatto**

> Il PDF è in [`documento/`](documento/). Restano da compilare le pagine 04 e 07 —
> le domande vere dei questionari e una pagina di report anonimizzata. L'indice qui
> sotto è quello effettivamente impaginato.

È il formato con il costo per lead più basso su LinkedIn, e voi avete già il contenuto
sparso tra landing e documenti interni. Non serve inventare niente: serve impaginare.

Indice, otto pagine, formato verticale:

| Pagina | Contenuto |
|---|---|
| 1 | Copertina: *«Sicurezza informatica: cosa vi verrà chiesto, e da chi»* — sottotitolo con il nome dell'azienda e Firenze |
| 2 | Le quattro strade da cui arriva la domanda: NIS2, GDPR art. 32, polizze cyber, questionari dei clienti — una riga ciascuna |
| 3 | NIS2 in una pagina: chi tocca davvero, incluso l'effetto sui fornitori delle aziende obbligate |
| 4 | Le domande tipiche di un questionario di sicurezza fornitori (5-6 domande vere, quelle che ricevete davvero) |
| 5 | Cosa serve avere pronto per rispondere: inventario dei dispositivi, elenco delle vulnerabilità note, gravità, piano di rientro |
| 6 | Come funziona un check-up: i quattro passi già scritti nel creativo di presentazione |
| 7 | Cosa vi resta in mano: descrizione del report, con una pagina di esempio anonimizzata *(quando l'avrete)* |
| 8 | Come si comincia: contatto, tempi, «preventivo prima di iniziare» |

Da tenere **non protetto da modulo** al primo giro: si sponsorizza per far leggere, si
raccolgono i lead nel retargeting su chi ha aperto il documento. Il modulo davanti a un
documento che nessuno conosce ancora abbatte le aperture.

**Serve:** mezza giornata di impaginazione. Il generatore dei creativi produce già PDF
con Edge headless, quindi si riusa l'impianto esistente.

### 2. Modulo istantaneo su Meta per i privati, contro la landing

Oggi entrambe le campagne portano alla landing. Per i privati vale la pena mettere a
confronto **un gruppo di annunci con il modulo nativo di Meta**: molti più lead a costo
più basso, mediamente meno qualificati — che su un check-up casalingo è un compromesso
accettabile, molto meno su un contratto aziendale.

Campi: nome, telefono, città. Nient'altro.

> Come per il Lead Gen Form di LinkedIn già previsto in `campagne-ads.md`: i lead del
> modulo nativo **non passano dal form del sito**, quindi non arrivano via mail e non
> portano con sé gli UTM. Vanno scaricati da Ads Manager o collegati a un CRM, e vanno
> richiamati in fretta — su questi moduli la velocità di ricontatto conta più che
> altrove, perché chi compila non sta aspettando la vostra chiamata.

### 3. Thought Leader Ad su LinkedIn

Sponsorizzare il post di una **persona** invece della pagina aziendale: su LinkedIn il
volto di chi fa il lavoro raccoglie più attenzione del marchio, e per un'azienda locale è
l'unica cosa che un concorrente nazionale non può replicare. Serve un post scritto in
prima persona dal titolare o dal responsabile tecnico — non un annuncio travestito: una
cosa vista sul campo, raccontata come si racconterebbe a un cliente.

Traccia utile: *«La prima cosa che guardo quando entro in una rete aziendale»*.

**Serve:** il consenso della persona e mezz'ora del suo tempo.

### 4. Un prezzo di riferimento sulla landing privati

Già segnalato in `campagne-ads.md` §4, e la ricerca lo conferma: sul traffico consumer
l'assenza di qualsiasi indicazione economica è il primo motivo di abbandono. Anche solo
«a partire da» o una forbice.

### 4-bis. Il carosello «mito e realtà», fatto

Era l'idea 6 della pagina interna, e i testi erano già scritti sulla landing privati: ora
è impaginato, sei carte, in [`formati/`](formati/). Costava solo il tempo di farlo.

### 5. Il carosello con l'apertura «esito»

I caroselli aprono entrambi sulla minaccia. Il punto 8 dice che vale la pena provare
l'apertura opposta almeno una volta: stessa sequenza, prima carta che dice cosa si
ottiene invece di cosa si rischia. Costa una riga in `genera-caroselli.mjs` e un giro di
rendering.

Attenzione a non toccare la carta 03: la via d'uscita resta dov'è, e il motivo è spiegato
nel README dei caroselli.

### 6. Rotazione dei creativi: mettila a calendario

La raccomandazione è **ogni 4-6 settimane**, e su un bacino locale piccolo come Firenze e
provincia la saturazione arriva prima che altrove. Con i manifesti la rotazione ora costa
poco: si cambia il concetto in corsa, non tutta la campagna.

### 7. Il video, dopo — non prima

Dieci secondi di scansione registrata restano una buona idea, ma dopo aver fatto girare
gli statici: costano di più, portano clic più cari, e servono soprattutto a rinnovare una
campagna che ha già trovato il messaggio giusto.

### 8. Il numero vero, quando ce l'avrete

Dopo i primi dieci check-up avrete una cifra vostra: dispositivi trovati in media,
vulnerabilità critiche al primo giro, quanto ci vuole. È il creativo statico più forte in
assoluto, e con i manifesti costa una riga di codice. **Non prima di avere il dato.**

---

## 4. Cosa non cambierei

**I caroselli vanno bene così.** Prima carta con una frase sola e nessun altro elemento,
testo grande, leggibili in miniatura e senza audio, bianco e nero che si stacca in un feed
saturo, e — soprattutto — la terza carta che offre la via d'uscita. Sono già scritti
secondo le raccomandazioni del 2026, comprese quelle uscite dopo. L'unica cosa da
provare è l'apertura alternativa del punto 5.

**La struttura dei test.** Due varianti per volta, budget uguale, 10-14 giorni, si guarda
il costo per lead e non il CTR: è la parte più facile da sbagliare quando arrivano i primi
dati, ed è già scritta bene in `campagne-ads.md` §3.

**La linea sulle policy Meta.** Domande e fatti generali, mai affermazioni sulla
situazione di chi legge. Vale anche per i manifesti nuovi.

---

## 5. Due cose ancora aperte sul sito

- **Il link LinkedIn nel footer** punta ancora a `https://www.linkedin.com`
  (`Pages/Shared/_Layout.cshtml`, riga 195). Cercando, la pagina aziendale sembra essere
  `https://www.linkedin.com/company/tecnolink_2` — profilo di Firenze, informatica,
  fondata nel 1994: **da confermare da chi gestisce la pagina** prima di metterla nel
  footer. Va sistemato prima di mandare traffico da LinkedIn: chi arriva dall'annuncio e
  clicca l'icona finisce sulla home di LinkedIn.
- **Le tre voci di menu temporanee** (`VA · Aziende`, `VA · Privati`, `Materiali`, blocco
  `TEMP` in `_Layout.cshtml`) vanno tolte prima del lancio.

---

## Fonti

Creativi statici e testo sull'immagine:

- [Meta Ads Creative Best Practices: 2026 Field Guide — adlibrary.com](https://adlibrary.com/posts/meta-ads-creative-best-practices)
- [Static ads in 2026: the performance marketer's playbook — superscale.ai](https://superscale.ai/learn/static-ads/)
- [The Small Business Guide to Meta Ads Creative in 2026 — verdemedia.com](https://verdemedia.com/blog/the-guide-to-meta-ads-creative-2026)
- [8 High-Converting Static Ad Examples for 2026 — sovran.ai](https://sovran.ai/blog/static-ads-examples)
- [Meta Ads Creative Best Practices: What Converts in 2026 — benly.ai](https://benly.ai/learn/meta-ads/creative-best-practices)

Varietà dei creativi e distribuzione:

- [How to Test Ad Creatives After Meta's Andromeda Update — theoptimizer.io](https://theoptimizer.io/blog/how-to-test-ad-creatives-on-meta-after-the-andromeda-update-2026-playbook)
- [Meta Andromeda Creatives: The Data Behind the Biggest Ad Strategy Shift in 2026 — scaledon.com](https://scaledon.com/meta-andromeda-creatives-the-data-behind-the-biggest-ad-strategy-shift-in-2026/)
- [Meta Andromeda Update 2026: Creative Strategy Playbook — segwise.ai](https://segwise.ai/blog/meta-andromeda-update-creative-strategy-2026)
- [What Are Static Ads? Types & How to Scale on Meta in 2026 — scalemate.co](https://www.scalemate.co/blog/what-are-static-ads)

Formati a confronto:

- [Meta Ads Benchmarks by Creative Format (2026) — adamigo.ai](https://www.adamigo.ai/blog/meta-ads-benchmarks-2026-creative-formats-image-video-carousel-collection)
- [Meta Carousel Ads: Design Tips & Performance Optimization 2026 — benly.ai](https://benly.ai/learn/meta-ads/carousel-ads-guide)

LinkedIn:

- [Document ads best practices — LinkedIn Marketing Solutions Help](https://www.linkedin.com/help/lms/answer/a726534)
- [Document Ads Specifications — LinkedIn Marketing Solutions](https://business.linkedin.com/marketing-solutions/success/ads-guide/document-ads)
- [LinkedIn Document Ads: The Complete Guide 2026 — theb2bhouse.com](https://www.theb2bhouse.com/linkedin-document-ads/)
- [LinkedIn Ads Playbook 2026: B2B Lead Generation Tactics — uncommonlogic.com](https://blog.uncommonlogic.com/linkedin-ads-playbook-b2b-2026)
- [LinkedIn Ads for B2B in 2026: Formats, Costs & Best Practices — intentsify.io](https://intentsify.io/blog/linkedin-ads-for-b2b-formats-costs-best-practices/)

Moduli nativi e campagne locali:

- [How Facebook Lead Ads Work for Local Businesses — ueni.com](https://ueni.com/blog/how-facebook-lead-ads-work-for-local-businesses/)
- [Facebook Lead Form vs Landing Page Forms — leadcapture.io](https://leadcapture.io/blog/facebook-lead-form-vs-landing-page-forms/)
- [Facebook Ads For Local Services: Lead Generation Guide — clicksgeek.com](https://clicksgeek.com/facebook-ads-for-local-services/)

Messaggi nel settore sicurezza:

- [Navigating the New Era of Cybersecurity Marketing — bluetext.com](https://bluetext.com/blog/navigating-the-new-era-of-cybersecurity-marketing-trends-and-insights-for-2026/)
- [Cybersecurity Marketing Trends for 2026 — cyberbridgemarketing.com](https://cyberbridgemarketing.com/cybersecurity-marketing-trends-2026/)
- [The Ultimate 2026 Cybersecurity Marketing Guide — martal.ca](https://martal.ca/cybersecurity-marketing-lb/)
