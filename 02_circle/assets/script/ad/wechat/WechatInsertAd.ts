/**
 * https://https://developers.weixin.qq.com/minigame/dev/api/ad/wx.createInterstitialAd.html
 * 创建 banner 广告组件。请通过 wx.getSystemInfoSync() 返回对象的 SDKVersion 
 * 判断基础库版本号 >= 2.6.0 后再使用该 API。
 */

export class WechatInsertAd {

    _wxSystemInfo: any              = {};       //微信返回的信息
    _adID: string                   = '';       //广告id
    _instance: wx.InterstitialAd    = null;     //广告实例
    _loaded:boolean                 = false;
    _timeAllow:boolean              = false;    //游戏看15s内不能播放广告

    constructor(adid) {
        this._wxSystemInfo = wx.getSystemInfoSync();
        this._adID = adid;
        this._load();
    }

    //创建广告
    _load() {
        cc.log('insert load ',this._allowAd())
        if (this._allowAd()){
            if (this._instance == null) {
                this._instance = wx.createInterstitialAd({
                    adUnitId: this._adID
                })
                this._instance.onLoad(this._onLoad.bind(this))
                this._instance.onError(this._onError.bind(this))
                this._instance.onClose(this._onClose.bind(this))
            }
            else{
                this._instance.load()
            }
        }
    }

    //广告已经加载
    _onLoad() {
        cc.log('insert onLoad')
        this._loaded = true;
        
        //延迟15s(微信的限制,不允许短时间内连续播放广告)
        let id = setTimeout(() => {
            this._timeAllow = true
            clearTimeout(id)
        }, 15000)
    }

    //广告加载出错
    _onError(err) {
        cc.log('insert onError', err)
    }
    
    //关闭广告
    _onClose() {
        cc.log('insert onClose')
    }

    //销毁广告
    _destroy(): void {
        if (this._instance) {
            this._instance.offLoad(this._onLoad.bind(this))
            this._instance.offError(this._onError.bind(this))
            this._instance.offClose(this._onClose.bind(this))
            this._instance.destroy()
            this._instance = null;
        }
    }

    //是否允许广告
    _allowAd(){
        return this._compareVersion(this._wxSystemInfo['SDKVersion'],'2.6.0') >= 0;
    }

    _isLoad(){
        cc.log('insert _isLoad ',this._loaded, this._timeAllow)
        return this._loaded && this._timeAllow;
    }

    //展示广告(加载成功后直接显示)
    _show() {
        this._instance.show()
    }

    _compareVersion(v1, v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)
    
        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }
    
        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])
    
            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }
    
        return 0
    }
}
