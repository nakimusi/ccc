import SDKManager from "../SDKManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InsertAdComp extends cc.Component {


    @property
    adSite: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.active = SDKManager.getChannel().hasInsertAd()
        if (this.node.active) {
            SDKManager.getChannel().showInsertAd(this.adSite)
        }

    }



    onDestroy() {

    }
}

