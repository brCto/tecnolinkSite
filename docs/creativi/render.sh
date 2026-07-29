#!/usr/bin/env bash
# Converte in PNG i creativi generati da genera.mjs, usando Edge in headless.
# Uso:  node genera.mjs && ./render.sh
set -euo pipefail

EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
[ -x "$EDGE" ] || EDGE="/c/Program Files/Microsoft/Edge/Application/msedge.exe"

# Edge vuole un percorso Windows (C:/...), non quello POSIX di Git Bash: `pwd -W` lo converte.
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -W)"

# I PNG vivono dentro il sito, non qui accanto: servono alla pagina interna
# /interno/materiali-campagne, che è il posto da cui si ritrovano.
PNG="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../tecnolinkSite/wwwroot/img/campagne" && pwd -W)/singola"
mkdir -p "$PNG"

render() { # <nome> <larghezza> <altezza>
  # Ogni istanza usa un profilo temporaneo suo: senza, le esecuzioni successive si
  # contendono lo stesso profilo e prima o poi una resta appesa senza mai uscire.
  local profilo
  profilo="$(mktemp -d)"
  "$EDGE" --headless=new --disable-gpu --no-first-run --no-default-browser-check \
    --user-data-dir="$profilo" --hide-scrollbars --force-device-scale-factor=1 \
    --window-size="$2,$3" --virtual-time-budget=8000 \
    --screenshot="$PNG/$1.png" "file:///$HERE/html/$1.html" >/dev/null 2>&1
  rm -rf "$profilo"
  echo "  wwwroot/img/campagne/singola/$1.png  ($2x$3)"
}

for pubblico in aziende privati; do
  for tema in chiaro vivido; do
    render "$pubblico-$tema-feed-verticale" 1080 1350
    render "$pubblico-$tema-storia"         1080 1920
    render "$pubblico-$tema-quadrato"       1080 1080
  done
done

echo "Fatto."
