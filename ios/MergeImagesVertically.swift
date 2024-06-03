import Foundation
import UIKit

@objc(ImagesMerge)
class ImagesMerge: NSObject {

    @objc
    func mergeImages(_ imagesData: NSArray, callback: @escaping RCTResponseSenderBlock) {
        DispatchQueue.main.async {
            var images = [UIImage]()
            for imgDict in imagesData as! [NSDictionary] {
                let img = imgDict["uri"] as! String
                if img.contains("data:image/png;base64,") {
                    images.append(UIImage(data: Data(base64Encoded: img.replacingOccurrences(of: "data:image/png;base64,", with: ""))!)!)
                }
            }

            // Calculate the final image size
            let totalWidth = images.map { $0.size.width }.max() ?? 0
            let totalHeight = images.reduce(0) { $0 + ($1.size.height * (totalWidth / $1.size.width)) }
            let size = CGSize(width: totalWidth, height: totalHeight)

            UIGraphicsBeginImageContext(size)
            var lastPos: CGFloat = 0

            for img in images {
                let aspectRatio = totalWidth / img.size.width
                let height = img.size.height * aspectRatio
                img.draw(in: CGRect(x: 0, y: lastPos, width: totalWidth, height: height))
                lastPos += height
            }

            let myImage = UIGraphicsGetImageFromCurrentImageContext()
            let imgDt = myImage!.pngData()!

            UIGraphicsEndImageContext()
            callback([imgDt.base64EncodedString()])
        }
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
