

import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";
/**
 * https://microapp.bytedance.com/dev/cn/mini-game/develop/open-capacity/ads/tt.createbannerad
 */
export default class TTBanner extends BaseAd {

    // protected instance: any;
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
    onResize(size) {
        let winSize = tt.getSystemInfoSync();
        console.log(size.width, size.height);
        if (size.width != 0 && size.height != 0) {
            this.instance.style.top = winSize.windowHeight - size.height;
            this.instance.style.left = (winSize.windowWidth - size.width) / 2;
        }
    }

    protected create(adId: string) {
        this.adUnitID = adId;
        let winSize = tt.getSystemInfoSync();

        // console.log(winSize);
        // let bannerHeight = 200;
        let bannerWidth = 200;



        this.instance = tt.createBannerAd({
            adUnitId: this.adUnitID,
            style: {
                left: (winSize.windowWidth - bannerWidth) / 2,
                top: winSize.windowHeight - (bannerWidth / 16 * 9), // 根据系统约定尺寸计算出广告高度
                width: bannerWidth
            }
        })
        this.instance.onLoad(this.onLoad.bind(this))
        this.instance.onError(this.onError.bind(this))
        this.instance.onResize(this.onResize.bind(this))
    }

    protected show(): void {
        if (this.instance) {
            this.state = SDKState.open
            this.instance.show();
        }

    }

    protected hide(): void {

        if (this.instance) {
            this.state = SDKState.close;
            this.instance.hide();
        }

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

    protected destroy(): void {
        if (this.instance) {
            this.instance.offLoad(this.onLoad.bind(this))
            this.instance.offError(this.onError.bind(this))
            this.instance.offResize(this.onResize.bind(this))
            this.instance.destroy()
        }
    }
}
