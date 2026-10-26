# Grava nome, @ e (opcional) os dados do gráfico em config.json.
# Uso: .venv/bin/python3 scripts/configurar.py --nome "Rafa" --perfil @rafa.grandi [--nome-completo "RAFA GRANDI"]
#      [--grafico "ChatGPT:3400000,Social:1400000,..."] [--texto spotlight.palavra=CLAUDIT ...]
import argparse, json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
p = ROOT / "config.json"
cfg = json.loads((p if p.exists() else ROOT / "config.exemplo.json").read_text())
ap = argparse.ArgumentParser()
ap.add_argument("--nome"); ap.add_argument("--perfil"); ap.add_argument("--nome-completo")
ap.add_argument("--grafico", help='"Rótulo:views,Rótulo:views,…" (até 7, maior primeiro)')
ap.add_argument("--texto", action="append", default=[], help="efeito.campo=valor (ex.: spotlight.palavra=CLAUDIT)")
a = ap.parse_args()
if a.nome:
    cfg["nome"] = a.nome
    cfg.setdefault("nomeCompleto", a.nome.upper())
    if cfg["nomeCompleto"] == "SEU NOME COMPLETO": cfg["nomeCompleto"] = a.nome.upper()
if a.nome_completo: cfg["nomeCompleto"] = a.nome_completo.upper()
if a.perfil: cfg["perfil"] = a.perfil if a.perfil.startswith("@") else "@" + a.perfil
if a.grafico:
    cfg["grafico"] = [{"rotulo": r.rsplit(":", 1)[0].strip(), "valor": float(r.rsplit(":", 1)[1])} for r in a.grafico.split(",") if ":" in r]
for t in a.texto:
    chave, valor = t.split("=", 1)
    ef, campo = chave.split(".", 1)
    cfg.setdefault("textos", {}).setdefault(ef, {})[campo] = valor
p.write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + "\n")
print(f"config.json: {cfg['nome']} · {cfg['perfil']}")
