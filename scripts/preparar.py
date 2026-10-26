# Prepara um vídeo para os efeitos: trabalhos/<id>/ com
#   clip.mp4 (1080×1920, 30 fps, BT.709) · audio.m4a · mask.mkv + person.webm (só a pessoa, se houver personmask)
#   stills/ (8 quadros) · avatar.jpg · capas/ (opcional) · job.json (cabeça medida, duração, config)
#   e, se o vídeo for HDR (HLG/PQ do iPhone), raw/ e black/ para a saída HDR (scripts/hdr.py).
# Uso: .venv/bin/python3 scripts/preparar.py <video> [--capas PASTA] [--id NOME] [--refazer] [--so-config]
import argparse, datetime, json, platform, re, shutil, subprocess, sys
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("--capas", help="pasta com capas dos seus reels (jpg/png), usadas em orbit, phone-fan…")
ap.add_argument("--id")
ap.add_argument("--refazer", action="store_true")
ap.add_argument("--so-config", action="store_true", help="só atualiza a config no job.json")
a = ap.parse_args()

src = Path(a.video).expanduser().resolve()
vid = a.id or re.sub(r"[^A-Za-z0-9_-]+", "-", src.stem)
work = ROOT / "trabalhos" / vid
work.mkdir(parents=True, exist_ok=True)

def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)
def ff(*args):
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args])
def probe(entries, path=src, stream="v:0"):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", stream, "-show_entries", entries, "-of", "default=nw=1:nk=1", str(path)], capture_output=True, text=True).stdout
    return out.strip().splitlines()
def fresh(p):
    return a.refazer or not p.exists() or p.stat().st_size == 0

cfg_path = ROOT / "config.json" if (ROOT / "config.json").exists() else ROOT / "config.exemplo.json"
config = json.loads(cfg_path.read_text())
job_path = work / "job.json"
if a.so_config:
    job = json.loads(job_path.read_text()); job["config"] = config
    job_path.write_text(json.dumps(job, ensure_ascii=False, indent=1)); print("config atualizada:", job_path); sys.exit(0)

if not src.exists():
    sys.exit(f"vídeo não encontrado: {src}")
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(src)], capture_output=True, text=True).stdout.strip())
trc = (probe("stream=color_transfer") or [""])[0]
hdr = trc in ("arib-std-b67", "smpte2084")
has_audio = bool(probe("stream=codec_name", stream="a:0"))
FIT = "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,fps=30"
TAG709 = ["-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709"]
print(f"• {src.name}: {dur:.1f}s{' · HDR ' + trc if hdr else ''}{'' if has_audio else ' · sem áudio'}")

# ---------------------------------------------------------------- vídeo de trabalho (tela) + áudio
clip = work / "clip.mp4"
if fresh(clip):
    conv = ",colorspace=all=bt709:iall=bt2020:itrc=bt2020-10:iprimaries=bt2020:ispace=bt2020nc:format=yuv420p" if hdr else ""
    ff("-i", str(src), "-an", "-vf", f"{FIT}{conv},format=yuv420p", "-c:v", "libx264", "-preset", "fast", "-crf", "15", "-g", "15", *TAG709, "-movflags", "+faststart", str(clip))
if has_audio and fresh(work / "audio.m4a"):
    ff("-i", str(src), "-vn", "-c:a", "aac", "-b:a", "192k", str(work / "audio.m4a"))
if hdr:
    (work / "raw").mkdir(exist_ok=True); (work / "black").mkdir(exist_ok=True)
    if fresh(work / "raw/clip.mp4"):  # códigos HLG/PQ crus, rotulados BT.709 para o Chrome não converter nada
        ff("-i", str(src), "-an", "-vf", f"{FIT},format=yuv420p,setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv",
           "-c:v", "libx264", "-preset", "fast", "-crf", "10", "-g", "15", *TAG709, str(work / "raw/clip.mp4"))
    if fresh(work / "black/clip.mp4"):
        ff("-f", "lavfi", "-i", f"color=c=black:s=1080x1920:r=30:d={dur:.3f}", "-vf", "format=yuv420p", "-c:v", "libx264", "-crf", "18", *TAG709, str(work / "black/clip.mp4"))

# ---------------------------------------------------------------- recorte da pessoa (Vision, macOS)
pm = ROOT / "tools/personmask"
mask = work / "mask.mkv"
has_mask = pm.exists() and platform.system() == "Darwin"
if has_mask and fresh(mask):
    print("• recortando a pessoa (Vision)…")
    p1 = subprocess.Popen([str(pm), str(clip), "0", f"{dur:.3f}", "1080", "1920", "accurate"], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", "1080x1920", "-r", "30", "-i", "-", "-c:v", "ffv1", str(mask)], stdin=p1.stdout)
    p1.wait()
def person(base, out, rate):
    if fresh(out):
        ff("-i", str(base), "-i", str(mask), "-filter_complex", "[1:v]gblur=sigma=1.2,format=gray[m];[0:v][m]alphamerge,format=yuva420p[o]", "-map", "[o]", "-an",
           "-c:v", "libvpx", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0", "-b:v", rate, "-deadline", "realtime", "-cpu-used", "8", str(out))
if has_mask:
    person(clip, work / "person.webm", "6M")
    if hdr:
        person(work / "raw/clip.mp4", work / "raw/person.webm", "6M")
        person(work / "black/clip.mp4", work / "black/person.webm", "300k")

# ---------------------------------------------------------------- cabeça (mediana dos quadros da máscara)
head = {"x": 540, "top": 560, "cy": 760, "w": 400}
if has_mask:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mask), "-vf", "fps=2,scale=270:480", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8)
    fr = fr[: len(fr) // (270 * 480) * 270 * 480].reshape(-1, 480, 270) > 128
    tops, xs, ws = [], [], []
    for m in fr:
        rows = np.where(m.any(1))[0]
        if not len(rows):
            continue
        top = rows[0]
        r = np.where(m[min(479, top + 70)])[0]
        if len(r) < 10:
            continue
        tops.append(top * 4); xs.append(r.mean() * 4); ws.append((r.max() - r.min()) * 4)
    if tops:
        t, x, w = float(np.median(tops)), float(np.median(xs)), float(np.median(ws))
        head = {"x": round(x), "top": round(t), "cy": round(t + w / 2), "w": round(w)}
print(f"• cabeça: x {head['x']} · topo {head['top']} · centro {head['cy']} · largura {head['w']}")

# ---------------------------------------------------------------- quadros fixos, avatar, capas
(work / "stills").mkdir(exist_ok=True)
stills = []
for k in range(8):
    tt = dur * (k + 0.5) / 8
    name = f"stills/s_{k + 1}.jpg"; stills.append(name)
    if fresh(work / name):
        ff("-ss", f"{tt:.3f}", "-i", str(clip), "-frames:v", "1", "-q:v", "3", str(work / name))
    if hdr:
        for v in ("raw", "black"):
            (work / v / "stills").mkdir(exist_ok=True)
            if fresh(work / v / name):
                ff("-ss", f"{tt:.3f}", "-i", str(work / v / "clip.mp4"), "-frames:v", "1", "-q:v", "2", str(work / v / name))
side = int(head["w"] * 1.25)
cx, cy = head["x"] - side // 2, head["cy"] - side // 2
cx, cy = max(0, min(1080 - side, cx)), max(0, min(1920 - side, cy))
ff("-i", str(work / stills[len(stills) // 2]), "-vf", f"crop={side}:{side}:{cx}:{cy},scale=200:200", "-q:v", "3", str(work / "avatar.jpg"))
capas = []
if a.capas:
    cdir = work / "capas"; shutil.rmtree(cdir, ignore_errors=True); cdir.mkdir()
    imgs = sorted(p for p in Path(a.capas).expanduser().iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"))[:12]
    for i, p in enumerate(imgs):
        ff("-i", str(p), "-vf", "scale=540:960:force_original_aspect_ratio=increase,crop=540:960", "-q:v", "3", str(cdir / f"{i + 1:02d}.jpg"))
        capas.append(f"capas/{i + 1:02d}.jpg")
elif (work / "capas").exists():
    capas = sorted(f"capas/{p.name}" for p in (work / "capas").glob("*.jpg"))
shutil.copy(ROOT / "assets/spark.svg", work / "spark.svg")

hoje = datetime.date.today()
job = {"id": vid, "source": str(src), "duration": round(dur, 3), "hdr": hdr, "hasMask": has_mask, "hasAudio": has_audio, "head": head,
       "stills": stills, "capas": capas, "avatar": "avatar.jpg", "dia": {"semana": hoje.strftime("%a").upper()[:3], "numero": hoje.day}, "config": config}
job_path.write_text(json.dumps(job, ensure_ascii=False, indent=1))
print(f"pronto: {work}")
