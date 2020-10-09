import SDKManager from "../SDKManager";
import { ResultState } from "../SDKConfig";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class JumpMiniComp extends cc.Component {

    @property
    appid: string = '';

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this)
    }

    onButtonClick() {
        SDKManager.getChannel().navigateToMiniProgram(this.appid);
    }

}
