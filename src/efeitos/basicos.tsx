// Os 7 efeitos do reel de referência (instagram.com/p/De7JFJdo4KX), genéricos: posição da cabeça vem da máscara
// (job.head) e todos os textos podem ser trocados em config.json → "textos": { "<efeito>": { ... } }.
import React from "react";
import { Img, staticFile } from "remotion";
import {
  Capa, Clip, COND, DIDONE, Fill, ITAL, MONO, MONT, ORANGE, Person, SANS, Spark, Still, cl, eo, fmtNum, pop, useJob, useT, useTextos,
} from "../job";

// "*palavra*" = destaque colorido
export const Destaque: React.FC<{ txt: string; cor: string }> = ({ txt, cor }) => (
  <>{txt.split(/(\*[^*]+\*)/).map((p, i) => (p.startsWith("*") ? <span key={i} style={{ color: cor }}>{p.slice(1, -1)}</span> : <React.Fragment key={i}>{p}</React.Fragment>))}</>
);

/** Vídeo que encolhe da tela cheia para o card de baixo (p 0→1), com o rosto na altura faceY do card. */
export const SplitVideo: React.FC<{ p: number; top: number; left?: number; faceY?: number }> = ({ p, top, left = 43, faceY = 330 }) => {
  const { head } = useJob();
  const w = 1080 - 2 * left, s1 = w / 1080;
  const l = (a: number, b: number) => a + (b - a) * p;
  const s = l(1, s1);
  const y1 = Math.min(0, faceY - head.cy * s1);
  return (
    <div style={{ position: "absolute", left: l(0, left), top: l(0, top), width: l(1080, w), height: l(1920, 1920 - top + 40), borderRadius: l(0, 64), overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: l(0, y1), width: 1080, height: 1920, transform: `scale(${s})`, transformOrigin: "0 0" }}><Clip /></div>
    </div>
  );
};
export const PAPEL: React.CSSProperties = {
  background: "#f3eee7",
  backgroundImage: "linear-gradient(rgba(170,150,120,0.13) 2px, transparent 2px), linear-gradient(90deg, rgba(170,150,120,0.13) 2px, transparent 2px)",
  backgroundSize: "54px 54px",
};

// ================================================================ glass-widgets
const vidro: React.CSSProperties = {
  position: "absolute", borderRadius: 46, background: "rgba(255,255,255,0.17)", backdropFilter: "blur(22px) saturate(150%)",
  border: "2px solid rgba(255,255,255,0.38)", boxShadow: "0 10px 40px rgba(0,0,0,0.18)", color: "#fff", fontFamily: SANS, overflow: "hidden",
  textShadow: "0 1px 6px rgba(0,0,0,0.18)",
};
const Caixa: React.FC<{ x: number; y: number; w: number; h: number; t: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, t, at, children, style }) => (
  <div style={{ ...vidro, left: x, top: y, width: w, height: h, ...pop(t, at), ...style }}>{children}</div>
);
const Bola: React.FC<{ c?: string }> = ({ c = "#ff4f4f" }) => <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 7, background: c, marginRight: 10, verticalAlign: "middle" }} />;

export const GlassWidgets: React.FC = () => {
  const t = useT() - 0.15;
  const j = useJob();
  const top = j.config.grafico?.[0]?.valor;
  const T = useTextos("glass-widgets", {
    marca: "Claude", numero: "36", numeroLegenda: "effects\none clip", render: "Rendering", topReels: "Top reels", topValor: top ? fmtNum(top) : "197K",
    agora: "NOW EDITING", faixa: "soft UI pops", faixaSub: "sfx · 25.7s", anel: "4K", anelLegenda: "render", tarefa: "Post 2 reels", selo: "Edited by *Claude*",
  });
  const render = Math.min(96, Math.round(78 + t * 14));
  const ring = Math.min(0.96, 0.55 + t * 0.3);
  const bars = [1, 0.7, 0.62, 0.4, 0.3, 0.22, 0.18];
  return (
    <Fill>
      <Clip />
      <Caixa x={54} y={119} w={292} h={291} t={t} at={0}>
        <div style={{ position: "absolute", left: 30, top: 26, fontSize: 26 }}><Bola />{T.marca}</div>
        <div style={{ position: "absolute", left: 26, top: 58, fontSize: 116, fontWeight: 700, letterSpacing: -3 }}>{T.numero}</div>
        <div style={{ position: "absolute", left: 30, top: 200, fontSize: 26, lineHeight: "32px", opacity: 0.92, whiteSpace: "pre" }}>{T.numeroLegenda}</div>
      </Caixa>
      <Caixa x={633} y={123} w={393} h={141} t={t} at={0.03}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 28 }}><Bola />{T.render}</div>
        <div style={{ position: "absolute", left: 28, top: 76, width: 337, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.3)" }}>
          <div style={{ width: `${render}%`, height: "100%", borderRadius: 5, background: "#fff" }} />
        </div>
        <div style={{ position: "absolute", left: 28, top: 98, fontSize: 19, opacity: 0.9 }}>{`4K render · ${render}%`}</div>
      </Caixa>
      <Caixa x={633} y={302} w={393} h={141} t={t} at={0.06}>
        <div style={{ position: "absolute", left: 30, top: 32, fontSize: 32, fontWeight: 700 }}>{j.config.nome}</div>
        <div style={{ position: "absolute", left: 30, top: 80, fontSize: 19, opacity: 0.9 }}>{j.config.perfil}</div>
        <Img src={staticFile(j.avatar)} style={{ position: "absolute", right: 26, top: 30, width: 82, height: 82, borderRadius: 41, objectFit: "cover", border: "2px solid rgba(255,255,255,0.6)" }} />
      </Caixa>
      <Caixa x={54} y={454} w={255} h={313} t={t} at={0.09} style={{ borderRadius: 34 }}>
        <div style={{ position: "absolute", left: 24, top: 16, fontFamily: MONO, fontSize: 15, opacity: 0.85 }}>artifact · views.html</div>
        <div style={{ position: "absolute", left: 12, top: 52, right: 12, bottom: 12, borderRadius: 22, background: "#fbfaf8", color: "#1d1d1b", textShadow: "none" }}>
          <div style={{ position: "absolute", left: 18, top: 16, display: "flex", gap: 7 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />)}
          </div>
          <div style={{ position: "absolute", left: 18, top: 42, fontSize: 25, fontWeight: 700 }}>{T.topReels}</div>
          <div style={{ position: "absolute", left: 18, top: 72, fontSize: 40, fontWeight: 800, color: "#d83b3b", letterSpacing: -1 }}>{T.topValor}</div>
          <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: 86, display: "flex", alignItems: "flex-end", gap: 9 }}>
            {bars.map((b, i) => <div key={i} style={{ flex: 1, height: `${b * 100 * cl(t * 3 + 0.3)}%`, borderRadius: 3, background: i === 0 ? "#f0c24f" : "#d83b3b" }} />)}
          </div>
        </div>
      </Caixa>
      <Caixa x={676} y={464} w={350} h={206} t={t} at={0.12} style={{ borderRadius: 34 }}>
        <div style={{ position: "absolute", left: 120, top: 26, fontFamily: MONO, fontSize: 15, opacity: 0.85, letterSpacing: 1 }}>{T.agora}</div>
        <div style={{ position: "absolute", left: 26, top: 30, width: 76, height: 76, borderRadius: 18, background: "#e5533d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 58, fontWeight: 300 }}>✳</div>
        <div style={{ position: "absolute", left: 120, top: 52, fontSize: 28, fontWeight: 700 }}>{T.faixa}</div>
        <div style={{ position: "absolute", left: 120, top: 88, fontSize: 19, opacity: 0.9 }}>{T.faixaSub}</div>
        <div style={{ position: "absolute", left: 26, right: 26, top: 128, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.3)" }}>
          <div style={{ width: `${cl(0.3 + t * 0.12) * 100}%`, height: "100%", background: "#fff", borderRadius: 3 }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 148, display: "flex", justifyContent: "center", gap: 46, fontSize: 30 }}><span>⏮</span><span>▶</span><span>⏭</span></div>
      </Caixa>
      <Caixa x={784} y={702} w={242} h={248} t={t} at={0.15}>
        <svg width={170} height={170} style={{ position: "absolute", left: 36, top: 18 }}>
          <circle cx={85} cy={85} r={68} stroke="rgba(255,255,255,0.25)" strokeWidth={13} fill="none" />
          <circle cx={85} cy={85} r={68} stroke="#2fd158" strokeWidth={13} fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 68 * ring} 999`} transform="rotate(-90 85 85)" />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 74, textAlign: "center", fontSize: 50, fontWeight: 700 }}>{T.anel}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 20, opacity: 0.9 }}>{T.anelLegenda}</div>
      </Caixa>
      <Caixa x={54} y={799} w={212} h={173} t={t} at={0.18} style={{ borderRadius: 34 }}>
        <div style={{ position: "absolute", left: 22, top: 18, fontSize: 21, fontWeight: 700, color: "#ff5a52" }}>{j.dia.semana}</div>
        <div style={{ position: "absolute", left: 20, top: 40, fontSize: 56, fontWeight: 700 }}>{j.dia.numero}</div>
        <div style={{ position: "absolute", left: 20, top: 118, padding: "5px 12px", borderRadius: 8, background: "#e5484d", fontSize: 18, fontWeight: 600 }}>{T.tarefa}</div>
      </Caixa>
      <div style={{
        position: "absolute", left: 140, right: 140, top: 1631, display: "flex", justifyContent: "center", ...pop(t, 0.5, 0.2),
      }}>
        <div style={{ height: 108, padding: "0 52px", borderRadius: 54, background: "rgba(30,30,30,0.32)", backdropFilter: "blur(18px)", border: "2px solid rgba(255,255,255,0.32)", display: "flex", alignItems: "center", fontFamily: SANS, fontSize: 43, color: "#fff", whiteSpace: "pre" }}>
          <Destaque txt={T.selo} cor="#e48a62" />
        </div>
      </div>
    </Fill>
  );
};

// ================================================================ documentary
const ROSA = "#ff3f8e";
const slam = (t: number, at: number): React.CSSProperties => {
  const p = cl((t - at) / 0.13);
  if (p <= 0) return { opacity: 0 };
  const e = eo(p);
  return { opacity: 0.45 + 0.55 * e, transform: `scale(${1.5 - 0.5 * e})`, transformOrigin: "0% 60%" };
};
export const Cursor: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg width={46} height={66} viewBox="0 0 23 33" style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "0 0" }}>
    <path d="M1 1 L1 25 L7 19.5 L11 29 L15 27.3 L11 18 L19 18 Z" fill="#111" stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" />
  </svg>
);
/** Reenquadra para a cabeça ficar em (hx, hy), com escala mínima que ainda cobre a tela. */
export const reframe = (head: { x: number; cy: number }, hx: number, hy: number, min = 1.25) => {
  const s = Math.min(2.2, Math.max(min, (1080 - hx) / Math.max(1, 1080 - head.x), (1920 - hy) / Math.max(1, 1920 - head.cy), hx / Math.max(1, head.x)));
  const tx = Math.min(0, Math.max(1080 - 1080 * s, hx - s * head.x));
  const ty = Math.min(0, Math.max(1920 - 1920 * s, hy - s * head.cy));
  return { s, tx, ty, hx: tx + s * head.x, hy: ty + s * head.cy, css: { transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" } as React.CSSProperties };
};

export const Documentary: React.FC = () => {
  const t = useT();
  const j = useJob();
  const T = useTextos("documentary", {
    serie: "A NON-TECHNICAL *AI* SERIES · DAILY", linhas: ["ONE *CLIP.*", "36 EFFECTS.", "*ZERO* APPS."], fantasma: "EVERY\nDAY",
    seguir: "Follow", seguindo: "Following",
  });
  if (t < 0.12) return <Fill><Clip /></Fill>;
  const fr = reframe(j.head, 300, 864, 1.3);
  const flash = t < 0.2 ? 1 : cl(1 - (t - 0.2) / 0.25);
  const dark = cl((t - 0.28) / 0.17);
  const bright = 0.55 + 1.3 * flash * (1 - dark);
  const contrast = 1.25 - 0.6 * flash;
  const ui = t >= 0.45, following = t >= 1.38, press = t >= 1.3 && t < 1.42 ? 0.92 : 1;
  const linhas = T.linhas as string[];
  return (
    <Fill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: 130, width: 1080, height: 1663, overflow: "hidden", background: "#12060f" }}>
        <div style={{ position: "absolute", left: 0, top: -130, width: 1080, height: 1920 }}>
          <div style={{ position: "absolute", inset: 0, ...fr.css, filter: `grayscale(1) contrast(${contrast}) brightness(${bright * (1 - 0.35 * dark)})` }}><Clip /></div>
          <div style={{ position: "absolute", inset: 0, opacity: dark, background: "radial-gradient(120% 80% at 75% 15%, rgba(120,20,80,0.55) 0%, rgba(40,6,32,0.82) 50%, rgba(14,3,12,0.92) 100%)" }} />
          <div style={{ position: "absolute", left: fr.hx - 300, top: fr.hy - 300, width: 600, height: 600, borderRadius: 300, opacity: 0.15 + 0.85 * dark, background: "radial-gradient(circle, #ff2a8c 0%, #e81f7d 42%, rgba(220,30,120,0.55) 58%, rgba(200,20,110,0) 72%)" }} />
          <div style={{ position: "absolute", left: fr.hx - 318, top: fr.hy - 318, width: 636, height: 636, borderRadius: 318, border: "3px solid rgba(255,80,160,0.35)", opacity: dark }} />
          <div style={{ position: "absolute", right: -40, top: 1290, fontFamily: COND, fontSize: 230, lineHeight: "220px", textAlign: "right", color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.16)", opacity: dark, whiteSpace: "pre" }}>{T.fantasma}</div>
          <div style={{ position: "absolute", inset: 0, ...fr.css, filter: `grayscale(1) contrast(${contrast * 1.05}) brightness(${bright * 1.08})` }}><Person /></div>
        </div>
      </div>
      {ui && (
        <>
          <div style={{ position: "absolute", left: 60, top: 168, fontFamily: MONT, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: "#fff" }}><Destaque txt={T.serie} cor={ROSA} /></div>
          <div style={{ position: "absolute", left: 568, top: 392, width: 700, fontFamily: COND, fontSize: 118, lineHeight: "119px", color: "#fff", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.35)", transform: "scaleX(0.74)", transformOrigin: "0 0" }}>
            {linhas.map((l, i) => <div key={i} style={slam(t, [0.58, 0.78, 1.08][i] ?? 1.08 + 0.25 * (i - 2))}><Destaque txt={l} cor={ROSA} /></div>)}
          </div>
          <div style={{ position: "absolute", left: 594, top: 1080, width: 367, height: 104, borderRadius: 24, transform: `scale(${press})`, background: following ? "#f4f4f4" : "#1d9bf0", color: following ? "#111" : "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}>{following ? T.seguindo : T.seguir}</div>
          <Cursor x={853 + 40 * (1 - cl((t - 0.45) / 0.8))} y={1150 + 30 * (1 - cl((t - 0.45) / 0.8))} s={press} />
          <div style={{ position: "absolute", left: 0, top: 1518, height: 74, padding: "0 40px 0 62px", background: "#e2287c", display: "flex", alignItems: "center", fontFamily: MONT, fontWeight: 800, fontSize: 38, letterSpacing: 3, color: "#fff", transform: `translateX(${-60 * (1 - cl((t - 0.45) / 0.12))}px)` }}>{j.config.nomeCompleto}</div>
          <div style={{ position: "absolute", left: 64, top: 1612, fontFamily: MONT, fontWeight: 500, fontSize: 30, color: "#fff" }}>{j.config.perfil}</div>
        </>
      )}
    </Fill>
  );
};

// ================================================================ orbit
const ORBITA_Y = [-150, 400, 10, 550, -210, 250, 80, 490];
export const Orbit: React.FC = () => {
  const t = useT();
  const { head } = useJob();
  const W0 = 225, H0 = 400;
  const card = (i: number) => {
    const th = (i / 8) * Math.PI * 2 + 0.55 * t + 0.4;
    const depth = Math.cos(th);
    const enter = cl((t - 0.2 - i * 0.02) / 0.16);
    return { i, x: head.x + 410 * Math.sin(th), y: head.cy + ORBITA_Y[i], depth, enter, s: (0.8 + 0.24 * depth) * (0.6 + 0.4 * eo(enter)), rot: -Math.sin(th) * 28 };
  };
  const cards = Array.from({ length: 8 }, (_, i) => card(i)).sort((a, b) => a.depth - b.depth);
  const draw = (c: ReturnType<typeof card>) => c.enter > 0 && (
    <div key={c.i} style={{ position: "absolute", left: c.x - W0 / 2, top: c.y - H0 / 2, width: W0, height: H0, borderRadius: 20, overflow: "hidden", opacity: c.enter, transform: `perspective(1400px) scale(${c.s}) rotateY(${c.rot}deg)`, boxShadow: "0 14px 34px rgba(0,0,0,0.38)", border: "2px solid rgba(255,255,255,0.5)", background: "#111" }}>
      <Capa i={c.i} />
    </div>
  );
  return (
    <Fill>
      <Clip />
      {cards.filter((c) => c.depth < 0).map(draw)}
      <Person />
      {cards.filter((c) => c.depth >= 0).map(draw)}
    </Fill>
  );
};

// ================================================================ kallaway-split
const PADRAO_GRAFICO = [["Data", 197e3], ["Data 2", 139e3], ["Scroll", 121e3], ["Resume", 76e3], ["Fable", 41e3], ["Jev", 26e3], ["LinkedIn", 15e3]].map(([r, v]) => ({ rotulo: r as string, valor: v as number }));
const passo = (v: number) => { const p = Math.pow(10, Math.floor(Math.log10(v))); return [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= v) ?? 10 * p; };
export const Kallaway: React.FC = () => {
  const t = useT();
  const j = useJob();
  const T = useTextos("kallaway-split", { titulo: "My top 7 reels", por: "by", destaque: "views", media: "avg" });
  const dados = (j.config.grafico?.length ? j.config.grafico : PADRAO_GRAFICO).slice(0, 7);
  const max = Math.max(...dados.map((d) => d.valor));
  const st = passo(max / 4), top = st * 4, Y0 = 816, PH = 447;
  const yOf = (v: number) => Y0 - (v / top) * PH;
  const media = dados.reduce((s, d) => s + d.valor, 0) / dados.length;
  const n = dados.length, x0 = 194, dx = (959 - 194) / Math.max(1, n - 1);
  const p = eo((t - 0.3) / 0.15);
  if (p <= 0) return <Fill><Clip /></Fill>;
  const avg = cl((t - 1.15) / 0.15);
  return (
    <Fill style={PAPEL}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 972, opacity: p, transform: `translateY(${-80 * (1 - p)}px)` }}>
        <div style={{ position: "absolute", left: 65, top: 112, fontFamily: SANS, fontWeight: 800, fontSize: 56, color: "#1b1917", letterSpacing: -1 }}>{T.titulo}</div>
        <div style={{ position: "absolute", left: 65, top: 182, fontFamily: SANS, fontWeight: 800, fontSize: 56, color: "#1b1917", letterSpacing: -1 }}>
          {T.por} <span style={{ fontFamily: ITAL, fontWeight: 400, fontSize: 66, color: "#c9473b", borderBottom: "4px solid #c9473b", letterSpacing: 0 }}>{T.destaque}</span>
        </div>
        {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "absolute", right: 1080 - 140, top: yOf(k * st) - 14, fontFamily: MONO, fontSize: 22, color: "#9b948a" }}>{k ? fmtNum(k * st) : "0"}</div>)}
        {dados.map((b, i) => {
          const g = eo((t - 0.45 - i * 0.06) / 0.45), v = b.valor * g, y = yOf(v), x = x0 + i * dx;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x - 39, top: y, width: 78, height: Y0 - y, background: i === 0 ? "#e9c35b" : "#c9473b", borderRadius: "4px 4px 0 0" }} />
              {g > 0.05 && <div style={{ position: "absolute", left: x - 80, width: 160, top: y - (i === 0 ? 66 : 56), textAlign: "center", fontFamily: COND, fontSize: i === 0 ? 54 : 44, color: "#1b1917" }}>{fmtNum(g >= 0.999 ? b.valor : v)}</div>}
              <div style={{ position: "absolute", left: x - 80, width: 160, top: 832, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 22, color: "#2a2724" }}>{b.rotulo}</div>
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 150, width: 870 * avg, top: yOf(media), borderTop: "3px dashed #d0493c", opacity: avg }} />
        <div style={{ position: "absolute", right: 58, top: yOf(media) - 34, fontFamily: MONO, fontSize: 22, color: "#d0493c", opacity: avg }}>{`${T.media} ${fmtNum(media)}`}</div>
      </div>
      <SplitVideo p={p} top={972} />
    </Fill>
  );
};

// ================================================================ spotlight
export const Spotlight: React.FC = () => {
  const t = useT();
  const { head } = useJob();
  const T = useTextos("spotlight", { palavra: "CLAUDIT" });
  const d = cl((t - 0.3) / 0.3);
  const on = t < 0.3 ? 0 : t < 0.36 ? 0.5 : t < 0.42 ? 0.15 : t < 0.48 ? 0.8 : t < 0.52 ? 0.4 : 1;
  return (
    <Fill style={{ background: "#000" }}>
      <Clip style={{ filter: `brightness(${1 - 0.7 * d}) sepia(${0.35 * d}) saturate(${1 - 0.2 * d})` }} />
      <div style={{
        position: "absolute", left: 0, right: 0, top: Math.max(60, head.top - 80), textAlign: "center", fontFamily: DIDONE, fontStyle: "italic", fontWeight: 600, fontSize: 200,
        lineHeight: 1, letterSpacing: -4, color: "#ffc2cd", opacity: on, transform: "scaleX(0.82)", WebkitTextStroke: "2px #ffe9ed", whiteSpace: "nowrap",
        textShadow: "0 0 6px #ff8aa5, 0 0 18px #ff4f7e, 0 0 42px #ff2d6a, 0 0 80px rgba(255,45,106,0.6)",
      }}>{T.palavra}</div>
      <Person style={{ filter: `brightness(${1 - 0.1 * d}) sepia(${0.12 * d})` }} />
      <div style={{ position: "absolute", inset: 0, opacity: d, background: "radial-gradient(60% 45% at 50% 50%, rgba(0,0,0,0) 40%, rgba(10,5,0,0.55) 100%)" }} />
    </Fill>
  );
};

// ================================================================ checklist
export const Checklist: React.FC = () => {
  const t = useT();
  const T = useTextos("checklist", {
    titulo: "Claude is editing your clip", de: "of",
    linhas: [["Found your face", "every frame"], ["Cut you out of the room", "AI mask"], ["Put the text behind you", "depth"], ["Graded the colour", "warm"], ["Rendered in 4K", "2160p"]],
  });
  const linhas = T.linhas as string[][];
  const done = [0.5, 0.9, 1.15, 1.4, 1.65].slice(0, linhas.length).filter((c) => t >= c).length;
  const enter = cl((t - 0.22) / 0.15);
  return (
    <Fill>
      <Clip />
      <div style={{ position: "absolute", left: 58, top: 1026, width: 964, height: 134 + linhas.length * 104, borderRadius: 36, background: "rgba(26,25,23,0.74)", backdropFilter: "blur(20px)", border: "1.5px solid rgba(255,255,255,0.13)", fontFamily: SANS, opacity: enter, transform: `translateY(${40 * (1 - enter)}px)` }}>
        <Spark size={34} style={{ position: "absolute", left: 36, top: 44 }} />
        <div style={{ position: "absolute", left: 84, top: 36, fontSize: 41, fontWeight: 700, color: "#fff" }}>{T.titulo}</div>
        <div style={{ position: "absolute", right: 38, top: 44, fontSize: 28, color: "#a5a198" }}>{`${Math.max(1, done)} ${T.de} ${linhas.length}`}</div>
        <div style={{ position: "absolute", left: 36, right: 36, top: 112, height: 2, background: "rgba(255,255,255,0.1)" }} />
        {linhas.map(([label, tag], i) => {
          const ok = i < done, cur = i === done;
          return (
            <div key={i} style={{ position: "absolute", left: 36, right: 38, top: 150 + i * 104, height: 60 }}>
              {ok ? (
                <div style={{ position: "absolute", left: 0, top: 6, width: 48, height: 48, borderRadius: 24, background: "#34c759", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={30} height={30} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              ) : <div style={{ position: "absolute", left: 0, top: 6, width: 48, height: 48, borderRadius: 24, border: "3px solid rgba(255,255,255,0.42)", boxSizing: "border-box" }} />}
              <div style={{ position: "absolute", left: 76, top: 4, fontSize: 41, fontWeight: 700, color: ok || cur ? "#fff" : "#8e8a83" }}>{label}</div>
              <div style={{ position: "absolute", right: 0, top: 14, fontFamily: MONO, fontSize: 28, color: ok ? "#3ddc84" : "#8e8a83" }}>{tag}</div>
            </div>
          );
        })}
      </div>
    </Fill>
  );
};

// ================================================================ timeline
const ONDA = Array.from({ length: 120 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.31)));
const PINK = "#ff6fa8";
export const Timeline: React.FC = () => {
  const t = useT();
  const j = useJob();
  const T = useTextos("timeline", {
    titulo: "Claude *renders it*", janela: "CLAUDITING · RENDER", qualidade: "4K · 30FPS",
    linhas: [["cut", "pauses removed"], ["captions", "words synced"], ["grade", "dusk · face lift"], ["effects", "36 loaded"], ["sound", "soft UI pops"]],
    legendas: ["one clip", "36 effects", "zero apps"], cores: ["dusk base", "moody · face lift"],
  });
  const win = cl((t - 0.25) / 0.12);
  if (win <= 0) return <Fill><Clip /></Fill>;
  const p = eo((t - 0.35) / 0.15);
  const pct = 25 + 75 * cl((t - 0.45) / 1.1);
  const x0 = 136, span = 814, ph = x0 + (span * pct) / 100;
  const faixa = (y: number, label: string) => <div style={{ position: "absolute", left: 20, top: y, fontFamily: MONO, fontSize: 15, color: "#b88db8", letterSpacing: 1 }}>{label}</div>;
  const dur = j.duration, mm = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const leg = T.legendas as string[], cores = T.cores as string[];
  return (
    <Fill style={{ background: p > 0 ? "#efe8df" : "transparent" }}>
      <SplitVideo p={p} top={976} left={39} faceY={300} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", opacity: p, fontFamily: SANS, fontWeight: 800, fontSize: 60, color: "#1b1917", letterSpacing: -1 }}>
        {(T.titulo as string).split(/(\*[^*]+\*)/).map((s, i) => s.startsWith("*") ? <span key={i} style={{ fontFamily: ITAL, fontWeight: 400, fontSize: 66, color: ORANGE, letterSpacing: 0 }}>{s.slice(1, -1)}</span> : <React.Fragment key={i}>{s}</React.Fragment>)}
      </div>
      <div style={{ position: "absolute", left: 54, top: 201, width: 972, height: 637, borderRadius: 24, overflow: "hidden", background: "linear-gradient(180deg,#2e1535,#22102a)", border: "2px solid #5b2c5f", boxShadow: "0 18px 50px rgba(40,10,40,0.35)", opacity: win, transform: `scale(${0.9 + 0.1 * win})` }}>
        <div style={{ position: "absolute", left: 24, top: 22, display: "flex", gap: 9 }}>{[1, 0.7, 0.45].map((o) => <span key={o} style={{ width: 13, height: 13, borderRadius: 7, background: PINK, opacity: o }} />)}</div>
        <div style={{ position: "absolute", left: 96, top: 17, fontFamily: MONO, fontWeight: 700, fontSize: 19, color: "#ff8fbf", letterSpacing: 1 }}>{T.janela}</div>
        <div style={{ position: "absolute", right: 24, top: 17, fontFamily: MONO, fontWeight: 700, fontSize: 19, color: "#ffb0d2" }}>{T.qualidade}</div>
        <div style={{ position: "absolute", left: 22, top: 66, width: 148, height: 262, borderRadius: 10, overflow: "hidden" }}>
          <Still name={j.stills[1] ?? j.stills[0]} />
          <div style={{ position: "absolute", left: 6, bottom: 6, padding: "2px 6px", borderRadius: 4, background: "rgba(0,0,0,0.6)", fontFamily: MONO, fontSize: 14, color: "#fff" }}>{`${mm(dur * pct / 100)} / ${mm(dur)}`}</div>
        </div>
        {(T.linhas as string[][]).map(([k, v], i) => (
          <div key={i} style={{ position: "absolute", left: 192, right: 22, top: 70 + i * 49.5, height: 44, borderBottom: "1px solid rgba(255,255,255,0.07)", fontFamily: MONO, fontSize: 19 }}>
            <span style={{ position: "absolute", left: 14, top: 10, color: "#c9a3c6" }}>{k}</span>
            {pct > 22 + i * 14 && <span style={{ position: "absolute", right: 10, top: 10, color: "#ffd5e7" }}>✓ {v}</span>}
          </div>
        ))}
        <div style={{ position: "absolute", left: 194, width: 692, top: 322, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.1)" }}><div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: PINK }} /></div>
        {faixa(372, "V1 TAKE")}{faixa(430, "CAPTIONS")}{faixa(489, "GRADE")}{faixa(547, "SFX")}
        <div style={{ position: "absolute", left: x0, top: 356, width: span, height: 50, display: "flex", gap: 4 }}>
          {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "relative", flex: 1, borderRadius: 5, overflow: "hidden" }}><Still name={j.stills[i % j.stills.length]} style={{ objectPosition: "50% 35%" }} /></div>)}
        </div>
        {leg.slice(0, 3).map((s, i) => <div key={i} style={{ position: "absolute", left: [142, 410, 608][i], width: [250, 180, 192][i], top: 420, height: 30, borderRadius: 6, background: "#f27cae", fontFamily: MONO, fontSize: 14, color: "#5a1033", paddingLeft: 10, lineHeight: "30px", overflow: "hidden", whiteSpace: "nowrap" }}>{s}</div>)}
        <div style={{ position: "absolute", left: 142, width: 378, top: 479, height: 30, borderRadius: 6, background: "linear-gradient(90deg,#6c3fd0,#e0569e)", fontFamily: MONO, fontSize: 14, color: "#fff", paddingLeft: 10, lineHeight: "30px" }}>{cores[0]}</div>
        <div style={{ position: "absolute", left: 538, width: 292, top: 479, height: 30, borderRadius: 6, background: "linear-gradient(90deg,#f06aa0,#f6a06a)", fontFamily: MONO, fontSize: 14, color: "#5a1033", paddingLeft: 10, lineHeight: "30px" }}>{cores[1]}</div>
        <div style={{ position: "absolute", left: x0, top: 535, width: span, height: 40, display: "flex", alignItems: "center", gap: 2.8 }}>
          {ONDA.map((h, i) => <div key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 1, background: i / ONDA.length < pct / 100 ? "#ffa5cb" : "rgba(255,165,203,0.45)" }} />)}
        </div>
        <div style={{ position: "absolute", left: ph - 1.5, top: 346, width: 3, height: 240, background: "#ff3d8b", boxShadow: "0 0 10px #ff3d8b" }} />
        <div style={{ position: "absolute", left: ph - 9, top: 340, width: 18, height: 14, borderRadius: 3, background: "#ff3d8b" }} />
        <div style={{ position: "absolute", left: 22, width: 738, top: 604, height: 9, borderRadius: 5, background: "rgba(255,255,255,0.1)" }}><div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: PINK }} /></div>
        <div style={{ position: "absolute", right: 24, top: 580, fontFamily: SANS, fontWeight: 800, fontSize: 38, color: PINK }}>{`${Math.round(pct)}%`}</div>
      </div>
    </Fill>
  );
};
