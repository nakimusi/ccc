import BaseScrennshot from "../base/BaseScreenshot";
import TextureRenderUtils from "../../engine/TextureRenderUtils";

export default class OppoScreenshot extends BaseScrennshot {
    showImage(_tempFilePath) {
        this.channel.previewImage(_tempFilePath)
    }

    createImage() {
        console.log(' createImage ')
        let canvas = this.getCanvas()
        let texture = TextureRenderUtils.instance().getTexture()
        let width = texture.width;
        let height = texture.height;
        let bytes = new Uint8Array(width * height * 4);
        texture.readPixels(bytes);
        let data = {
            data: bytes,
            width: canvas.width,
            height: canvas.height,
            fileType: 'png',
            reverse: true,
        }
        return data;
    }

    saveFile(data, show: boolean) {

        if (qg.saveImageTempSync) {
            // https://cdofs.oppomobile.com/cdo-activity/static/201810/26/quickgame/documentation/media/image.html?h=saveImageToPhotosAlbum
            let _tempFilePath = qg.saveImageTempSync(data)
            console.log('_tempFilePath ', _tempFilePath)
            qg.saveImageToPhotosAlbum({
                filePath: _tempFilePath,
                success: () => {
                    console.log(`save success` + _tempFilePath)
                    if (show) {
                        this.showImage(_tempFilePath)
                    }
                },
                fail: function (data, code) {
                    console.log(`handling fail, code = ${code}`)
                }
            })
        }

    }
}