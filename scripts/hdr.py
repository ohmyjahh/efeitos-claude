# Saída HDR (HLG / BT.2020 / 10 bits) de um efeito, com o vídeo nos códigos HLG originais do iPhone.
# Entrada: dois renders ProRes 4444 do mesmo efeito — variant "raw" (vídeo com os códigos HLG crus, sem conversão)
# e variant "black" (vídeo preto). Por pixel:
#   vídeo     = raw − black   (só a contribuição do vídeo, já com escala/filtros/transparências do efeito)
#   interface = black com as cores levadas de BT.709 para BT.2020 e o branco em 90% do sinal HLG
#   saída     = vídeo + interface, em Y'CbCr BT.2020 de 10 bits
# O Chrome decodifica o vídeo cru com a matriz BT.709; reaplicar a mesma matriz na diferença devolve os códigos originais.
# Uso: .venv/bin/python3 scripts/hdr.py <raw.mov> <black.mov> <saida.mov>
import platform, subprocess, sys
import numpy as np

RAW, BLACK, OUT = sys.argv[1:4]
W, H, FPS = 1080, 1920, 30
M709_2020 = np.array([[0.6274, 0.3293, 0.0433], [0.0691, 0.9195, 0.0114], [0.0164, 0.0880, 0.8956]], np.float32)

def reader(path):
    # o ProRes do Remotion sai sem rótulo de cor e codificado com a matriz BT.601 (conferido nas cores das barras)
    tag = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=color_space", "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip()
    m = "bt709" if tag == "bt709" else "bt601"
    return subprocess.Popen(["ffmpeg", "-v", "error", "-i", path, "-vf", f"scale=in_color_matrix={m}:in_range=tv,format=rgb48le",
                             "-f", "rawvideo", "-pix_fmt", "rgb48le", "-"], stdout=subprocess.PIPE)

# Interface no mesmo espaço de código do vídeo HLG (como no pipeline HDR do legendador, overlays a ~0,9): cores BT.709 →
# BT.2020 em luz linear e branco da interface = BRANCO do sinal HLG (0,9 ≈ 520 nits). Assim texto sobre o vídeo continua
# mais claro que o vídeo, como no design SDR; o branco de referência estrito (0,75 / 203 nits) deixava o texto apagado.
BRANCO = 0.9

def hlg_ui(rgb):
    lin = np.power(rgb, 2.4) @ M709_2020.T
    return BRANCO * np.power(np.clip(lin, 0, 1), 1 / 2.4)

def ycc(rgb, kr, kb):
    y = kr * rgb[..., 0] + (1 - kr - kb) * rgb[..., 1] + kb * rgb[..., 2]
    return y, (rgb[..., 2] - y) / (2 * (1 - kb)), (rgb[..., 0] - y) / (2 * (1 - kr))

enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "yuv444p16le", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                        *(["-vf", "format=p010le", "-c:v", "hevc_videotoolbox", "-profile:v", "main10", "-b:v", "45M"] if platform.system() == "Darwin"
                          else ["-vf", "format=yuv420p10le", "-c:v", "libx265", "-crf", "16", "-x265-params", "colorprim=bt2020:transfer=arib-std-b67:colormatrix=bt2020nc"]),
                        "-tag:v", "hvc1", "-bsf:v", "hevc_metadata=colour_primaries=9:transfer_characteristics=18:matrix_coefficients=9:video_full_range_flag=0",
                        "-color_primaries", "bt2020", "-color_trc", "arib-std-b67", "-colorspace", "bt2020nc", "-color_range", "tv", OUT],
                       stdin=subprocess.PIPE)
r1, r2 = reader(RAW), reader(BLACK)
n, size = 0, W * H * 6
while True:
    a, b = r1.stdout.read(size), r2.stdout.read(size)
    if len(a) < size or len(b) < size:
        break
    raw = np.frombuffer(a, np.uint16).reshape(H, W, 3).astype(np.float32) / 65535
    blk = np.frombuffer(b, np.uint16).reshape(H, W, 3).astype(np.float32) / 65535
    vy, vb, vr = ycc(raw - blk, 0.2126, 0.0722)              # vídeo: diferença na matriz em que o Chrome decodificou
    uy, ub, ur = ycc(hlg_ui(blk), 0.2627, 0.0593)             # interface: HLG BT.2020
    y = np.clip(64 + 876 * (vy + uy), 64, 940)
    cb = np.clip(512 + 896 * (vb + ub), 64, 960)
    cr = np.clip(512 + 896 * (vr + ur), 64, 960)
    enc.stdin.write((np.stack([y, cb, cr]) * 64).round().astype(np.uint16).tobytes())
    n += 1
enc.stdin.close()
enc.wait()
print(f"ok {n} quadros → {OUT}")
