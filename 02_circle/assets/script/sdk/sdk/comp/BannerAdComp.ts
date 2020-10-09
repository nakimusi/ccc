import SDKManager from "../SDKManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BannerAdComp extends cc.Component {


    @property
    adSite: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.active = SDKManager.getChannel().hasBanner()
        if(this.node.active){
            SDKManager.getChannel().showBanner(this.adSite)
        }
       
    }



    onDestroy() {
        SDKManager.getChannel().hideBanner()
    }
}
