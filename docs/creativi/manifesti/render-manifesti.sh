#!/usr/bin/env bash
# Converte in PNG i manifesti generati da genera-manifesti.mjs, usando Edge in headless.
# Uso:  node genera-manifesti.mjs && ./render-manifesti.sh
set -euo pipefail

EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
[ -x "$EDGE" ] || EDGE="/c/Program Files/Microsoft/Edge/Application/msedge.exe"

# Edge vuole un percorso Windows (C:/...), non quello POSIX di Git Bash: `pwd -W` lo converte.
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -W)"

# I PNG vivono dentro il sito, non qui accanto: servono alla pagina interna
# /interno/materiali-campagne, che è il posto da cui si ritrovano.
PNG="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../tecnolinkSite/wwwroot/img/campagne" && pwd -W)/manifesti"
mkdir -p "$PNG"

scatta() { # <nome> <larghezza> <altezza>
  # Ogni istanza usa un profilo temporaneo suo: senza, le esecuzioni successive
  # si contendono lo stesso profilo e prima o poi una resta appesa senza uscire.
  local profilo
  profilo="$(mktemp -d)"
  # --disable-lcd-text: senza, Edge su Windows disegna il testo con l'antialiasing
  # subpixel e il bianco su nero esce con frange rosse e blu, che sopravvivono
  # alla compressione delle piattaforme. Qui il testo è enorme, quindi si vede.
  timeout --kill-after=5 60 \
    "$EDGE" --headless=new --disable-gpu --no-first-run --no-default-browser-check \
    --user-data-dir="$profilo" --hide-scrollbars --force-device-scale-factor=1 \
    --disable-lcd-text --window-size="$2,$3" --virtual-time-budget=8000 \
    --screenshot="$PNG/$1.png" "file:///$HERE/html/$1.html" >/dev/null 2>&1 || true
  # Capita che Edge tenga ancora aperto qualche file del profilo quando torna il
  # controllo: la pulizia fallisce, e con `set -e` fermerebbe tutto il giro per
  # una cartella temporanea. Restano in /tmp, li porta via il riavvio.
  rm -rf "$profilo" 2>/dev/null || true
}

render() { # <nome> <larghezza> <altezza>
  scatta "$@"
  # Un secondo tentativo se il PNG non è uscito: quasi sempre basta.
  if [ ! -s "$PNG/$1.png" ]; then
    echo "  ...ritento $1"
    scatta "$@"
  fi
  if [ -s "$PNG/$1.png" ]; then
    echo "  wwwroot/img/campagne/manifesti/$1.png  ($2x$3)"
  else
    echo "  MANCANTE: $1  — rilanciare lo script" >&2
  fi
}

for concetto in domanda nis2 esito questionario; do
  render "aziende-$concetto-feed-verticale" 1080 1350
  render "aziende-$concetto-storia"         1080 1920
  render "aziende-$concetto-quadrato"       1080 1080
done

for concetto in wifi router esito telecamere; do
  render "privati-$concetto-feed-verticale" 1080 1350
  render "privati-$concetto-storia"         1080 1920
  render "privati-$concetto-quadrato"       1080 1080
done

echo "Fatto."
