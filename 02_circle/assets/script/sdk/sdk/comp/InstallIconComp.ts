import SDKManager from "../SDKManager";
import { ResultState } from "../SDKConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InstallIconComp extends cc.Component {


    @property({
        type: cc.Component.EventHandler,
        displayName: "回调函数"
    })
    callback = new cc.Component.EventHandler();
    start() {
        SDKManager.getChannel().canInstallShortcut((result: ResultState) => {
            this.node.active = result == ResultState.NO ? false : true
            if (this.node.active) {
                this.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this)
            }
        });

    }



    onButtonClick() {
        SDKManager.getChannel().installShortcut((result: ResultState) => {
            this.node.active = result == ResultState.YES ? false : true
            cc.log(' this.node.active ',this.node.active)
            this.callback.emit([result])
        });
    }

}
