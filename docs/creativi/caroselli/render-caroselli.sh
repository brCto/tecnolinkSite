#!/usr/bin/env bash
# Converte in PNG le carte generate da genera-caroselli.mjs, usando Edge in headless.
# Uso:  node genera-caroselli.mjs && ./render-caroselli.sh
set -euo pipefail

EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
[ -x "$EDGE" ] || EDGE="/c/Program Files/Microsoft/Edge/Application/msedge.exe"

# Edge vuole un percorso Windows (C:/...), non quello POSIX di Git Bash: `pwd -W` lo converte.
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -W)"
# Per il glob su html/ serve invece il percorso POSIX: Edge vuole uno, la shell l'altro.
HERE_POSIX="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# I PNG vivono dentro il sito, non qui accanto: servono alla pagina interna
# /interno/materiali-campagne, che è il posto da cui si ritrovano.
PNG="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../tecnolinkSite/wwwroot/img/campagne" && pwd -W)/caroselli"
mkdir -p "$PNG"

scatta() { # <nome> <larghezza> <altezza>
  # Ogni istanza usa un profilo temporaneo suo: senza, le esecuzioni successive si
  # contendono lo stesso profilo. Non basta però: capita comunque che un'istanza
  # resti appesa senza uscire mai, e con 64 carte capita spesso. Da qui il tetto
  # di tempo: meglio perdere una carta e riprovarla che bloccare tutto il giro.
  local profilo
  profilo="$(mktemp -d)"
  # --disable-lcd-text: senza, Edge su Windows disegna il testo con l'antialiasing
  # subpixel e il bianco su nero esce con frange rosse e blu. Su una creatività in
  # bianco e nero si vedono, e sopravvivono alla compressione delle piattaforme.
  timeout --kill-after=5 60 \
    "$EDGE" --headless=new --disable-gpu --no-first-run --no-default-browser-check \
    --user-data-dir="$profilo" --hide-scrollbars --force-device-scale-factor=1 \
    --disable-lcd-text --window-size="$2,$3" --virtual-time-budget=8000 \
    --screenshot="$PNG/$1.png" "file:///$HERE/html/$1.html" >/dev/null 2>&1 || true
  # Quando `timeout` deve ammazzare Edge, i file del profilo restano aperti per
  # qualche istante e la cancellazione fallisce con "Device or resource busy".
  # Senza il `|| true` quel fallimento, con `set -e`, abbatte tutto il giro: è
  # successo dopo sei carte su novantasei. Meglio lasciare indietro una cartella
  # temporanea che perdere un quarto d'ora di rendering.
  rm -rf "$profilo" 2>/dev/null || true
}

render() { # <nome> <larghezza> <altezza>
  # Già fatto in un giro precedente: si salta.
  if [ -s "$PNG/$1.png" ]; then return; fi
  scatta "$@"
  # Un secondo tentativo se il PNG non è uscito: quasi sempre basta.
  if [ ! -s "$PNG/$1.png" ]; then
    echo "  ...ritento $1"
    scatta "$@"
  fi
  if [ -s "$PNG/$1.png" ]; then
    echo "  wwwroot/img/campagne/caroselli/$1.png  ($2x$3)"
  else
    echo "  MANCANTE: $1  — rilanciare lo script" >&2
  fi
}

# Tutte le carte generate, in tutte le misure in cui esistono. Oggi sono tre sequenze
# per quattro varianti grafiche: facebook e linkedin con quattro carte in tre misure,
# stanze con cinque carte in due (di quella il 4:5 non è mai stato generato). 136 immagini.
# I PNG già presenti vengono rifatti solo se manca il file: così, se un giro si
# interrompe a metà, rilanciare lo script riprende da dove era rimasto invece di
# ricominciare da capo (è un quarto d'ora abbondante). Per rifare tutto: --tutto,
# che serve ogni volta che si tocca la grafica e non solo i testi.
if [ "${1:-}" = "--tutto" ]; then rm -f "$PNG"/*.png; fi

# I nomi delle carte non sono più elencati qui: si leggono da quelle che
# genera-caroselli.mjs ha appena scritto in html/. Così aggiungere una sequenza a
# CONTENUTI — o cambiare il numero di carte di una che c'è già — non obbliga a venire
# a correggere anche questo script, che è esattamente il modo in cui prima si
# finiva per generare l'HTML di carte che poi nessuno convertiva in PNG.
# La misura si deduce dal nome: <chiave>-<variante>-<formato>-NN.
for f in "$HERE_POSIX"/html/*.html; do
  [ -e "$f" ] || { echo "Nessuna carta in html/: lancia prima node genera-caroselli.mjs" >&2; exit 1; }
  nome="$(basename "$f" .html)"
  case "$nome" in
    # Il 4:5 del feed resta in elenco: è la misura principale su Facebook e
    # Instagram, e lasciarlo fuori dai formati riconosciuti — come era successo —
    # non dà errore, stampa "ignorato" e si porta via quarantotto immagini.
    *-feed-verticale-*) render "$nome" 1080 1350 ;;
    *-quadrato-*)       render "$nome" 1080 1080 ;;
    *-storia-*)         render "$nome" 1080 1920 ;;
    *)                  echo "  ignorato, formato non riconosciuto: $nome" >&2 ;;
  esac
done

echo "Fatto."
