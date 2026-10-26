// Catálogo dos efeitos: nome do comando (/efeito <slug>), apelidos em português, o que faz e se depende do recorte
// da pessoa (máscara Vision do macOS). O CATALOGO.md e o SKILL.md seguem esta mesma lista.
import React from "react";
import { Checklist, Documentary, GlassWidgets, Kallaway, Orbit, Spotlight, Timeline } from "./efeitos/basicos";
import { CommentBox, CoverStar, HeadlineWall, Lineup, PastelWord, PhoneFan, RabbitHole, RedCollage, ShortcutRain, SplitHeadline } from "./efeitos/novos";

export type Efeito = { slug: string; apelidos: string[]; titulo: string; faz: string; recorte: boolean; component: React.FC };

export const CATALOGO: Efeito[] = [
  { slug: "glass-widgets", apelidos: ["vidro", "widgets"], titulo: "Widgets de vidro", faz: "Widgets de vidro fosco em volta da cabeça (contador, render, perfil, gráfico, música, anel 4K, agenda) + selo “Edited by Claude”.", recorte: false, component: GlassWidgets },
  { slug: "documentary", apelidos: ["documentario", "documentário"], titulo: "Documentário", faz: "Você em preto e branco sobre fundo magenta, disco rosa atrás da cabeça, palavras carimbadas, faixa com seu nome e Follow → Following.", recorte: true, component: Documentary },
  { slug: "orbit", apelidos: ["orbita", "órbita"], titulo: "Órbita", faz: "Capas dos seus reels girando em volta de você; as de trás passam por trás do seu corpo.", recorte: true, component: Orbit },
  { slug: "kallaway-split", apelidos: ["grafico", "gráfico", "split"], titulo: "Gráfico em cima", faz: "Papel quadriculado em cima com o gráfico animado dos seus 7 reels mais vistos; você num card embaixo.", recorte: false, component: Kallaway },
  { slug: "spotlight", apelidos: ["holofote", "neon"], titulo: "Holofote", faz: "Apaga a sala, deixa você iluminado e acende um letreiro neon atrás da sua cabeça.", recorte: true, component: Spotlight },
  { slug: "checklist", apelidos: ["lista"], titulo: "Checklist", faz: "Cartão de vidro escuro “Claude is editing your clip” marcando cada etapa da edição.", recorte: false, component: Checklist },
  { slug: "timeline", apelidos: ["linha-do-tempo", "editor"], titulo: "Linha do tempo", faz: "Janela de editor roxa (trilhas, legendas, cor, som) renderizando de 25% a 100%, com você embaixo.", recorte: false, component: Timeline },
  { slug: "lineup", apelidos: ["arco", "cards"], titulo: "Arco de cards", faz: "Arco de 21 cards numerados que abre atrás da sua cabeça.", recorte: true, component: Lineup },
  { slug: "shortcut-rain", apelidos: ["teclas", "chuva"], titulo: "Chuva de atalhos", faz: "Teclas de atalho (cmd, shift, C, V…) caem e quicam em volta de você.", recorte: false, component: ShortcutRain },
  { slug: "red-collage", apelidos: ["vermelho", "colagem"], titulo: "Colagem vermelha", faz: "Você em P&B com uma palavra vermelha gigante atrás e três frases carimbadas embaixo.", recorte: true, component: RedCollage },
  { slug: "comment-box", apelidos: ["comentario", "comentário", "cta"], titulo: "Caixa de comentário", faz: "Campo de comentário do Instagram digitando a sua palavra-chave, publicando e ganhando curtida — CTA pronto.", recorte: false, component: CommentBox },
  { slug: "cover-star", apelidos: ["capa", "revista"], titulo: "Capa de revista", faz: "Capa de revista: seu nome em vermelho gigante atrás da cabeça, chamada em itálico e código de barras.", recorte: true, component: CoverStar },
  { slug: "headline-wall", apelidos: ["manchetes", "parede"], titulo: "Parede de manchetes", faz: "Manchetes amarelas e brancas coladas atrás de você + selo com o total de views.", recorte: true, component: HeadlineWall },
  { slug: "phone-fan", apelidos: ["celulares", "leque"], titulo: "Leque de celulares", faz: "Quatro celulares com seus reels abrem em leque na sua frente, com frase no topo.", recorte: false, component: PhoneFan },
  { slug: "rabbit-hole", apelidos: ["tunel", "túnel", "molduras"], titulo: "Toca do coelho", faz: "Molduras brancas infinitas voando por trás de você, como um túnel.", recorte: true, component: RabbitHole },
  { slug: "pastel-word", apelidos: ["pastel", "palavra"], titulo: "Palavra pastel", faz: "Troca o fundo por lilás, sobe uma palavra gigante atrás de você e um card de perfil com Follow → Following.", recorte: true, component: PastelWord },
  { slug: "split-headline", apelidos: ["manchete", "titulo", "título"], titulo: "Manchete dividida", faz: "Manchete grande palavra por palavra em cima (com destaque verde) e você embaixo.", recorte: false, component: SplitHeadline },
];
