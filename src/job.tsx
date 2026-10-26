// Dados do vídeo preparado (trabalhos/<id>/job.json, gerado por scripts/preparar.sh) + peças comuns dos efeitos.
// O Remotion roda com --public-dir apontando para a pasta do trabalho: clip.mp4, person.webm, stills/, capas/, job.json.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadNews } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInstr } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadBodoni } from "@remotion/google-fonts/BodoniModa";

export const W = 1080, H = 1920, FPS = 30;
export const SANS = loadInter("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const MONO = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const SERIF = loadNews("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const COND = loadAnton("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const MONT = loadMont("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const ITAL = loadInstr("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const DIDONE = loadBodoni("italic", { weights: ["500", "600"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const ORANGE = "#d97757";

export type Head = { x: number; top: number; cy: number; w: number };
export type Ponto = { rotulo: string; valor: number };
export type Config = {
  nome: string;          // "Rafa"
  nomeCompleto: string;  // "RAFA GRANDI"
  perfil: string;        // "@rafa.grandi"
  grafico?: Ponto[];     // kallaway-split: seus 7 reels mais vistos
  textos?: Record<string, Record<string, unknown>>; // textos por efeito (sobrescrevem os padrões de src/textos.ts)
};
export type Job = {
  id: string; duration: number; hasMask: boolean;
  head: Head;            // cabeça medida na máscara (px de 1080×1920): centro x, topo, centro y, largura
  stills: string[];      // quadros do próprio vídeo (stills/s_N.jpg) — servem de capa quando não há capas/
  capas: string[];       // capas de reels (capas/NN.jpg) para orbit, phone-fan, headline-wall…
  avatar: string;        // avatar.jpg (rosto recortado do vídeo ou foto do usuário)
  dia: { semana: string; numero: number };
  config: Config;
};
export type Variant = "sdr" | "raw" | "black";
export type EfeitoProps = { job?: Job; variant?: Variant };

const JobCtx = createContext<Job | null>(null);
const VariantCtx = createContext<Variant>("sdr");
export const JobProvider: React.FC<{ job: Job; variant: Variant; children: React.ReactNode }> = ({ job, variant, children }) => (
  <JobCtx.Provider value={job}><VariantCtx.Provider value={variant}>{children}</VariantCtx.Provider></JobCtx.Provider>
);
export const useJob = () => {
  const j = useContext(JobCtx);
  if (!j) throw new Error("job.json não carregado");
  return j;
};
/** Arquivo do vídeo na variante atual. HDR: "raw" = códigos HLG/PQ crus, "black" = vídeo preto (scripts/hdr.py). */
export const useFile = () => {
  const v = useContext(VariantCtx);
  return (rel: string) => staticFile(v === "sdr" ? rel : `${v}/${rel}`);
};
export const useT = () => useCurrentFrame() / FPS;

/** Textos do efeito: padrões + config.textos[efeito]. */
export function useTextos<T extends Record<string, unknown>>(efeito: string, padrao: T): T {
  const j = useJob();
  return { ...padrao, ...((j.config.textos?.[efeito] as Partial<T>) ?? {}) };
}

const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H };
export const Clip: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const f = useFile();
  return <OffthreadVideo src={f("clip.mp4")} muted style={{ ...FULL, objectFit: "cover", ...style }} />;
};
/** Só a pessoa recortada (máscara Vision do macOS). Sem máscara não desenha nada: o que seria "atrás" fica na frente. */
export const Person: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const j = useJob();
  const f = useFile();
  if (!j.hasMask) return null;
  return <OffthreadVideo src={f("person.webm")} muted transparent style={{ ...FULL, ...style }} />;
};
/** Quadro fixo do vídeo (stills/s_N.jpg) — segue a variante HDR. */
export const Still: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) => {
  const f = useFile();
  return <Img src={f(name)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", ...style }} />;
};
/** Capa de reel (interface: não muda entre variantes). */
export const Capa: React.FC<{ i: number; style?: React.CSSProperties }> = ({ i, style }) => {
  const j = useJob();
  const lista = j.capas.length ? j.capas : j.stills;
  return <Img src={staticFile(lista[i % lista.length])} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
};

export const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const eo = (v: number) => 1 - Math.pow(1 - cl(v), 3);
export const pop = (t: number, at: number, dur = 0.18): React.CSSProperties => {
  const p = cl((t - at) / dur);
  const s = 1 - Math.pow(1 - p, 3);
  return { opacity: p, transform: `scale(${0.82 + 0.18 * s + Math.sin(p * Math.PI) * 0.04})` };
};
export const Fill: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ width: W, height: H, overflow: "hidden", ...style }}>{children}</AbsoluteFill>
);
export const Spark: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile("spark.svg")} style={{ width: size, height: size, ...style }} />
);
export const fmtNum = (v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(1).replace(/\.0$/, "")}M` : v >= 1e3 ? `${Math.round(v / 1e3)}K` : `${Math.round(v)}`);
