import SDKManager from "../SDKManager";
import { ResultState } from "../SDKConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RecorderComp extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    private isRunning: boolean = false;
    start() {
        this.node.active = SDKManager.getChannel().hasRecorder()
        if (this.node.active) {
            this.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this)
        }

    }

    // update (dt) {}

    onButtonClick() {
        if (!this.isRunning) {
            SDKManager.getChannel().recorderStart()
            this.label.string = "录屏分享"
            this.isRunning = true;
        } else {
            this.isRunning = false;
            this.label.string = "屏幕录制"
            SDKManager.getChannel().recorderStop()
            SDKManager.getChannel().showShare(0, (result: ResultState) => {
                SDKManager.getChannel().showToast('录频分享结果：' + result)
            }, true)
        }
    }
}
