
import OppoNativeAdItemModel from "../oppo/OppoNativeAdItemModel";
import BaseAd from "../base/BaseAd";
import { SDKState, NativeAdCallback } from "../SDKConfig";
import BaseNativeAdItemModel from "../base/BaseNativeAdItemModel";

/**
 * https://minigame.vivo.com.cn/documents/#/api/da/native-ad
 */
export default class VivoNativeAd extends BaseAd {
    protected adItems: BaseNativeAdItemModel[] = []
    open(adUnitID: string, callback: NativeAdCallback) {
        // if (this.state == AdState.loading) {
        //     return;
        // }
        this.state = SDKState.loading;
        this.callback = callback;
        this.create(adUnitID);
        this.load()
    }

    create(adUnitID) {
        this.adUnitID = adUnitID
        this.destroy()
        // if (!this.instanceMap.has(adUnitID)) {
        console.log('VivoNativeAd create adUnitID ', adUnitID)
        this.instance = qg.createNativeAd({
            posId: adUnitID,
        });
        console.log(' VivoNativeAd  this.instance  ', this.instance)
        if (this.instance) {
            this.instance.onLoad(this.onLoad.bind(this))
        }

    }
    close(){
        this.callback = null;
    }
    onLoad(res) {

        // console.log('onLoad ', res.adList)
        this.adItems.length = 0;
        if (res && res.adList) {
            this.setState(SDKState.loadSucess)
            for (let index = 0; index < res.adList.length; index++) {
                const element = res.adList[index];
                let adItem = new OppoNativeAdItemModel()
                adItem.initWithOppo(element)
                this.reportAdShow(adItem.getID())
                this.adItems.push(adItem)
            }
            if (this.callback) {
                this.callback(this.adItems)
            }
        } else {
            this.onError(null)
        }
    }

    onError(err) {
        this.setState(SDKState.loadFail)
        console.log(' BaseNativeAd onError err ', err)
        if (this.callback) {
            this.callback([])
        }
    }

    load() {
        if (this.instance)
            this.instance.load();
    }



    reportAdClick(adId) {
        if (!this.instance) {
            return
        }
        console.log('reportAdClick ', adId)
        this.instance.reportAdClick({
            adId: adId
        })
    }

    reportAdShow(adId) {
        if (!this.instance) {
            return
        }
        console.log('reportAdShow ', adId)
        this.instance.reportAdShow({
            adId: adId
        })
    }

    destroy() {
        if (this.instance) {
            if (this.instance.offLoad) {
                this.instance.offLoad(this.onLoad.bind(this));
            }
            if (this.instance.offError) {
                this.instance.offError(this.onError.bind(this));
            }
            if (this.instance.destroy) {
                this.instance.destroy();
            }

            this.instance = null;
        }

    }
}