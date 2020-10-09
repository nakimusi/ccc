import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";


/**
 * https://minigame.vivo.com.cn/documents/#/api/da/banner-da
 * banner广告实例不能复用，每次需要重新加载时要重新create
1、如果先调用createBannerAd()后 不能立马调用hide()方法，要等Ad创建成功后，在某个需要的场景下调hide()

2、如果有场景需要再次展示广告，如果广告被关闭了或者调了close()，必须重新创建才能展示出来，此时show()无效

3、广告调试时，会有可能因为填充率不足而展示不出来，具体请查看教程中的错误码信息

4、Banner广告创建间隔不得少于10s
 */
export default class VivoBannerAd extends BaseAd {

    onError(err) {
        console.log('banner onError', err)
        this.setState(SDKState.loadFail)
        // this.reLoad()
    }

    onLoad() {
        console.log('banner onLoad this.logicState ', this.logicState)
        this.setState(SDKState.loadSucess)
        if (this.logicState == SDKState.open) {
            // this.show()
        } else {
            this.hide()
        }
    }
    open(adID) {
        //逻辑要求开
        this.logicState = SDKState.open;

        //如果banner已经已经显示 则返回。
        if (this.state == SDKState.loading) {
            console.log('showBanner 正在加载中')
            return;
        }
        this.state = SDKState.loading;
        // if (this.adUnitID != adID) {
        this.destroy();
        this.create(adID)

    }

    close() {

        this.logicState = SDKState.close;

        if (this.state == SDKState.loading) {
            console.log('hideBanner 正在加载中')
            //如果先调用createBannerAd()后 不能立马调用hide()方法，要等Ad创建成功后，在某个需要的场景下调hide()
            return;
        }
        if (!this.instance) {
            return
        }
        this.hide()
    }



    onResize(data) {
        console.log('banner onResize', data)
    }
    
    protected show(): void {
        this.state = SDKState.open
        if (this.instance)
            this.instance.show();
        console.log(' banner show ')
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
            this.instance.offSize(this.onResize.bind(this))
            this.instance.destroy()
            this.instance = null;
        }
    }
    protected create(adID) {
        this.adUnitID = adID;
        let winSize = qg.getSystemInfoSync();
        this.instance = qg.createBannerAd({
            posId: adID,
            style: {}
        })
        this.instance.onLoad(this.onLoad.bind(this))
        this.instance.onError(this.onError.bind(this))
        this.instance.onSize(this.onResize.bind(this))
        this.instance.show().then(() => {
            console.log('banner广告展示完成');
            this.setState(SDKState.open)
        }).catch((err) => {
            this.setState(SDKState.close)
            console.log('banner广告展示失败', JSON.stringify(err));
        })
    }
}