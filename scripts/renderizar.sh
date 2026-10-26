#!/bin/bash
# Aplica um efeito a um vídeo já preparado (scripts/preparar.py) e devolve o arquivo final com o áudio original.
# Vídeo HDR (iPhone) → saída HDR (HLG, .mov) com o vídeo nos códigos originais; senão → .mp4 (H.264, BT.709).
# Uso: bash scripts/renderizar.sh <efeito> <id-do-trabalho> [--sdr] [--saida caminho] [--frames a-b]
set -e
cd "$(dirname "$0")/.."
FX=$1; ID=$2; shift 2 || { echo "uso: renderizar.sh <efeito> <id> [--sdr] [--saida caminho]"; exit 1; }
SDR=0; OUT=""; FR=""
while [ $# -gt 0 ]; do case $1 in --sdr) SDR=1; shift;; --saida) OUT=$2; shift 2;; --frames) FR="--frames=$2"; shift 2;; *) shift;; esac; done
WORK=trabalhos/$ID
[ -f "$WORK/job.json" ] || { echo "trabalho não preparado: $WORK (rode scripts/preparar.py primeiro)"; exit 1; }
grep -q "slug: \"$FX\"" src/catalogo.ts || { echo "efeito desconhecido: $FX — veja CATALOGO.md"; exit 1; }
PY=.venv/bin/python3; [ -x $PY ] || PY=python3
$PY scripts/preparar.py "$($PY -c "import json;print(json.load(open('$WORK/job.json'))['source'])")" --id "$ID" --so-config >/dev/null  # pega a config.json atual
HDR=$($PY -c "import json;print(int(json.load(open('$WORK/job.json'))['hdr']))")
AUD=$WORK/audio.m4a
mkdir -p saidas; TMP=$(mktemp -d)
render(){ npx remotion render src/index.tsx "$FX" "$1" --public-dir="$WORK" --props="{\"variant\":\"$2\"}" $FR "${@:3}" --log=error; }
mux(){ if [ -f "$AUD" ]; then ffmpeg -hide_banner -loglevel error -y -i "$1" -i "$AUD" -map 0:v -map 1:a -c copy -shortest -movflags +faststart "$2"; else mv "$1" "$2"; fi; }
if [ "$HDR" = "1" ] && [ $SDR = 0 ]; then
  OUT=${OUT:-saidas/$ID-$FX.mov}
  echo "• renderizando $FX (HDR: 2 passadas)…"
  render "$TMP/raw.mov" raw --codec=prores --prores-profile=4444
  render "$TMP/black.mov" black --codec=prores --prores-profile=4444
  $PY scripts/hdr.py "$TMP/raw.mov" "$TMP/black.mov" "$TMP/video.mov"
  mux "$TMP/video.mov" "$OUT"
else
  OUT=${OUT:-saidas/$ID-$FX.mp4}
  echo "• renderizando $FX…"
  render "$TMP/video.mp4" sdr --crf=17
  mux "$TMP/video.mp4" "$OUT"
fi
rm -rf "$TMP"
echo "pronto: $OUT"
