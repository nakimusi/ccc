import BaseChannel from "../base/BaseChannel";
import { ChannelID } from "../SDKConfig";
import WXBannerAd from "./WXBannerAd";
import WXInterstitialAd from "./WXInterstitialAd";
import WXRewardedVideoAd from "./WXRewardedVideoAd";
import WXShare from "./WXShare";
import WXLogin from "./WXlogin";
import WXScreenshot from "./WXScreenshot";

export default class WXChannel extends BaseChannel {



    constructor(id: ChannelID) {
        super(id)
        if (wx.createBannerAd) {
            this.bannerAd = new WXBannerAd(this)
        }

        // if (wx.createInterstitialAd) {
        //     this.insertAd = new WXInterstitialAd(this)
        // }

        if (wx.createRewardedVideoAd) {
            this.rewardAd = new WXRewardedVideoAd(this)
        }

        if (wx.shareAppMessage) {
            this.share = new WXShare(this)
        }

        this.loginMgr = new WXLogin(this)

        this.screenshot = new WXScreenshot(this)

    }



    vibrateShort() {
        wx.vibrateShort();
    }

    //展示网络图片
    previewImage(imgUrl: string) {
        wx.previewImage({
            current: imgUrl, // 当前显示图片的http链接
            urls: [imgUrl] // 需要预览的图片http链接列表
        })
    }

    //跳转能力
    navigateToMiniProgram(appID: string) {
        wx.navigateToMiniProgram({
            appId: appID,
            success: () => {
                cc.log('wx navigateToMiniProgram succ');
            }
        })
    }
    showToast(title:string){
        wx.showToast({title:title})
    }
    postMessage(msg: any) {
        let context = wx.getOpenDataContext()
        if (context) {
            msg.channelID = this.channelID;
            context.postMessage(msg)
        }
    }
}
