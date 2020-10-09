import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";
/**
 * https://developers.weixin.qq.com/minigame/dev/api/ad/wx.createBannerAd.html
 * 创建 banner 广告组件。请通过 wx.getSystemInfoSync() 返回对象的 SDKVersion 
 * 判断基础库版本号 >= 2.0.4 后再使用该 API。每次调用该方法创建 banner 广告都会返回一个全新的实例。
 */
export default class WXBannerAd extends BaseAd {

    protected instance: wx.BannerAd;

    protected onResize(data) {
        console.log('banner onResize', data)
    }

    protected reLoad() {
        let id = setTimeout(() => {
            this.create(this.adUnitID)
            clearTimeout(id)
        }, 8000)
    }

    open(adID: string) {

        this.logicState = SDKState.open;
        //正在展示
        if (this.state == SDKState.open) {
            return;
        }
        //逻辑要求展示

        //如果banner已经已经显示 则返回。
        if (this.state == SDKState.loading) {
            this.clickCount++;
            if (this.clickCount < 3) {//防止平台无法触发onLoad onError 时使用。
                return;
            }
        }
        this.clickCount = 0;
        this.state = SDKState.loading;
        if (this.adUnitID != adID) {
            this.destroy();
            this.create(adID)
        } else {
            this.showCount++;
            if (this.showCount > 3) {//展示超过3次 从新加载
                this.showCount = 0;
                this.destroy();
                this.create(adID)
            } else {
                this.show()
            }
        }
    }

    close() {
        this.logicState = SDKState.close;
        //已经关闭
        if (this.state == SDKState.close) {
            return;
        }
        //逻辑要求关闭

        if (!this.instance) {
            return
        }
        this.hide()
    }

    protected show(): void {
        this.state = SDKState.open
        if (this.instance)
            this.instance.show();
    }

    protected hide(): void {
        this.state = SDKState.close;
        if (this.instance)
            this.instance.hide();
    }


    protected destroy(): void {
        if (this.instance) {
            this.instance.offLoad(this.onLoad.bind(this))
            this.instance.offError(this.onError.bind(this))
            this.instance.offResize(this.onResize.bind(this))
            this.instance.destroy()
            this.instanceMap[this.adUnitID] = null;
        }
    }
    protected create(adID, param?): void {
        this.adUnitID = adID;

        let winSize = wx.getSystemInfoSync();

        // console.log(winSize);
        let bannerHeight = 130;
        let bannerWidth = 350;
        if (!this.instanceMap[adID]) {
            this.instance = wx.createBannerAd({
                adUnitId: adID,
                adIntervals: 30,
                style: {
                    left: (winSize.windowWidth - bannerWidth) / 2,
                    top: winSize.windowHeight - bannerHeight,
                    width: bannerWidth
                }
            })
            this.instance.onLoad(this.onLoad.bind(this))
            this.instance.onError(this.onError.bind(this))
            this.instance.onResize(this.onResize.bind(this))
            this.instanceMap[adID] = this.instance;
        }


    }


    protected onError(err) {
        console.log('banner onError', err)
        this.setState(SDKState.loadFail)
        this.reLoad()
    }

    protected onLoad() {
        console.log('banner onLoad')
        this.setState(SDKState.loadSucess)
        if (this.logicState == SDKState.open) {
            this.show()
        } else {
            this.hide()
        }
    }

}
