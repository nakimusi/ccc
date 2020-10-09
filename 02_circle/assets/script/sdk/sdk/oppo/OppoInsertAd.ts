



import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";

/**
 * https://open.oppomobile.com/wiki/doc#id=10538
 */
export default class OppoInsertAd extends BaseAd {
    open(adId) {
        console.log('BaseInterstitialAd showAd this.state ', this.state)
        // if (this.state == AdState.loading) {
        //     return;
        // }

        this.state = SDKState.loading;
        this.create(adId)
        this.load()
    }

    protected onLoad() {
        console.log(' 插屏广告加载成功')
        this.setState(SDKState.loadSucess)
        this.show()
    }

    protected onError(err) {
        console.log(' 插屏广告加载失败 ', err)
        this.setState(SDKState.loadFail)
    }
    protected create(id: string) {
        console.log(' show insert ad ')
        this.adUnitID = id;
        if (!this.instance) {
            this.instance = qg.createInsertAd({
                adUnitId: id
            });
            this.instance.onLoad(this.onLoad.bind(this))
            this.instance.onError(this.onError.bind(this))
        }
    }

    protected load() {
        console.log(' load ad ')
        this.instance.load();
    }

    protected show() {
        console.log(' show ad ')
        this.instance.show()
    }
}
