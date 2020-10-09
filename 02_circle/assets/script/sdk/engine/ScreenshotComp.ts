import TextureRenderUtils from "./TextureRenderUtils";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ScreenshotComp extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null;

    @property(cc.Node)
    renderNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        TextureRenderUtils.instance().init(this.camera,this.renderNode)
    }

    // update (dt) {}
}
