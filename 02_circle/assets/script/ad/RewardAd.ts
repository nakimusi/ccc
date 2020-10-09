import {WechatRewardAd} from "./wechat/WechatRewardAd";

export class RewardAd  {

    static _sInstance = null;   //静态实例
    _reward = null;             //插屏实例

    constructor() {
        
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            if (yyp.config.ADConfig.reward['Use'] == 1) {
                let adid = yyp.config.ADConfig.reward['WxAdid']
                this._reward = new WechatRewardAd(adid);
            }
        }
        else if (cc.sys.platform === cc.sys.BYTEDANCE_GAME){
        }

    }

    static getInstance(){
        if (RewardAd._sInstance == null) {
            RewardAd._sInstance = new RewardAd();
        }
        return RewardAd._sInstance;
    }
    
    //广告是否已经加载成功
    isLoad(){
        if (this._reward){
            return this._reward._isLoad();
        }
        return false;
    }
    
    //展示广告
    show(callback) {
        if (this._reward){
            this._reward._show(callback)
        }
    }

}
