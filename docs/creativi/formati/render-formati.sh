#!/usr/bin/env bash
# Converte in PNG i formati generati da genera-formati.mjs, usando Edge in headless.
# Uso:  node genera-formati.mjs && ./render-formati.sh
set -euo pipefail

EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
[ -x "$EDGE" ] || EDGE="/c/Program Files/Microsoft/Edge/Application/msedge.exe"

# Edge vuole un percorso Windows (C:/...), non quello POSIX di Git Bash: `pwd -W` lo converte.
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -W)"

# I PNG vivono dentro il sito, non qui accanto: servono alla pagina interna
# /interno/materiali-campagne, che è il posto da cui si ritrovano.
PNG="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../tecnolinkSite/wwwroot/img/campagne" && pwd -W)/formati"
mkdir -p "$PNG"

scatta() { # <nome> <larghezza> <altezza>
  local profilo
  profilo="$(mktemp -d)"
  # --disable-lcd-text: senza, Edge su Windows usa l'antialiasing subpixel e il
  # bianco su nero esce con frange colorate che sopravvivono alla compressione.
  timeout --kill-after=5 60 \
    "$EDGE" --headless=new --disable-gpu --no-first-run --no-default-browser-check \
    --user-data-dir="$profilo" --hide-scrollbars --force-device-scale-factor=1 \
    --disable-lcd-text --window-size="$2,$3" --virtual-time-budget=8000 \
    --screenshot="$PNG/$1.png" "file:///$HERE/html/$1.html" >/dev/null 2>&1 || true
  # Capita che Edge tenga ancora aperti dei file del profilo: la pulizia fallisce
  # e con `set -e` fermerebbe il giro per una cartella temporanea.
  rm -rf "$profilo" 2>/dev/null || true
}

render() { # <nome> <larghezza> <altezza>
  scatta "$@"
  if [ ! -s "$PNG/$1.png" ]; then
    echo "  ...ritento $1"
    scatta "$@"
  fi
  if [ -s "$PNG/$1.png" ]; then
    echo "  wwwroot/img/campagne/formati/$1.png  ($2x$3)"
  else
    echo "  MANCANTE: $1  — rilanciare lo script" >&2
  fi
}

feed()     { render "$1-feed-verticale" 1080 1350; }
storia()   { render "$1-storia"         1080 1920; }
quadrato() { render "$1-quadrato"       1080 1080; }

for pubblico in aziende privati; do
  feed   "confronto-$pubblico"; storia "confronto-$pubblico"
  feed   "checklist-$pubblico"; storia "checklist-$pubblico"
done

# Le carte del carosello "miti" hanno il numero dopo la misura.
for i in 01 02 03 04 05 06; do
  render "miti-privati-quadrato-$i" 1080 1080
  render "miti-privati-storia-$i"   1080 1920
done

feed     "anatomia-aziende"
quadrato "anatomia-aziende"

echo "Fatto."
