import BaseScrennshot from "../base/BaseScreenshot";


export default class QQScreenshot extends BaseScrennshot {

    
    showImage(_tempFilePath) {
        this.channel.previewImage(_tempFilePath)
    }

    createImage() {
        console.log(' createImage ')
        let canvas = this.getCanvas()
        let data = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            // destination file sizes
            destWidth: canvas.width,
            destHeight: canvas.height,
            fileType: 'png',
            quality: 1
        }
        return data;
    }

    saveFile(data, show: boolean) {
        console.log(' saveFile data ',data,show)
        let canvas = this.getCanvas()
        if (canvas.toTempFilePathSync) {
            // https://developers.weixin.qq.com/minigame/dev/api/render/canvas/Canvas.toTempFilePathSync.html
            let _tempFilePath = canvas.toTempFilePathSync(data);
            console.log(' _tempFilePath ',_tempFilePath)
            qq.saveImageToPhotosAlbum({
                filePath: _tempFilePath,
                success: (res) => {
                    console.log(`Capture file success!${_tempFilePath}`, res);
                    // self.label = '图片加载完成，等待本地预览';
                    // https://developers.weixin.qq.com/minigame/dev/api/media/image/wx.previewImage.html
                    if (show) {
                        this.showImage(_tempFilePath)
                    }
                },
            })


        }


    }

}
