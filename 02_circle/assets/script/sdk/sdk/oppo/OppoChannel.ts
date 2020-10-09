import BaseChannel from "../base/BaseChannel";
import { ResultCallback, ResultState } from "../SDKConfig";
import OppoRewardAd from "./OppoRewardAd";
import OppoBannerAd from "./OppoBannerAd";
import OppoInsertAd from "./OppoInsertAd";
import OppoNativeAd from "./OppoNativeAd";
import OppoSubPackage from "./OppoSubPackage";
import OppoScreenshot from "./OppoScreenshot";


export default class OppoChannel extends BaseChannel {
    constructor(id: number) {
        super(id);
        console.log('OppoChannel  constructor ')
        qg.onShow(() => {
            console.log('OppoChannel  onShow ')

        })

        qg.onHide(() => {
            console.log('OppoChannel  onHide ')

        })

        // this.bannerAd = new WXBanner()
        if (qg.createRewardedVideoAd) {
            this.rewardAd = new OppoRewardAd(this)
        }
        if (qg.createBannerAd) {
            this.bannerAd = new OppoBannerAd(this)
        }

        if (qg.createInsertAd) {
            this.insertAd = new OppoInsertAd(this)
        }
        if (qg.createNativeAd) {
            this.nativeAd = new OppoNativeAd(this)
        }
        console.log('OppoChannel  constructor  222222')
        this.subPackage = new OppoSubPackage(this)

        this.screenshot = new OppoScreenshot(this)
    }


    showToast(title: string) {
        qg.showToast({ title: title })
    }

    vibrateShort() {
        qg.vibrateShort({
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { }
        })
    }

    canInstallShortcut(func: ResultCallback) {
        qg.hasShortcutInstalled({
            success: function (res) {
                // 判断图标未存在时，创建图标
                if (res == false) {
                    func(ResultState.YES)
                } else {
                    func(ResultState.NO)
                }
            },
            fail: function (err) {
                func(ResultState.NO)
            },
            complete: function () {
                // func(false)
            }
        })
    }



    installShortcut(result: ResultCallback) {
        qg.installShortcut({
            success: function (param) {
                // 执行用户创建图标奖励
                console.log(' 安装成功 ',param)
                result(ResultState.YES)
            },
            fail: function (err) {
                console.log(' 安装失败 ', err)
                result(ResultState.NO)
            },
            complete: function () {
                // result(false)
            }
        })

    }

    setLoadingProgress(progress: number) {
        qg.setLoadingProgress({
            progress: progress
        });
    }

    loadingComplete() {
        qg.loadingComplete({
            complete: function (res) { }
        });
    }

    navigateToMiniGame(appID: string) {
        qg.navigateToMiniGame({
            pkgName: appID,
            success: function () { },
            fail: function (res) {
                // console.log(JSON.stringify(res))
            }
        })
    }

    previewImage(_tempFilePath: string) {
        qg.previewImage({
            urls: [_tempFilePath],
            success: (res) => {
                cc.log('Preview image success.');
                // self.label = '';
            }
        });
    }


}