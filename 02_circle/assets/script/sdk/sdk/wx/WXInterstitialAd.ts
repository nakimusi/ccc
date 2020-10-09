
import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";
/**
 * https://developers.weixin.qq.com/minigame/dev/api/ad/wx.createInterstitialAd.html
 */
export default class WXInterstitialAd extends BaseAd {

    protected instance: wx.InterstitialAd;

    open(adID: string) {
        if (this.state == SDKState.open) {
            return;
        }
        if (this.state == SDKState.loading) {
            return;
        }
        console.log('BaseInterstitialAd showAd adUnitID ', this.adUnitID)
        this.state = SDKState.loading;
        this.create(adID)
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
        this.setState(SDKState.close)
    }

    protected load() {
        if (this.instance) {
            this.instance.load()
        }
    }

    protected show() {
        if (this.instance) {
            this.setState(SDKState.open)
            this.instance.show()
        }
    }

    protected destroy() {
        if (this.instance) {
            this.instance.offLoad(this.onLoad.bind(this))
            this.instance.offClose(this.onClose.bind(this))
            this.instance.offError(this.onError.bind(this))
            this.instance.destroy()
            this.instanceMap[this.adUnitID] = null;
            this.instance = null;
        }
    }

    protected create(id) {
        this.adUnitID = id;
        // 创建插屏广告实例，提前初始化
        if (!this.instanceMap[id]) {
            this.instance = wx.createInterstitialAd({
                adUnitId: id
            })
            this.instance.onLoad(this.onLoad.bind(this))
            this.instance.onError(this.onError.bind(this))
            this.instance.onClose(this.onClose.bind(this))
            this.instanceMap[id] = this.instance;
        }
    }
}
