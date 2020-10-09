import SDKManager from "../SDKManager";
import { ResultState } from "../SDKConfig";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class ShareComp extends cc.Component {

    @property
    adSite: number = 0;

    @property({
        type: cc.Component.EventHandler,
        displayName: "回调函数"
    })
    callback = new cc.Component.EventHandler();

    start() {
        let hasShare = SDKManager.hasShare();
        if (hasShare) {
            this.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this)
        } else {
            this.node.active = hasShare
        }

    }

    onButtonClick() {
        SDKManager.getChannel().showShare(this.adSite, (result: ResultState) => {
            this.callback.emit([result])
        });
    }

}
