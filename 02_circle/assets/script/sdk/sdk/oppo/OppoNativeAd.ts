

import OppoNativeAdItemModel from './OppoNativeAdItemModel';
import { SDKState, NativeAdCallback } from '../SDKConfig';
import BaseAd from '../base/BaseAd';
import BaseNativeAdItemModel from '../base/BaseNativeAdItemModel';
/**
 * https://open.oppomobile.com/wiki/doc#id=10539
 */
export default class OppoNativeAd extends BaseAd {
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


    close(){
        this.callback = null;
    }


    onError(err) {
        this.setState(SDKState.loadFail)
        console.log(' BaseNativeAd onError err ', err)
        if (this.callback) {
            this.callback([])
        }
    }

    onLoad(res) {
        this.setState(SDKState.loadSucess)
        console.log('onLoad ', res.adList)
        this.adItems.length = 0;
        if (res.adList) {
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
        }
    }

    create(adUnitID) {
        if (!this.instanceMap[adUnitID]) {
            this.instance = qg.createNativeAd({
                adUnitId: adUnitID,
            });
            this.instance.onLoad(this.onLoad.bind(this))
            this.instance.onError(this.onError.bind(this))
            this.instanceMap[adUnitID] = this.instance
        } else {
            this.instance = this.instanceMap[adUnitID]
        }

    }

    load() {
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
        this.instance.destroy();
    }
}