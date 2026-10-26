---
name: efeito
description: Aplica um efeito de vídeo pronto (17 no catálogo — glass-widgets, documentary, orbit, kallaway-split, spotlight, checklist, timeline, lineup, shortcut-rain, red-collage, comment-box, cover-star, headline-wall, phone-fan, rabbit-hole, pastel-word, split-headline) num vídeo vertical de quem fala para a câmera, com um único comando. Use quando a pessoa digitar /efeito <nome> ou pedir "coloca o efeito X no meu vídeo", "edita esse reel com o efeito Y", "quais efeitos existem".
argument-hint: <efeito> [caminho do vídeo]
---

# /efeito — um clipe, vários efeitos, zero app de edição

A pessoa escreve `/efeito <nome>` e manda o vídeo (caminho ou arquivo arrastado no chat). Você prepara o vídeo,
aplica o efeito e devolve o arquivo pronto, com o áudio original. Tudo roda nesta pasta (a pasta deste SKILL.md,
normalmente `~/.claude/skills/efeito`). Chame-a de `SKILL_DIR` e rode todos os comandos a partir dela.

## Catálogo (nome do comando → o que faz)

| comando | apelidos | o que faz | recorte* |
|---|---|---|---|
| `glass-widgets` | vidro, widgets | widgets de vidro fosco em volta da cabeça + selo “Edited by Claude” | – |
| `documentary` | documentario | P&B sobre magenta, disco rosa atrás da cabeça, palavras carimbadas, Follow → Following | sim |
| `orbit` | orbita | capas dos seus reels girando em volta de você | sim |
| `kallaway-split` | grafico, split | gráfico animado dos seus 7 reels mais vistos em cima, você embaixo | – |
| `spotlight` | holofote, neon | apaga a sala e acende um neon atrás da sua cabeça | sim |
| `checklist` | lista | cartão “Claude is editing your clip” marcando cada etapa | – |
| `timeline` | linha-do-tempo, editor | janela de editor renderizando de 25% a 100%, você embaixo | – |
| `lineup` | arco, cards | arco de 21 cards numerados atrás da cabeça | sim |
| `shortcut-rain` | teclas, chuva | teclas de atalho caindo e quicando em volta | – |
| `red-collage` | vermelho, colagem | P&B com palavra vermelha gigante atrás + 3 frases | sim |
| `comment-box` | comentario, cta | campo de comentário digitando a palavra-chave (CTA) | – |
| `cover-star` | capa, revista | capa de revista com seu nome gigante atrás da cabeça | sim |
| `headline-wall` | manchetes, parede | manchetes coladas atrás + selo de views | sim |
| `phone-fan` | celulares, leque | leque de 4 celulares com seus reels | – |
| `rabbit-hole` | tunel, molduras | molduras infinitas voando por trás de você | sim |
| `pastel-word` | pastel, palavra | fundo lilás, palavra gigante atrás, card de perfil | sim |
| `split-headline` | manchete, titulo | manchete palavra por palavra em cima, você embaixo | – |

\* “recorte” = usa a máscara da pessoa para pôr coisas ATRÁS dela (macOS). Fora do macOS o efeito funciona, mas o
que seria atrás fica na frente. Detalhes, prévias e todos os textos editáveis: `CATALOGO.md`.

## Passo a passo

1. **Instalação.** Se `SKILL_DIR/node_modules` não existir, rode `bash setup.sh` (uma vez; leva ~1 min).
2. **Qual efeito.** Sem nome, ou com “lista”/“catálogo”: mostre a tabela acima e pergunte qual. Apelido → use o
   comando da tabela. Nome desconhecido: sugira o mais parecido.
3. **Qual vídeo.** Caminho na mensagem ou arquivo anexado. Sem vídeo: peça. Vale qualquer formato; vídeo
   horizontal é recortado para 9:16 pelo centro (avise a pessoa).
4. **Nome e @ (uma vez).** Se `config.json` ainda tem “Seu Nome”/“@seuperfil” e o efeito mostra nome ou @
   (glass-widgets, documentary, cover-star, pastel-word, headline-wall), pergunte e grave:
   `.venv/bin/python3 scripts/configurar.py --nome "Nome" --perfil @perfil`.
   `kallaway-split`: se o gráfico ainda é o de exemplo, pergunte os 7 reels mais vistos (nome curto + views) e grave
   com `--grafico "Rótulo:views,Rótulo:views,…"` — ou siga com o exemplo se a pessoa preferir.
5. **Preparar o vídeo** (uma vez por vídeo; refaz só o que falta):
   `.venv/bin/python3 scripts/preparar.py "<vídeo>" [--capas <pasta com capas dos reels>]`
   Mostra o `id` do trabalho, a duração, se é HDR e a posição da cabeça. `--capas` só importa para orbit,
   phone-fan e headline-wall; sem capas, eles usam quadros do próprio vídeo.
6. **Renderizar:** `bash scripts/renderizar.sh <efeito> <id>`
   Vídeo HDR do iPhone sai HDR (`saidas/<id>-<efeito>.mov`, HLG); os outros saem `saidas/<id>-<efeito>.mp4`.
   `--sdr` força SDR. `--frames 0-90` renderiza só um trecho (prévia rápida).
7. **Entregar:** diga o caminho do arquivo e ofereça ajustar textos. Cada efeito tem campos em
   `config.json → "textos": { "<efeito>": { "<campo>": "…" } }` (lista em `CATALOGO.md`); depois de editar,
   rode o passo 6 de novo (não precisa preparar outra vez). Em textos, `*palavra*` sai destacada na cor do efeito.

## Regras

- Um efeito por vez; vários efeitos no mesmo vídeo = vários renders (o preparo é reaproveitado).
- Não invente números de views: use os que a pessoa der, ou deixe o exemplo e avise que é exemplo.
- Erros comuns: `npx remotion` sem `node_modules` → rode o setup; vídeo sem rosto visível → a posição da cabeça
  fica no padrão (centro); sem `tools/personmask` → efeitos “atrás” ficam na frente (avise, não é falha).
