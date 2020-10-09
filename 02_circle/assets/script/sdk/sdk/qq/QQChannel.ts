import BaseChannel from "../base/BaseChannel";
import QQVideoAd from "./QQVideoAd";
import QQBanner from "./QQBanner";
import QQShare from "./QQShare";
import QQInterstitialAd from "./QQInterstitialAd";
import QQAppBoxAd from "./QQAppBoxAd";
import QQScreenshot from "./QQScreenshot";
import QQSubPackage from "./QQSubPackage";

export default class QQChannel extends BaseChannel {
    constructor(id: number) {
        super(id);

        qq.onShow(() => {

        })

        qq.onHide(() => {

        })

        this.share = new QQShare(this);

        if (qq.createInterstitialAd) {
            this.insertAd = new QQInterstitialAd(this)
        }

        if (qq.createRewardedVideoAd) {
            this.rewardAd = new QQVideoAd(this)
        }
        if (qq.createBannerAd) {
            this.bannerAd = new QQBanner(this)
        }

        if (qq.createAppBox) {
            this.appBoxAd = new QQAppBoxAd(this)
        }

        this.screenshot = new QQScreenshot(this)

        this.subPackage = new QQSubPackage(this)


    }
    showToast(title: string) {
        qq.showToast({ title: title })
    }
    vibrateShort() {
        qq.vibrateShort();
    }

    postMessage(message) {

    }



    previewImage(imgUrl: string) {
        qq.previewImage({
            current: imgUrl, // 当前显示图片的http链接
            urls: [imgUrl] // 需要预览的图片http链接列表
        })
    }

    navigateToMiniProgram(appID: string) {
        qq.navigateToMiniProgram({
            appId: appID,
            success: () => {

            }
        })
    }
}