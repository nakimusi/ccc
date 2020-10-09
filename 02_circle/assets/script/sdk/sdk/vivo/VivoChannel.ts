import BaseChannel from "../base/BaseChannel";
import { ResultCallback, ResultState } from "../SDKConfig";
import VivoRewardAd from "./VivoRewardAd";
import VivoBannerAd from "./VivoBannerAd";
import VivoInsertAd from "./VIvoInsertAd";
import VivoNativeAd from "./VivoNativeAd";
export default class VivoChannel extends BaseChannel {

    constructor(id: number) {
        super(id);

        qg.onShow(() => {
            console.log('VivoChannel  onShow ')

        })

        qg.onHide(() => {
            console.log('VivoChannel  onHide ')

        })

        console.log('qg ',qg)
        // this.bannerAd = new WXBanner()
        if (qg.createRewardedVideoAd) {
            this.rewardAd = new VivoRewardAd(this)
        }

        if (qg.createBannerAd) {
            this.bannerAd = new VivoBannerAd(this)
        }
   

        if (qg.createInsertAd) {
            this.insertAd = new VivoInsertAd(this)
        }
 
        if (qg.createNativeAd) {
            this.nativeAd = new VivoNativeAd(this)
        }
   
 
    }

    showToast(title:string){
        qg.showToast({
            message: title
          })
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

    previewImage(_tempFilePath: string) {
        qg.previewImage({
            uris: [_tempFilePath],
            success: (res) => {
                cc.log('Preview image success.');
                // self.label = '';
            }
        });
    }


    installShortcut(result: ResultCallback) {
        qg.installShortcut({
            success: function () {
                // 执行用户创建图标奖励
                console.log(' 安装成功 ')
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



    navigateToMiniProgram(appID: string) {
        qg.navigateToMiniGame({
            pkgName: appID,
            success: function () { },
            fail: function (res) {
                // console.log(JSON.stringify(res))
            }
        })
    }



}