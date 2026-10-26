#!/bin/bash
# Instala a skill /efeito: Remotion (npm), numpy (venv .venv, para a saída HDR) e a ferramenta de recorte da pessoa
# (Vision, só no macOS). Pode rodar de novo sem problema.
# Uso: bash setup.sh
set -e
cd "$(dirname "$0")"
ok(){ printf "  ✓ %s\n" "$1"; }; falta(){ printf "  ✗ %s\n" "$1"; FALTOU=1; }
echo "1/4 Conferindo ferramentas"
command -v node >/dev/null && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 18 ] && ok "Node $(node -v)" || falta "Node 18+ (https://nodejs.org ou: brew install node)"
command -v ffmpeg >/dev/null && command -v ffprobe >/dev/null && ok "ffmpeg" || falta "ffmpeg (brew install ffmpeg | apt install ffmpeg | winget install ffmpeg)"
command -v python3 >/dev/null && ok "$(python3 --version)" || falta "Python 3.9+ (https://python.org)"
[ -z "$FALTOU" ] || { echo "Instale o que falta e rode de novo."; exit 1; }
echo "2/4 Remotion (npm install)"
npm install --no-audit --no-fund --loglevel=error && ok "node_modules"
# símbolo do Claude (simple-icons) na cor da marca, usado no checklist
mkdir -p assets && sed 's/<path /<path fill="#D97757" /' node_modules/simple-icons/icons/claude.svg > assets/spark.svg && ok "assets/spark.svg"
echo "3/4 numpy (venv .venv)"
[ -d .venv ] || python3 -m venv .venv
.venv/bin/pip install -q --upgrade pip && .venv/bin/pip install -q numpy && ok "numpy"
echo "4/4 Recorte da pessoa (macOS + Xcode Command Line Tools)"
if [ "$(uname)" = "Darwin" ] && command -v swiftc >/dev/null; then
  # contorno do bug das Command Line Tools ("redefinition of module SwiftBridging"): overlay que esconde o modulemap duplicado
  OV=$(mktemp -d); : > "$OV/empty.modulemap"
  printf '{"version":0,"case-sensitive":"false","roots":[{"name":"%s/usr/include/swift","type":"directory","contents":[{"name":"bridging.modulemap","type":"file","external-contents":"%s/empty.modulemap"}]}]}' "$(xcode-select -p 2>/dev/null || echo /Library/Developer/CommandLineTools)" "$OV" > "$OV/overlay.yaml"
  { swiftc -O tools/personmask.swift -o tools/personmask 2>/dev/null || swiftc -O -vfsoverlay "$OV/overlay.yaml" tools/personmask.swift -o tools/personmask 2>/dev/null; } \
    && ok "personmask (texto e cards ATRÁS de você)" || echo "  (personmask não compilou: os efeitos funcionam, mas o que seria atrás fica na frente)"
else echo "  (pulado: fora do macOS — os efeitos funcionam, mas o que seria atrás de você fica na frente)"; fi
mkdir -p trabalhos saidas
[ -f config.json ] || cp config.exemplo.json config.json
echo
echo "Pronto. No Claude Code: /efeito <nome> + o seu vídeo (caminho ou arrastado no chat)."
echo "Personalize nome e @ em config.json (ou: .venv/bin/python3 scripts/configurar.py --nome \"Seu Nome\" --perfil @seuperfil)."
