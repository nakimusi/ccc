
import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";

//https://open.oppomobile.com/wiki/doc#id=10536
export default class OppoBannerAd extends BaseAd {


    open(adID) {
        //逻辑要求开
        this.destroy()
        this.create(adID)
        this.show()

    }
    onError(err) {
        this.channel.showToast('banner onError' + err)
        this.setState(SDKState.loadFail)
    }
    onLoad() {
        this.setState(SDKState.loadSucess)
        this.channel.showToast('banner onLoad')
    }


    close() {
        if (!this.instance) {
            return
        }
        this.hide()
    }

    onResize(data) {
        console.log('banner onResize', data)
    }

    protected create(id) {
        this.adUnitID = id;
        let winSize = qg.getSystemInfoSync();
        this.instance = qg.createBannerAd({
            adUnitId: this.adUnitID,
            style: {}
        })
        this.instance.onLoad(this.onLoad.bind(this))
        this.instance.onError(this.onError.bind(this))
        this.instance.onResize(this.onResize.bind(this))
    }



    protected show(): void {
        this.state = SDKState.open
        if (this.instance)
            this.instance.show();
        console.log(' banner show ')
    }

    protected hide(): void {
        console.log(' banner hide ')
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
            this.instance = null;
        }
    }
}