/**
 * https://developers.weixin.qq.com/minigame/dev/api/ad/wx.createBannerAd.html
 * 创建 banner 广告组件。请通过 wx.getSystemInfoSync() 返回对象的 SDKVersion 
 * 判断基础库版本号 >= 2.0.4 后再使用该 API。
 */

export class WechatBannerAd {

    _wxSystemInfo: any      = {};       //微信返回的信息
    _adID: string           = '';       //广告id
    _maxHeight: number      = 100;      //最大高度
    _instance: wx.BannerAd  = null;     //广告实例
    _isBottom: boolean      = true;     //展示在下方

    constructor(adid,maxHeight,isBottom = true) {
        this._wxSystemInfo = wx.getSystemInfoSync();
        this._adID = adid;
        this._maxHeight = maxHeight;
        this._isBottom = isBottom;
    }

    //创建广告
    _createAD() {
        if (this._instance == null) {
            this._instance = wx.createBannerAd({
                adUnitId: this._adID,
                adIntervals: 30,
                style: {
                    left: 0,
                    top: this._isBottom ? (this._wxSystemInfo.windowHeight - this._maxHeight) : 0,
                    width: 1000
                }
            })
            this._instance.onLoad(this._onLoad.bind(this))
            this._instance.onError(this._onError.bind(this))
            this._instance.onResize(this._onResize.bind(this))
        }
    }

    //广告已经加载
    _onLoad() {
        cc.log('banner onLoad')
        this._instance.show();
    }

    //广告加载出错
    _onError(err) {
        cc.log('banner onError', err)
        this._reLoad()
    }
    
    //banner 广告尺寸变化
    _onResize(resize) {
        cc.log('banner onResize', this._isBottom,resize)

        if (resize.height <= this._maxHeight) {
            if (this._isBottom) {
                //高度小于预设最大高度,重新设置广告的高度位置
                this._instance['style'].top = this._wxSystemInfo.windowHeight - resize.height
            }
        }
        else{
            //高度大于预设最大高度,动态缩放
            let rate = this._maxHeight/resize.height
            let rewidth = Math.min(this._wxSystemInfo.windowWidth * rate,300)
            this._instance['style'].width = rewidth

            let left = (this._wxSystemInfo.windowWidth - rewidth)/2
            this._instance['style'].left = left
        }
    }

    //销毁广告
    _destroy(): void {
        if (this._instance) {
            this._instance.offLoad(this._onLoad.bind(this))
            this._instance.offError(this._onError.bind(this))
            this._instance.offResize(this._onResize.bind(this))
            this._instance.destroy()
            this._instance = null;
        }
    }

    //是否允许广告
    _allowAd(){
        return this._compareVersion(this._wxSystemInfo['SDKVersion'],'2.0.4') >= 0;
    }

    //重新加载广告
    _reLoad() {
        //延迟5s再次加载广告
        let id = setTimeout(() => {
            this._createAD()
            clearTimeout(id)
        }, 5000)
    }
    

    //展示广告(加载成功后直接显示)
    _show() {
        if (this._allowAd()){
            this._createAD()
        }
    }

    //隐藏(直接销毁)
    _hide() {
        this._destroy()
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
