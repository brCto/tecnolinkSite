#!/usr/bin/env bash
# Converte in PNG le carte generate da genera-caroselli.mjs, usando Edge in headless.
# Uso:  node genera-caroselli.mjs && ./render-caroselli.sh
set -euo pipefail

EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
[ -x "$EDGE" ] || EDGE="/c/Program Files/Microsoft/Edge/Application/msedge.exe"

# Edge vuole un percorso Windows (C:/...), non quello POSIX di Git Bash: `pwd -W` lo converte.
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -W)"

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
  rm -rf "$profilo"
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

# Due pubblici × quattro varianti × quattro carte × due misure = 64 immagini.
# I PNG già presenti vengono rifatti solo se manca il file: così, se un giro si
# interrompe a metà, rilanciare lo script riprende da dove era rimasto invece di
# ricominciare da capo (sono una decina di minuti). Per rifare tutto: rm png/*.png
if [ "${1:-}" = "--tutto" ]; then rm -f "$PNG"/*.png; fi

for pubblico in facebook linkedin; do
  for variante in bn foto fascia riquadro; do
    for i in 01 02 03 04; do
      render "$pubblico-$variante-quadrato-$i" 1080 1080
      render "$pubblico-$variante-storia-$i"   1080 1920
    done
  done
done

echo "Fatto."
