#!/usr/bin/env bash
# Converte in PDF il documento generato da genera-documento.mjs, con Edge headless.
# Uso:  node genera-documento.mjs && ./render-documento.sh
#
# Produce anche un PNG della copertina: serve alla pagina interna
# /interno/materiali-campagne per mostrare l'anteprima del documento.
set -euo pipefail

EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
[ -x "$EDGE" ] || EDGE="/c/Program Files/Microsoft/Edge/Application/msedge.exe"

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -W)"
FUORI="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../tecnolinkSite/wwwroot/img/campagne" && pwd -W)/documento"
mkdir -p "$FUORI"

profilo="$(mktemp -d)"
# --no-pdf-header-footer: senza, Edge stampa URL e data sui margini di ogni pagina.
timeout --kill-after=5 90 \
  "$EDGE" --headless=new --disable-gpu --no-first-run --no-default-browser-check \
  --user-data-dir="$profilo" --no-pdf-header-footer --virtual-time-budget=10000 \
  --print-to-pdf="$FUORI/documento-linkedin.pdf" \
  "file:///$HERE/html/documento-linkedin.html" >/dev/null 2>&1 || true
rm -rf "$profilo" 2>/dev/null || true

profilo="$(mktemp -d)"
timeout --kill-after=5 60 \
  "$EDGE" --headless=new --disable-gpu --no-first-run --no-default-browser-check \
  --user-data-dir="$profilo" --hide-scrollbars --force-device-scale-factor=1 \
  --disable-lcd-text --window-size=1080,1350 --virtual-time-budget=8000 \
  --screenshot="$FUORI/documento-copertina.png" \
  "file:///$HERE/html/documento-linkedin.html" >/dev/null 2>&1 || true
rm -rf "$profilo" 2>/dev/null || true

for f in documento-linkedin.pdf documento-copertina.png; do
  if [ -s "$FUORI/$f" ]; then
    echo "  wwwroot/img/campagne/documento/$f"
  else
    echo "  MANCANTE: $f — rilanciare lo script" >&2
  fi
done
