
import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";

export default class QQInterstitialAd extends BaseAd {
    // private interstitialAd = null;

    open(id) {
        console.log('BaseInterstitialAd showAd this.state ', this.state)
        // if (this.state == AdState.loading) {
        //     return;
        // }

        this.state = SDKState.loading;
        this.create(id)
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
    protected onClose() {
        console.log(' 插屏广告关闭')
    }

    protected load() {
        if (this.instance) {
            this.instance.load()
        }
    }

    protected show() {
        if (this.instance) {
            this.instance.show()
        }
    }

    protected create(id) {
        // 创建插屏广告实例，提前初始化
        this.adUnitID = id;
        if (!this.instance) {
            this.instance = qq.createInterstitialAd({
                adUnitId: id
            })
            this.instance.onLoad(this.onLoad.bind(this))
            this.instance.onError(this.onError.bind(this))
            this.instance.onClose(this.onClose.bind(this))
        }
    }

}
