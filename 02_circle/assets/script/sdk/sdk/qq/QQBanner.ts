
import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";
export default class QQBanner extends BaseAd {

    protected instance: qq.BannerAd;

    open(adID) {
        //逻辑要求开
        this.logicState = SDKState.open;

        //如果banner已经已经显示 则返回。
        // if (this.state == AdState.loading) {
        //     return;
        // }
        // this.state = AdState.loading;
        if (this.adUnitID != adID) {
            this.destroy()
            this.create(adID)
        } else {
            this.showCount++;
            if (this.showCount > 3) {//展示超过3次 从新加载
                this.showCount = 0;
                this.destroy()
                this.create(adID)
            } else {
                this.show()
            }
        }
    }

    close() {

        this.logicState = SDKState.close;

        // if (this.state == AdState.close) {
        //     return;
        // }

        if (!this.instance) {
            return
        }
        this.hide()
    }
    onError(err) {
        console.log('banner onError', err)
        this.setState(SDKState.loadFail)

    }

    onLoad() {
        console.log('banner onLoad')
        this.setState(SDKState.loadSucess)
        if (this.logicState == SDKState.open) {
            this.show()
        } else {
            this.hide()
        }
    }
    onResize(data) {
        console.log('banner onResize', data)
    }

    protected create(adID) {
        let winSize = qq.getSystemInfoSync();
        this.adUnitID = adID
        // console.log(winSize);
        let bannerHeight = 130;
        let bannerWidth = 350;



        this.instance = qq.createBannerAd({
            adUnitId: this.adUnitID,
            style: {
                left: (winSize.windowWidth - bannerWidth) / 2,
                top: winSize.windowHeight - bannerHeight,
                width: bannerWidth
            }
        })
        this.instance.onLoad(this.onLoad.bind(this))
        this.instance.onError(this.onError.bind(this))
        this.instance.onResize(this.onResize.bind(this))
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
        }
    }
}
