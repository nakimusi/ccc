import SDKManager from "../SDKManager";
import { ResultState } from "../SDKConfig";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class RewardAdComp extends cc.Component {

    //广告位索引
    @property
    adSite: number = 0;


    @property({
        type: cc.Component.EventHandler,
        displayName: "回调函数"
    })
    callback = new cc.Component.EventHandler();

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this)
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onButtonClick, this)
    }

    onButtonClick() {
        SDKManager.getChannel().showRewardAd(this.adSite, (result: ResultState) => {
            this.callback.emit([result])
        });
    }

}
