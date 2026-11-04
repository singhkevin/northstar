// Cut the salient object out of a still image with Apple Vision; writes a PNG with alpha.
import Foundation
import Vision
import CoreImage
import AppKit
let a = CommandLine.arguments
guard a.count >= 3 else { print("usage: cut <in.jpg> <out.png>"); exit(1) }
guard let img = CIImage(contentsOf: URL(fileURLWithPath: a[1])) else { print("no image"); exit(1) }
let req = VNGenerateForegroundInstanceMaskRequest()
let h = VNImageRequestHandler(ciImage: img, options: [:])
try h.perform([req])
guard let obs = req.results?.first, !obs.allInstances.isEmpty else { print("no subject"); exit(2) }
let maskPB = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: h)
let mask = CIImage(cvPixelBuffer: maskPB)
let f = CIFilter(name: "CIBlendWithMask")!
f.setValue(img, forKey: kCIInputImageKey)
f.setValue(CIImage(color: .clear).cropped(to: img.extent), forKey: kCIInputBackgroundImageKey)
f.setValue(mask, forKey: kCIInputMaskImageKey)
let out = f.outputImage!
let ctx = CIContext()
let cg = ctx.createCGImage(out, from: img.extent)!
let rep = NSBitmapImageRep(cgImage: cg)
try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
print("ok", cg.width, cg.height)
