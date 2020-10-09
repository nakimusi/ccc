import SDKManager from "../SDKManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScreenshotComponent extends cc.Component {


    start () {
        this.node.active = SDKManager.getChannel().hasScreenshot()
        if(this.node.active){
            this.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this)
        }
    }

    onButtonClick(){
        SDKManager.getChannel().showScreenshot()    
    }
    // update (dt) {}
}
