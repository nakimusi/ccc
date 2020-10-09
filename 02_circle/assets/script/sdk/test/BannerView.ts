import SDKManager from "../sdk/SDKManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BannerView extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    onButtonBackClick() {
       this.node.destroy()
    }

    // update (dt) {}
}
