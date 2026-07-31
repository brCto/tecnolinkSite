# Document Ad per LinkedIn — otto pagine in PDF

Il PDF sta in `tecnolinkSite/wwwroot/img/campagne/documento/documento-linkedin.pdf`,
con la copertina in PNG accanto per l'anteprima nella pagina interna.

## Perché questo formato

Su LinkedIn il Document Ad è il formato con il **costo per lead più basso**, davanti
all'immagine singola, e il motivo è meccanico: il documento si sfoglia dentro il feed,
senza uscire da LinkedIn. La soglia da superare non è «vale la pena cliccare» ma «vale la
pena scorrere ancora una pagina», che è molto più bassa.

In più dà un dato che gli altri formati non hanno: **quante pagine vengono lette**. Se
quasi nessuno passa la terza, il problema è il documento; se molti arrivano in fondo e
nessuno vi scrive, il problema è l'offerta.

## Le regole seguite

- **Otto pagine.** Sotto le dieci: oltre, la percentuale di chi arriva in fondo crolla e
  il dato di cui sopra smette di dire qualcosa.
- **Verticale, 1080 × 1350.** L'anteprima nel feed è alta: un documento orizzontale ci
  entra piccolo e da telefono non si legge.
- **Utile anche a chi non vi chiamerà.** Il contenuto che funziona è quello che
  regalereste volentieri. Se serve solo a vendere si capisce alla seconda pagina, e lì si
  smette di sfogliare.
- **Copertina e chiusura scure, il resto chiaro.** Mentre si sfoglia in miniatura si
  capisce a colpo d'occhio dove si è: le due pagine scure aprono e chiudono.
- **Nessuna statistica.** Dove servirebbe un dato reale c'è `[DA COMPILARE]`.

## Le otto pagine

| | Contenuto |
|---|---|
| 01 | Copertina — *Sicurezza informatica: cosa vi verrà chiesto, e da chi* |
| 02 | Le quattro strade da cui arriva la domanda: NIS2, GDPR art. 32, polizze, questionari |
| 03 | NIS2 in una pagina, incluso perché tocca anche chi non è nell'elenco |
| 04 | Le domande che arrivano più spesso nei questionari dei clienti |
| 05 | Le quattro cose da avere pronte per poter rispondere |
| 06 | Come funziona un check-up: i quattro passi |
| 07 | Cosa vi resta in mano: le quattro parti del report |
| 08 | Come si comincia: mezz'ora, senza impegno |

## Cosa manca — le due cose che lo renderebbero vostro

Sono segnate `[DA COMPILARE]` dentro il PDF, in un riquadro che si vede: se restassero
per distrazione, saltano all'occhio a chi rilegge.

- **Pagina 04 — le domande vere.** Quelle che ricevete davvero nei questionari dei
  clienti. Sono più credibili di qualsiasi elenco generico e mostrano che li avete già
  visti. Oggi ci sono sei domande plausibili, da sostituire.
- **Pagina 07 — una pagina vera del report**, con nomi e indirizzi oscurati. È la prova
  che il documento esiste e che si capisce: vale più di tutta la pagina che c'è adesso.

Finché non ci sono, il documento regge lo stesso — ma vale meno.

> La pagina 03 chiude con una nota che dice che è una sintesi divulgativa e non un parere
> legale. **Non va tolta.** Su un documento che parla di obblighi normativi è la
> differenza tra informare e consigliare.

## Come si pubblica

Formato **Document Ad** in Campaign Manager, obiettivo Lead generation o Engagement.

**Al primo giro, senza modulo davanti.** Si sponsorizza per far leggere, e i lead si
raccolgono dopo, in retargeting su chi lo ha sfogliato: un modulo davanti a un documento
che nessuno conosce ancora abbatte le aperture. Quando il documento avrà accumulato
letture, si può provare la versione con il modulo dopo le prime pagine e confrontare.

Testo del post: si può riusare la variante A o C di
[`../../campagne-ads.md`](../../campagne-ads.md), con `utm_content=documento` sul link in
firma. Nota che il documento si sfoglia dentro LinkedIn: il clic verso il sito arriva
dopo, quindi non aspettatevi lo stesso numero di visite di un annuncio a immagine
singola. Quello che va guardato qui è il costo per lead, e quante pagine vengono lette.

## Modificare i testi

Tutto sta in `PAGINE`, in cima a `genera-documento.mjs`: una voce per pagina, con il
`tipo` che decide l'impaginazione (`copertina`, `elenco`, `testo`, `passi`, `chiusura`).
Per aggiungere una pagina si aggiunge una voce; per cambiarne la forma si scrive un nuovo
`tipo` in `corpi`.

```bash
node genera-documento.mjs && ./render-documento.sh
```

Serve Node e Microsoft Edge: il PDF esce da Edge in headless con `--print-to-pdf`, e lo
stesso giro produce il PNG della copertina per la pagina interna.
