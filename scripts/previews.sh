#!/bin/bash
# Gera previews/<efeito>.jpg (um quadro de cada efeito) e previews/catalogo.jpg (grade com todos) a partir de um
# trabalho já preparado. Uso: bash scripts/previews.sh <id-do-trabalho>
set -e
cd "$(dirname "$0")/.."
ID=$1; WORK=trabalhos/$ID
[ -f "$WORK/job.json" ] || { echo "uso: previews.sh <id> (trabalho preparado)"; exit 1; }
mkdir -p previews
# segundo em que cada efeito já está montado
QUADRO="glass-widgets:1.4 documentary:1.8 orbit:1.5 kallaway-split:1.6 spotlight:1.2 checklist:1.5 timeline:1.2 lineup:1.4 shortcut-rain:1.6
red-collage:1.4 comment-box:2.0 cover-star:1.3 headline-wall:1.5 phone-fan:1.2 rabbit-hole:1.0 pastel-word:1.6 split-headline:1.4"
LISTA=()
for par in $QUADRO; do
  fx=${par%%:*}; s=${par##*:}
  f=$(python3 -c "print(round($s*30))")
  npx remotion still src/index.tsx "$fx" "previews/$fx.jpg" --public-dir="$WORK" --frame=$f --scale=0.5 --jpeg-quality=88 --log=error
  echo "  ✓ $fx"; LISTA+=("previews/$fx.jpg")
done
# grade 6×3 (a 18ª célula fica vazia)
L=$(mktemp); for p in "${LISTA[@]}"; do echo "file '$PWD/$p'" >> "$L"; done
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$L" -vf "scale=270:480,setsar=1,tile=6x3:padding=10:margin=10:color=0x252522" -frames:v 1 -q:v 3 previews/catalogo.jpg
rm -f "$L"
echo "pronto: previews/catalogo.jpg"
