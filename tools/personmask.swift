// Gera máscara de pessoa (Vision) para um vídeo e escreve frames L8 crus no stdout.
// Uso: personmask <video> <inicio_s> <duracao_s> <largura> <altura> [accurate|balanced]
import AVFoundation
import CoreImage
import Foundation
import Vision

let a = CommandLine.arguments
guard a.count >= 6 else {
  FileHandle.standardError.write("uso: personmask video inicio dur w h [accurate|balanced]\n".data(using: .utf8)!)
  exit(2)
}
let url = URL(fileURLWithPath: a[1])
let start = Double(a[2])!, dur = Double(a[3])!
let outW = Int(a[4])!, outH = Int(a[5])!
let quality: VNGeneratePersonSegmentationRequest.QualityLevel = (a.count > 6 && a[6] == "balanced") ? .balanced : .accurate

let asset = AVURLAsset(url: url)
let sem = DispatchSemaphore(value: 0)
var videoTrack: AVAssetTrack?
Task {
  videoTrack = try? await asset.loadTracks(withMediaType: .video).first
  sem.signal()
}
sem.wait()
guard let track = videoTrack else { FileHandle.standardError.write("sem trilha de vídeo\n".data(using: .utf8)!); exit(1) }

let reader = try! AVAssetReader(asset: asset)
let timescale: CMTimeScale = 600
if dur > 0 {
  reader.timeRange = CMTimeRange(start: CMTime(seconds: start, preferredTimescale: timescale), duration: CMTime(seconds: dur, preferredTimescale: timescale))
}
let output = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
output.alwaysCopiesSampleData = false
reader.add(output)
reader.startReading()

let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = quality
request.outputPixelFormat = kCVPixelFormatType_OneComponent8
let seq = VNSequenceRequestHandler()
let ctx = CIContext(options: [.workingColorSpace: NSNull(), .outputColorSpace: NSNull()])
var buf = [UInt8](repeating: 0, count: outW * outH)
let out = FileHandle.standardOutput
var n = 0
let t0 = Date()
while let sample = output.copyNextSampleBuffer() {
  guard let pb = CMSampleBufferGetImageBuffer(sample) else { continue }
  autoreleasepool {
    do {
      try seq.perform([request], on: pb)
      if let mask = request.results?.first?.pixelBuffer {
        let ci = CIImage(cvPixelBuffer: mask)
        let sx = CGFloat(outW) / ci.extent.width, sy = CGFloat(outH) / ci.extent.height
        let scaled = ci.transformed(by: CGAffineTransform(scaleX: sx, y: sy))
        buf.withUnsafeMutableBytes { p in
          ctx.render(scaled, toBitmap: p.baseAddress!, rowBytes: outW, bounds: CGRect(x: 0, y: 0, width: outW, height: outH), format: .L8, colorSpace: nil)
        }
      } else {
        for i in 0..<buf.count { buf[i] = 0 }
      }
    } catch {
      FileHandle.standardError.write("erro Vision: \(error)\n".data(using: .utf8)!)
    }
    out.write(Data(buf))
  }
  n += 1
  if n % 150 == 0 {
    FileHandle.standardError.write("frames: \(n) (\(String(format: "%.1f", Double(n) / Date().timeIntervalSince(t0))) fps)\n".data(using: .utf8)!)
  }
}
FileHandle.standardError.write("total frames: \(n) em \(String(format: "%.1f", Date().timeIntervalSince(t0)))s\n".data(using: .utf8)!)
