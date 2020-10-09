
import {WechatBannerAd} from "./wechat/WechatBannerAd";

export class BannerAd  {

    static _sInstance = null;   //静态实例
    _bannerBottom = null;       //下方实例
    _bannerTop = null;          //上方实例

    constructor() {
        
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            if (yyp.config.ADConfig.bannerBottom['Use'] == 1) {
                let adid = yyp.config.ADConfig.bannerBottom['WxAdid']
                let maxHeight = yyp.config.ADConfig.bannerBottom['MaxHeight']
                this._bannerBottom = new WechatBannerAd(adid,maxHeight);
            }
            if (yyp.config.ADConfig.bannerTop['Use'] == 1) {
                let adid = yyp.config.ADConfig.bannerTop['WxAdid']
                let maxHeight = yyp.config.ADConfig.bannerTop['MaxHeight']
                this._bannerTop = new WechatBannerAd(adid,maxHeight,false);
            }
        }
        else if (cc.sys.platform === cc.sys.BYTEDANCE_GAME){
        }

    }

    static getInstance(){
        if (BannerAd._sInstance == null) {
            BannerAd._sInstance = new BannerAd();
        }
        return BannerAd._sInstance;
    }

    //展示广告
    showTop() {
        if (this._bannerTop){
            this._bannerTop._show()
        }
    }

    //展示广告
    showBottom() {
        if (this._bannerBottom){
            this._bannerBottom._show()
        }
    }

    //隐藏
    hideTop() {
        if (this._bannerTop){
            this._bannerTop._hide()
        }
    }

    //隐藏
    hideBottom() {
        if (this._bannerBottom){
            this._bannerBottom._hide()
        }
    }
}
