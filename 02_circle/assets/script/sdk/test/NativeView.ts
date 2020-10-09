import SDKManager from "../sdk/SDKManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NativeView extends cc.Component {


    start() {

    }

    onButtonBackClick() {
        this.node.destroy()
        SDKManager.getChannel().showToast("关闭NativeView")
     }
 
    // update (dt) {}
}
