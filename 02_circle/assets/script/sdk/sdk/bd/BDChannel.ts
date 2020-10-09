import BaseChannel from "../base/BaseChannel";
import BDRewardAd from "./BDRewardAd";
import BDSubPackage from "./BDSubPackage";
import BDScreenshot from "./BDScreenshot";

export default class BDChannel extends BaseChannel {


    constructor(id: number) {
        super(id);
        swan.onShow(() => {

        })

        swan.onHide(() => {

        })
        if (swan.createRewardedVideoAd) {
            this.rewardAd = new BDRewardAd(this)
        }
        this.subPackage = new BDSubPackage(this)
        this.screenshot = new BDScreenshot(this)
    }

    vibrateShort() {
        swan.vibrateShort()
    }



    showToast(title: string) {
        swan.showToast({ title: title })
    }
    //展示网络图片
    previewImage(imgUrl: string) {
        swan.previewImage({
            current: imgUrl, // 当前显示图片的http链接
            urls: [imgUrl] // 需要预览的图片http链接列表
        })
    }

    navigateToMiniProgram(appID: string) {
        swan.navigateToMiniProgram({
            appKey: appID,
            success: () => {
                console.log(' jump ok')
            },
            fail: () => {
                console.log(' jump fail')
            }
        })
    }


}