# Quattro formati nuovi, uno per tipo

Non sono varianti grafiche di quello che c'è già: sono **quattro modi diversi di
impostare l'annuncio**, prodotti per poterli confrontare. Servono momenti diversi del
percorso, quindi non vanno pubblicati tutti insieme — si sceglie in base a dove sta il
pubblico, non a quale piace di più.

I PNG stanno in `tecnolinkSite/wwwroot/img/campagne/formati/` e si guardano tutti insieme
da **`/interno/materiali-campagne`**.

| Tipo | Cos'è | Dove sta bene | File |
|---|---|---|---|
| **confronto** | Statico a due metà: sopra quello che si vede, sotto quello che guardiamo noi | Traffico freddo. Si capisce senza leggere: due blocchi, e il secondo contiene visibilmente più roba del primo | 2 pubblici × feed + storia |
| **checklist** | Cinque domande a cui rispondere da soli, con le caselle vuote | Storie e retargeting. È testo, quindi **non** è un creativo da feed freddo | 2 pubblici × feed + storia |
| **miti** | Carosello da sei carte sulle convinzioni che lasciano la porta aperta | Facebook e Instagram, pubblico privati | 6 carte × quadrato + storia |
| **anatomia** | Cosa contiene il documento che consegnate | Retargeting su aziende: risponde a «ma alla fine cosa mi resta in mano?» | feed + quadrato |

## confronto

Due metà, una chiara e una scura. La forza sta nel fatto che si legge senza leggere:
l'impressione — *sopra c'è una cosa sola, sotto ce ne sono quattro* — arriva prima delle
parole, e il testo la conferma. È il più adatto dei quattro al feed freddo, perché
funziona anche in miniatura.

## checklist

Cinque domande, le caselle vuote, e una riga di chiusura che dice cosa farne
(«se su due resti in silenzio, un check-up ha senso»). Chi si ferma la legge fino in
fondo e si dà una risposta da solo: è la differenza tra un annuncio che informa e uno che
fa fare una cosa.

Ha parecchie parole, ed è voluto — ma proprio per questo **non va nel feed freddo**, dove
le immagini molto scritte vengono distribuite peggio. Il suo posto sono le storie, dove
chi guarda si ferma volentieri, e il retargeting.

## miti

Sei carte: copertina, quattro miti, chiusura. Ogni carta ha la frase tra virgolette in
grande e la risposta sotto, separate da una riga. Funziona perché il lettore **riconosce
la frase**: è una cosa che ha pensato lui, o che ha sentito dire a tavola.

I quattro miti sono quelli già scritti sulla landing privati, accorciati per stare su una
carta. **Se cambiano lì vanno cambiati anche qui**: l'annuncio e la pagina devono
raccontare la stessa cosa, altrimenti chi clicca si accorge dello scarto.

## anatomia

Mostra la forma del report senza mostrarne il contenuto: ci sono i nomi delle quattro
parti, non i risultati. Risponde all'obiezione silenziosa di chi non ha mai comprato un
check-up e non sa cosa si porta a casa.

**Perché non un report finto con numeri finti:** sarebbe un documento falso, e non è una
strada percorribile. Quando avrete una pagina vera da anonimizzare, quella sì che vale la
pena fotografarla — ed è segnata come [DA COMPILARE] anche nel Document Ad.

## Modificare i testi

Tutto sta in `CONTENUTI`, in cima a `genera-formati.mjs`, una voce per tipo. Le superfici
sono in `SUPERFICI`, le misure in `MISURE`: `scala` alza i corpi del testo sui formati
più grandi, così le proporzioni restano le stesse su tutte e tre le misure.

```bash
node genera-formati.mjs && ./render-formati.sh
```

Gli HTML intermedi finiscono in `html/`, i PNG in
`tecnolinkSite/wwwroot/img/campagne/formati/`. Serve Node e Microsoft Edge.

## Le regole che valgono anche qui

- **Nessuna affermazione sulla situazione di chi legge.** Le domande della checklist sono
  domande, non diagnosi: *«sai quanti dispositivi sono collegati?»*, non *«hai troppi
  dispositivi esposti»*. È la linea seguita in tutti i materiali di queste campagne.
- **Nessun dato che non sia vostro.** Nessuno di questi creativi contiene numeri.
- **Due varianti per volta**, stesso pubblico e stessa spesa, e si guarda il costo per
  lead. Con quattro tipi nuovi la tentazione di provarli tutti insieme è forte: con un
  budget locale nessuno raccoglierebbe abbastanza dati per dire qualcosa.

Il ragionamento e le fonti sono in [`../revisione-2026.md`](../revisione-2026.md).
