
import BaseChannel from "./BaseChannel";
import TextureRenderUtils from "../../engine/TextureRenderUtils";

export default class BaseScrennshot {
    protected channel: BaseChannel;

    constructor(channel: BaseChannel) {
        this.channel = channel;
    }
    capture(show:boolean = true) {
        // create the capture
        // setTimeout(() => {
        // console.log(' CaptureOppo capture ')
        TextureRenderUtils.instance().createCanvas();
        // console.log(' CaptureOppo createCanvas ', canvas)
        // let img = this.createImg();
        // console.log(' CaptureOppo capture img ',img)
        this.saveFile(this.createImage(), show);
        // }, 1000);
    }

    getCanvas(){
        return  TextureRenderUtils.instance().getCanvas()
    }

    showImage(img: any) {

    }

    createImage() {

    }

    saveFile(data, show: boolean) {

    }

}
