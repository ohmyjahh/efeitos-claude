// 10 efeitos novos, animados a partir das miniaturas da grade final do reel de referência ("+17 more effects").
// Mesmas regras: cabeça em job.head, textos trocáveis em config.json → "textos": { "<efeito>": { ... } }.
import React from "react";
import { Img, staticFile } from "remotion";
import { Capa, Clip, COND, Fill, ITAL, MONO, Person, SANS, SERIF, cl, eo, pop, useJob, useT, useTextos } from "../job";
import { Cursor, Destaque, SplitVideo } from "./basicos";

// ================================================================ lineup — arco de cards numerados atrás da cabeça
export const Lineup: React.FC = () => {
  const t = useT();
  const { head } = useJob();
  const T = useTextos("lineup", { rotulo: "effect" });
  const cards: { a: number; r: number; n: number }[] = [];
  for (let i = 0; i < 12; i++) cards.push({ a: -80 + (160 * i) / 11, r: 560, n: i + 1 });
  for (let i = 0; i < 9; i++) cards.push({ a: -66 + (132 * i) / 8, r: 380, n: 13 + i });
  const cy = head.cy + 70;
  return (
    <Fill>
      <Clip />
      {cards.map((c, k) => {
        const rad = (c.a * Math.PI) / 180;
        const e = eo((t - 0.15 - k * 0.035) / 0.25);
        const sway = Math.sin(t * 1.6 + k) * 2;
        return (
          <div key={c.n} style={{
            position: "absolute", left: head.x + c.r * Math.sin(rad) - 56, top: cy - c.r * Math.cos(rad) - 75, width: 112, height: 150, borderRadius: 14,
            background: "#1d1c1b", boxShadow: "0 8px 20px rgba(0,0,0,0.45)", color: "#fff", textAlign: "center", opacity: e,
            transform: `translateY(${(1 - e) * 120}px) rotate(${c.a + sway}deg) scale(${0.6 + 0.4 * e})`,
          }}>
            <div style={{ fontFamily: SERIF, fontSize: 64, lineHeight: "86px" }}>{String(c.n).padStart(2, "0")}</div>
            <div style={{ fontFamily: MONO, fontSize: 15, color: "#bbb" }}>{T.rotulo}</div>
          </div>
        );
      })}
      <Person />
    </Fill>
  );
};

// ================================================================ shortcut-rain — teclas de atalho caindo em volta
const TECLAS: [string, number, number, number][] = [["tab", 360, 210, -8], ["shift", 120, 400, 12], ["shift", 660, 330, -30], ["tab", 840, 110, 14], ["cmd", 960, 200, -12], ["opt", 800, 600, -20],
  ["⌥", 150, 690, 30], ["C", 920, 790, 8], ["V", 900, 1010, 20], ["cmd", 860, 1180, -6], ["esc", 980, 1800, -24], ["C", 960, 1600, 10], ["Z", 110, 1500, -14], ["⌘", 140, 1100, 18]];
export const ShortcutRain: React.FC = () => {
  const t = useT();
  const T = useTextos("shortcut-rain", { teclas: TECLAS.map((k) => k[0]) });
  const nomes = T.teclas as string[];
  return (
    <Fill>
      <Clip />
      {TECLAS.map(([, x, y, r], i) => {
        const at = 0.1 + (i % 7) * 0.09 + Math.floor(i / 7) * 0.05;
        const p = cl((t - at) / 0.45);
        const fall = p < 1 ? -1 + p * p : 0; // queda acelerada
        const bounce = p >= 1 ? Math.exp(-(t - at - 0.45) * 7) * Math.sin((t - at - 0.45) * 22) * 18 : 0;
        const drift = Math.sin(t * 1.3 + i) * 6;
        return (
          <div key={i} style={{
            position: "absolute", left: x - 70, top: y - 55 + fall * (y + 200) + bounce + drift, minWidth: 140, height: 110, padding: "0 18px", borderRadius: 22, background: "#fafafa",
            boxShadow: "0 10px 0 #cfcfcf, 0 18px 30px rgba(0,0,0,0.35)", transform: `rotate(${r + (1 - p) * 40}deg)`, opacity: p > 0 ? 1 : 0,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 42, color: "#333",
          }}>{nomes[i % nomes.length]}</div>
        );
      })}
    </Fill>
  );
};

// ================================================================ red-collage — P&B com palavra vermelha gigante atrás
export const RedCollage: React.FC = () => {
  const t = useT();
  const { head } = useJob();
  const T = useTextos("red-collage", { palavra: "EDIT", linhas: ["ONE CLIP.", "*34 EFFECTS.*", "ZERO APPS."] });
  const e = eo((t - 0.1) / 0.18);
  const linhas = T.linhas as string[];
  return (
    <Fill style={{ background: "#111" }}>
      <Clip style={{ filter: "grayscale(1) contrast(1.25) brightness(0.8)" }} />
      <div style={{ position: "absolute", left: -40, right: -40, top: Math.max(20, head.top - 380), textAlign: "center", fontFamily: COND, fontSize: 560, lineHeight: 1, color: "#e8181d", textShadow: "0 0 60px rgba(255,30,30,0.8)", opacity: e, transform: `scale(${1.25 - 0.25 * e})`, whiteSpace: "nowrap" }}>{T.palavra}</div>
      <Person style={{ filter: "grayscale(1) contrast(1.25) brightness(0.85)" }} />
      <div style={{ position: "absolute", left: 70, top: 1180, fontFamily: SANS, fontWeight: 900, fontSize: 132, lineHeight: "140px", color: "#fff", letterSpacing: -4, textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
        {linhas.map((l, i) => {
          const p = cl((t - 0.45 - i * 0.22) / 0.12);
          return <div key={i} style={{ opacity: p, transform: `scale(${1.3 - 0.3 * eo(p)})`, transformOrigin: "0 50%" }}><Destaque txt={l} cor="#ff2a2a" /></div>;
        })}
      </div>
    </Fill>
  );
};

// ================================================================ comment-box — a palavra-chave sendo comentada
export const CommentBox: React.FC = () => {
  const t = useT();
  const T = useTextos("comment-box", { palavra: "claude", voce: "you", publicar: "Post" });
  const palavra = T.palavra as string;
  const bar = eo((t - 0.15) / 0.2);
  const n = Math.round(palavra.length * cl((t - 0.45) / 0.6));
  const sent = t >= 1.25;
  const bub = eo((t - 1.3) / 0.2);
  const heart = cl((t - 1.75) / 0.15);
  return (
    <Fill>
      <Clip />
      {bub > 0 && (
        <div style={{ position: "absolute", left: 90, top: 1350, width: 560, height: 120, borderRadius: 28, background: "#fff", padding: "14px 30px", boxSizing: "border-box", fontFamily: SANS, opacity: bub, transform: `translateY(${60 * (1 - bub)}px)` }}>
          <div style={{ fontSize: 28, color: "#888" }}>{T.voce}</div>
          <div style={{ fontSize: 42, fontWeight: 600, color: "#111" }}>{palavra}</div>
          <div style={{ position: "absolute", right: 30, top: 34, fontSize: 52, color: heart > 0 ? "#ff3040" : "#bbb", transform: `scale(${1 + Math.sin(heart * Math.PI) * 0.6})` }}>♥</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 50, top: 1500, width: 980, height: 110, borderRadius: 55, background: "#fff", fontFamily: SANS, opacity: bar, transform: `translateY(${80 * (1 - bar)}px)` }}>
        <div style={{ position: "absolute", left: 22, top: 20, width: 70, height: 70, borderRadius: 35, background: "#e1306c" }} />
        <div style={{ position: "absolute", left: 120, top: 26, fontSize: 44, color: "#111" }}>{sent ? "" : palavra.slice(0, n)}{!sent && Math.floor(t * 3) % 2 === 0 && <span style={{ color: "#0095f6" }}>|</span>}</div>
        <div style={{ position: "absolute", right: 46, top: 32, fontSize: 38, color: n > 0 && !sent ? "#0095f6" : "#9fc5f8", fontWeight: 600 }}>{T.publicar}</div>
      </div>
      {!sent && <Cursor x={880 + 30 * (1 - cl((t - 0.9) / 0.3))} y={1560} s={t > 1.15 && t < 1.25 ? 0.9 : 1} />}
    </Fill>
  );
};

// ================================================================ cover-star — capa de revista com o seu nome atrás da cabeça
export const CoverStar: React.FC = () => {
  const t = useT();
  const j = useJob();
  const T = useTextos("cover-star", { edicao: "THE AI ISSUE", ano: String(new Date().getFullYear()), nome: j.config.nome.toUpperCase(), destaque: "34effects", linhas: "you can steal\nno editor\nneeded" });
  const nome = eo((t - 0.1) / 0.3);
  return (
    <Fill>
      <Clip />
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "space-between", padding: "0 90px", fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: "#fff", opacity: cl((t - 0.05) / 0.2) }}><span>{T.edicao}</span><span>{T.ano}</span></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: Math.max(30, j.head.top - 470) + (1 - nome) * -200, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: Math.min(460, 1900 / Math.max(3, (T.nome as string).length)), lineHeight: 1, color: "#e3262d", letterSpacing: -20, opacity: nome, whiteSpace: "nowrap" }}>{T.nome}</div>
      <Person />
      <div style={{ position: "absolute", left: 60, top: 1050, fontFamily: ITAL, fontSize: 120, color: "#f1d36b", ...pop(t, 0.5, 0.2), transformOrigin: "0 50%" }}>{T.destaque}</div>
      <div style={{ position: "absolute", left: 66, top: 1190, fontFamily: SANS, fontWeight: 700, fontSize: 64, lineHeight: "86px", color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.4)", whiteSpace: "pre", opacity: cl((t - 0.7) / 0.2) }}>{T.linhas}</div>
      <div style={{ position: "absolute", right: 70, top: 1640, width: 170, height: 150, background: "#fff", padding: 12, boxSizing: "border-box", display: "flex", gap: 4, opacity: cl((t - 0.9) / 0.2) }}>
        {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ width: [3, 6, 2, 8][i % 4], background: "#111" }} />)}
      </div>
    </Fill>
  );
};

// ================================================================ headline-wall — manchetes coladas atrás + selo de views
const POS = [[-30, 40, -4], [560, 0, 5], [20, 330, 3], [600, 360, -6], [-20, 640, -2], [620, 690, 4]];
export const HeadlineWall: React.FC = () => {
  const t = useT();
  const j = useJob();
  const total = (j.config.grafico ?? []).reduce((s, d) => s + d.valor, 0);
  const T = useTextos("headline-wall", {
    manchetes: ["I let Claude edit my reels", "One clip. 36 edits.", "No timeline. No app.", "Claude made this in 1 prompt", "Effects you can steal", "Zero editing apps"],
    numero: total ? `${(total / 1e6).toFixed(1)}M` : "672K", legenda: "views from 7 reels",
  });
  const manchetes = T.manchetes as string[];
  return (
    <Fill>
      <Clip />
      {manchetes.slice(0, POS.length).map((m, i) => {
        const [x, y, r] = POS[i];
        const p = eo((t - 0.1 - i * 0.13) / 0.18);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 520, padding: "26px 30px", borderRadius: 14, background: i % 3 === 1 ? "#fff" : "#ffd84a", transform: `rotate(${r}deg) scale(${1.4 - 0.4 * p})`, opacity: p, boxShadow: "0 12px 30px rgba(0,0,0,0.3)", fontFamily: SANS }}>
            <div style={{ fontSize: 50, fontWeight: 800, lineHeight: "56px", color: "#111" }}>{m}</div>
            <div style={{ fontSize: 24, marginTop: 10, color: "#555" }}>{j.config.perfil}</div>
          </div>
        );
      })}
      <Person />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1200, display: "flex", justifyContent: "center", ...pop(t, 0.95, 0.22) }}>
        <div style={{ height: 150, padding: "0 40px", borderRadius: 30, background: "#e2553f", display: "flex", alignItems: "center", gap: 22, color: "#fff", boxShadow: "0 12px 30px rgba(0,0,0,0.3)" }}>
          <span style={{ fontFamily: COND, fontSize: 104 }}>{T.numero}</span><span style={{ fontFamily: SANS, fontSize: 40, fontWeight: 600 }}>{T.legenda}</span>
        </div>
      </div>
    </Fill>
  );
};

// ================================================================ phone-fan — leque de celulares com seus reels
export const PhoneFan: React.FC = () => {
  const t = useT();
  const T = useTextos("phone-fan", { linha1: "34 effects.", linha2: "zero editing apps." });
  const abre = eo((t - 0.3) / 0.45);
  const sobe = eo((t - 0.1) / 0.3);
  return (
    <Fill>
      <Clip />
      <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 70, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.5)", ...pop(t, 0.05) }}>{T.linha1}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", ...pop(t, 0.18) }}>
        <div style={{ padding: "6px 22px", background: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 70, color: "#111" }}>{T.linha2}</div>
      </div>
      {[-20, -7, 7, 20].map((r, i) => (
        <div key={i} style={{
          position: "absolute", left: 540 - 120 + (i - 1.5) * 220 * abre, top: 1130 + (1 - sobe) * 700, width: 240, height: 470, borderRadius: 40, background: "#111", padding: 10, boxSizing: "border-box",
          transform: `rotate(${r * abre}deg)`, transformOrigin: "50% 120%", boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 30, overflow: "hidden" }}><Capa i={i + 1} /></div>
        </div>
      ))}
    </Fill>
  );
};

// ================================================================ rabbit-hole — molduras infinitas atrás de você
export const RabbitHole: React.FC = () => {
  const t = useT();
  const { head } = useJob();
  const fade = cl((t - 0.1) / 0.3);
  return (
    <Fill>
      <Clip />
      {Array.from({ length: 6 }, (_, k) => {
        const z = ((k / 6 + t * 0.22) % 1); // 0 = fundo, 1 = perto
        const s = 0.18 + Math.pow(z, 1.6) * 1.15;
        return (
          <div key={k} style={{
            position: "absolute", left: head.x - 480 * s, top: head.cy - 40 - 760 * s, width: 960 * s, height: 1520 * s,
            border: `${3 + 5 * z}px solid rgba(255,255,255,${0.95 * fade * cl(z * 4) * cl((1 - z) * 5)})`, transform: `rotate(${-8 + z * 6}deg)`, boxShadow: "0 0 18px rgba(0,0,0,0.25)",
          }} />
        );
      })}
      <Person />
    </Fill>
  );
};

// ================================================================ pastel-word — fundo pastel, palavra gigante atrás, card de perfil
export const PastelWord: React.FC = () => {
  const t = useT();
  const j = useJob();
  const T = useTextos("pastel-word", { palavra: "REELS", rotulo: "creator", seguir: "Follow", seguindo: "Following" });
  const bg = cl(t / 0.25);
  const w = eo((t - 0.2) / 0.35);
  const card = eo((t - 0.6) / 0.25);
  const seg = t >= 1.35;
  return (
    <Fill style={{ background: "linear-gradient(180deg,#c9bdf5,#ddd6fb)" }}>
      {/* sem recorte, o vídeo fica por baixo com um véu lilás */}
      <Clip style={{ opacity: j.hasMask ? 1 - bg : 1 }} />
      {!j.hasMask && <div style={{ position: "absolute", inset: 0, background: "rgba(201,189,245,0.45)" }} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: Math.max(120, j.head.top - 170) + (1 - w) * 160, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: Math.min(330, 1650 / Math.max(3, (T.palavra as string).length)), color: "#fff", letterSpacing: -12, opacity: w, whiteSpace: "nowrap" }}>{T.palavra}</div>
      <Person />
      <div style={{ position: "absolute", left: 60, top: 1640 + (1 - card) * 300, width: 960, height: 170, borderRadius: 30, background: "#fff", fontFamily: SANS, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
        <Img src={staticFile(j.avatar)} style={{ position: "absolute", left: 30, top: 40, width: 90, height: 90, borderRadius: 45, objectFit: "cover" }} />
        <div style={{ position: "absolute", left: 140, top: 40, fontSize: 40, fontWeight: 700, color: "#111" }}>{j.config.nome}</div>
        <div style={{ position: "absolute", left: 140, top: 92, fontSize: 28, color: "#888" }}>{j.config.perfil} · <span style={{ color: "#6d5bd0" }}>{T.rotulo}</span></div>
        <div style={{ position: "absolute", right: 34, top: 50, width: 210, height: 70, borderRadius: 16, background: seg ? "#efefef" : "#0095f6", color: seg ? "#777" : "#fff", fontSize: 30, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{seg ? T.seguindo : T.seguir}</div>
      </div>
      {card > 0.9 && <Cursor x={930 + 30 * (1 - cl((t - 0.9) / 0.35))} y={1710} s={t > 1.27 && t < 1.37 ? 0.9 : 1} />}
    </Fill>
  );
};

// ================================================================ split-headline — manchete em cima, você embaixo
export const SplitHeadline: React.FC = () => {
  const t = useT();
  const T = useTextos("split-headline", { palavras: ["Claude", "*edits*", "my", "reels."], selo: "in seconds ↗" });
  const p = eo((t - 0.1) / 0.2);
  const palavras = T.palavras as string[];
  const linhas = [[palavras[0]], palavras.slice(1, 3), palavras.slice(3)];
  let k = 0;
  return (
    <Fill style={{ background: "#f2f1ec" }}>
      <SplitVideo p={p} top={880} left={0} faceY={300} />
      <div style={{ position: "absolute", left: 0, top: 870, height: 8, width: 1080 * eo((t - 0.3) / 0.3), background: "#22c55e" }} />
      <div style={{ position: "absolute", left: 80, top: 120, fontFamily: SANS, fontWeight: 900, fontSize: 168, lineHeight: "200px", color: "#111", letterSpacing: -6, opacity: p }}>
        {linhas.map((l, li) => (
          <div key={li}>{l.map((w) => {
            const at = 0.3 + 0.16 * k++;
            const s = cl((t - at) / 0.12);
            const dest = w.startsWith("*");
            const txt = dest ? w.slice(1, -1) : w;
            const fim = txt.endsWith(".");
            return (
              <span key={w} style={{ display: "inline-block", marginRight: 34, opacity: s, transform: `translateY(${(1 - eo(s)) * 40}px)` }}>
                {dest ? <span style={{ background: "#22c55e", color: "#fff", borderRadius: 24, padding: "0 20px" }}>{txt}</span> : fim ? <>{txt.slice(0, -1)}<span style={{ color: "#22c55e" }}>.</span></> : txt}
              </span>
            );
          })}</div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 70, top: 920, padding: "8px 26px", borderRadius: 30, background: "#22c55e", fontFamily: SANS, fontWeight: 700, fontSize: 34, color: "#fff", ...pop(t, 1.0) }}>{T.selo}</div>
    </Fill>
  );
};
