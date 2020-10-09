import SDKManager from "../SDKManager";
import BaseNativeAdItemModel from "../base/BaseNativeAdItemModel";
import NativeAdItemView from "./NativeAdItemView";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
export default class NativeComp extends cc.Component {

    @property
    adSite: number = 0;

    @property(cc.Prefab)
    nativeAdItemView: cc.Prefab = null;


    @property(cc.PageView)
    pageView: cc.PageView = null;

    start() {
        SDKManager.getChannel().showNativeAd(this.adSite, (list: BaseNativeAdItemModel[]) => {
            if (list.length > 0) {
                for (let index = 0; index < list.length; index++) {
                    let item = list[index]
                    let node = cc.instantiate(this.nativeAdItemView)
                    let comp = node.getComponent(NativeAdItemView)
                    this.pageView.addPage(node)
                    if (comp) {
                        comp.setModel(item)
                    }
                }
            }
        });
    }

    onDestroy() {
        SDKManager.getChannel().hideNativeAd()
    }

    onButtonClick() {

    }

}
