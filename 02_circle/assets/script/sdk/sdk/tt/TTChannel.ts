import BaseChannel from "../base/BaseChannel";
import TTBanner from "./TTBanner";
import TTVideoAd from "./TTVideoAd";
import TTRecorder from "./TTRecorder";
import TTShare from "./TTShare";
import TTLogin from "./TTLogin";
import TTInsertAd from "./TTInsertAd";
import { ResultCallback, ADName, ResultState } from "../SDKConfig";
import TTScreenshot from "./TTScreenshot";

export default class TTChannel extends BaseChannel {


    constructor(id: number) {
        super(id)
        // this.canSubPackage = true;
        if (tt.createBannerAd) {
            this.bannerAd = new TTBanner(this)
        }
        if (tt.createRewardedVideoAd) {
            this.rewardAd = new TTVideoAd(this)
        } else {
            console.log(' TTChannel createRewardedVideoAd   is null ', tt)
        }

        if (tt.getGameRecorderManager) {
            this.recorder = new TTRecorder()
        }

        if (tt.shareAppMessage) {
            this.share = new TTShare(this)
        }

        this.loginMgr = new TTLogin(this)

        if (tt.createInterstitialAd) {
            this.insertAd = new TTInsertAd(this.configData[ADName.insert][0])
        }

        this.screenshot = new TTScreenshot(this)


    }

    vibrateShort() {
        tt.vibrateShort({
            success(res) {
                //   console.log(`${res}`);
            },
            fail(res) {
                //   console.log(`vibrateShort调用失败`);
            }
        });
    }
    showToast(title:string){
        tt.showToast({title:title})
    }

    //展示网络图片
    previewImage(imgUrl: string) {
        tt.previewImage({
            current: imgUrl, // 当前显示图片的http链接
            urls: [imgUrl] // 需要预览的图片http链接列表
        })
    }    
    checkForUpdate(callback: ResultCallback) {
        //小游戏官方的分包加载方式
        if (tt.getUpdateManager) {
            const updateManager = tt.getUpdateManager();
            console.log("getUpdateManager", updateManager);
            updateManager.onCheckForUpdate((res) => {
                // 请求完新版本信息的回调
                console.log("onCheckForUpdate", res.hasUpdate);
                if (res.hasUpdate) {
                    tt.showToast({
                        title: "即将有更新请留意"
                    });
                } else {
                    callback(ResultState.YES)
                }
            });

            updateManager.onUpdateReady(() => {
                tt.showModal({
                    title: "更新提示",
                    content: "新版本已经准备好，是否立即使用？",
                    success: function (res) {
                        if (res.confirm) {
                            // 调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate();
                        } else {
                            tt.showToast({
                                icon: "none",
                                title: "小程序下一次「冷启动」时会使用新版本"
                            });
                            callback(ResultState.YES)
                        }
                    }
                });
            });

            updateManager.onUpdateFailed(() => {
                tt.showToast({
                    title: "更新失败，下次启动继续..."
                });
                callback(ResultState.YES)
            });
        } else {
            callback(ResultState.YES)
        }
    }
}