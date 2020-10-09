import BaseAd from "./BaseAd";
import { SDKConfig, ADName, ResultCallback, ResultState, NativeAdCallback, isNull, DataCallback } from "../SDKConfig";
import { BaseShare } from "./BaseShare";
import BaseLogin from "./BaseLogin";
import BaseSubPackage from "./BaseSubPackage";
import BaseScrennshot from "./BaseScreenshot";
import BaseRecorder from "./BaseRecorder";

export default class BaseChannel {

    //渠道号
    protected channelID: number = 0
    //激励视频
    protected rewardAd: BaseAd = null;
    //banner广告实例
    protected bannerAd: BaseAd = null;
    //插屏广告
    protected insertAd: BaseAd = null;
    //分享实例
    protected share: BaseShare = null;
    //小游戏分包
    protected subPackage: BaseSubPackage = null;
    //原生广告
    protected nativeAd: BaseAd = null;
    //盒子广告
    protected appBoxAd: BaseAd = null;
    //登陆
    protected loginMgr: BaseLogin = null;
    //录屏功能
    protected recorder: BaseRecorder = null;
    //截屏功能
    protected screenshot: BaseScrennshot = null;

    //渠道配置数据
    protected configData: any;

    constructor(cID: number) {
        this.channelID = cID;
        this.configData = SDKConfig[this.channelID]
    }

    hasParam(name: string) {
        let param = this.configData[name]
        if (param == undefined || param == null) {
            return false;
        }
        if (Array.isArray(param)) {
            return param.length > 0
        }
        return true;
    }


    getParam(site: number, adName: string) {
        let list: string[] = this.configData[adName]
        if (list.length > 0) {
            if (list.length > site) {
                return list[site]
            } else {
                return list[0]
            }
        } else {
            return null;
        }

    }

    /**
     * 是否有banner广告
     */
    hasBanner() {
        return this.hasParam(ADName.banner) && this.bannerAd != null;
    }
    /**
     * 显示banner广告
     * @param site 广告位索引
     */
    showBanner(site: number) {
        if (this.hasBanner()) {
            let ad = this.getParam(site, ADName.banner)
            if (ad) {
                this.bannerAd.open(ad)
            }

        }
    }
    //隐藏banner广告
    hideBanner() {
        if (this.hasBanner()) {
            this.bannerAd.close()
        }
    }

    /**
     * 是否有插屏广告
     */
    hasInsertAd() {
        return this.hasParam(ADName.insert) && this.insertAd != null;
    }

    /**
     * 展示插屏广告
     */
    showInsertAd(site: number) {
        if (this.hasInsertAd()) {
            let adId = this.getParam(site, ADName.insert)
            if (adId) {
                this.insertAd.open(adId)
            }

        }
    }

    //是否有激励视频广告
    hasRewardAd() {
        return this.hasParam(ADName.reward) && this.rewardAd != null;
    }
    //展示激励视频广告
    showRewardAd(site: number, callback: ResultCallback) {
        if (this.hasRewardAd()) {
            let adID = this.getParam(site, ADName.reward)
            if (adID) {
                this.rewardAd.open(adID, callback)
            }

        }
    }

    //是否有分享能力
    hasShare() {
        return this.share != null;
    }

    /**
     * 分享
     * @param site 
     * @param callback 
     */
    showShare(site: number, callback: ResultCallback, isShowRecorder?: boolean) {
        if (this.hasShare()) {
            
            site = Math.floor(Math.random()*2);//0,1
            // cc.log('showshare ',site)
            this.share.share(site, callback, isShowRecorder)
        }
    }



    //短震动
    vibrateShort() {

    }
    //展示网络图片
    previewImage(imgUrl: string) {

    }
    //跳转能力
    navigateToMiniProgram(appID: string) {

    }

    hasLogin() {
        return !isNull(this.loginMgr)
    }

    /**
     * 登陆游戏
     * @param account 
     * @param func 
     */
    login(account: string, func: ResultCallback) {
        if (this.hasLogin()) {
            this.loginMgr.login(account, func)
        } else {
            func(ResultState.YES)
        }
    }

    /**
     * 获取用户信息
     * @param withCredentials 
     * @param lang 
     * @param func 
     */
    getUserInfo(withCredentials: string, lang: string, func: DataCallback) {
        if (this.hasLogin()) {
            this.loginMgr.getUserInfo(withCredentials, lang, func)
        }
    }
    /**
     * 检查登陆状态
     * @param callback 
     */
    checkSession(callback: ResultCallback) {
        if (this.hasLogin()) {
            this.loginMgr.checkSession(callback)
        } else {
            callback(ResultState.YES)
        }
    }

    postMessage(msg: any) {

    }

    hasSubPackage() {
        return this.subPackage != null;
    }

    loadSubPackage(subNames: string[], callback: DataCallback) {
        if (this.hasSubPackage()) {
            this.subPackage.loadList(subNames, callback);
        } else {
            callback(ResultState.YES, null)
        }
    }

    hasScreenshot() {
        return this.screenshot != null;
    }

    showScreenshot() {
        if (this.hasScreenshot()) {
            this.screenshot.capture()
        }
    }


    hasNativeAd() {
        return this.hasParam(ADName.native) && this.nativeAd != null;
    }

    showNativeAd(index: number, callback: NativeAdCallback) {
        if (this.hasNativeAd()) {
            let ad = this.getParam(index, ADName.native)
            if (ad) {
                this.nativeAd.open(ad, callback)
            }

        }
    }

    hideNativeAd() {
        if (this.hasNativeAd()) {
            this.nativeAd.close()
        }
    }
    reportAdClick(adId) {
        if (this.hasNativeAd()) {
            this.nativeAd.reportAdClick(adId)
        }
    }

    reportAdShow(adId) {
        if (this.hasNativeAd()) {
            this.nativeAd.reportAdShow(adId)
        }
    }

    hasRecorder() {
        return this.recorder != null;
    }

    recorderStart(obj?) {
        if (this.hasRecorder()) {
            this.recorder.start(obj)
        }
    }

    getRecorder() {
        return this.recorder;
    }


    recorderStop(isSave: boolean = true) {
        if (this.hasRecorder()) {
            this.recorder.stop(isSave)
        }
    }


    hasAppBox() {
        return this.hasParam(ADName.appbox) && this.appBoxAd != null;
    }

    showAppBoxAd(index: number) {
        if (this.hasAppBox()) {
            let ad = this.getParam(index, ADName.appbox);
            if (ad) {
                this.appBoxAd.open(ad)
            }

        }
    }


    showToast(title: string) {

    }
    canInstallShortcut(func: ResultCallback) {
        func(ResultState.NO)
    }

    /**
     * 安装图标到桌面
     * @param result 
     */
    installShortcut(result: ResultCallback) {
        result(ResultState.NO)
    }

}
