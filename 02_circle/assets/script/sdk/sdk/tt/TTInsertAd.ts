import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";

/**
 * auth 游子陈
 * https://microapp.bytedance.com/dev/cn/mini-game/develop/open-capacity/ads/tt.createinterstitialad
 */
export default class TTInsertAd extends BaseAd {

  open(adID: string) {
    console.log('BaseInterstitialAd showAd this.state ', this.state)
    // if (this.state == AdState.loading) {
    //     return;
    // }

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
    console.log(' 插屏广告关闭')
  }

  protected load() {
    // if (this.instance) {
    //     console.log(' Insert load ')
    //     this.instance.load()
    // }
  }

  protected show() {
    // if (this.instance) {
    //     this.instance.show()
    // }
  }

  destroy() {
    // if (this.instance != null) {
    //     this.instance.offLoad(this.onLoad.bind(this))
    //     this.instance.offError(this.onError.bind(this))
    //     this.instance.offClose(this.onClose.bind(this))
    //     this.instance.destroy();
    //     this.instance = null;
    // }
  }

  protected create(id) {
    this.adUnitID = id;
    // 创建插屏广告实例，提前初始化

    const isToutiaio = tt.getSystemInfoSync().appName === "Toutiao";
    // 插屏广告仅今日头条安卓客户端支持
    console.log(" isToutiaio ", isToutiaio)
    if (isToutiaio) {
      const interstitialAd = tt.createInterstitialAd({
        adUnitId: this.adUnitID
      });
      interstitialAd
        .load()
        .then(() => {
          console.log("interstitialAd  show ")
          interstitialAd.show();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

}
