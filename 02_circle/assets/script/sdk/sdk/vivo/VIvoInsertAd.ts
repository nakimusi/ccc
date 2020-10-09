
import { ResultCallback, SDKState } from "../SDKConfig";
import BaseAd from "../base/BaseAd";
/**
 * https://minigame.vivo.com.cn/documents/#/api/da/interstitial-da
 * 插屏广告实例不能复用，每次需要重新加载时要重新create
 */
export default class VivoInsertAd extends BaseAd {
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
        this.adUnitID = id;
        console.log(' show insert ad ')
        // if (!this.instance) {
        this.instance = qg.createInsertAd({
            posId: id
        });
        this.instance.onLoad(this.onLoad.bind(this))
        this.instance.onError(this.onError.bind(this))
        this.instance.onError(err => {
            console.log("插屏广告加载失败", err);
        });

        this.instance.show().then(() => {
            console.log('插屏广告展示完成');
            this.state = SDKState.open;
        }).catch((err) => {
            this.state = SDKState.close;
            console.log('插屏广告展示失败', JSON.stringify(err));
        })
        // }
    }
    
    open(ad: string, func: ResultCallback) {
        console.log('BaseInterstitialAd showAd this.state ', this.state)
        // if (this.state == AdState.loading) {
        //     return;
        // }

        this.state = SDKState.loading;
        this.create(ad)
        // this.load()
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