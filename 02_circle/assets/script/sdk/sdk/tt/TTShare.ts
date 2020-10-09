import { BaseShare } from "../base/BaseShare";

import SDKManager from "../SDKManager";
import { ResultCallback, SDKState, ADName, ResultState } from "../SDKConfig";

export default class TTShare extends BaseShare {


    constructor(channel) {
        super(channel);
        // GlobalEvent.instance().addEventListener(GlobalEvent.EVENT_SHOW, this.backGame, this)
        tt.showShareMenu({
            withShareTicket: true,
        });
        tt.updateShareMenu({
            withShareTicket: true
        })
        wx.onShareAppMessage(function () {
            // 用户点击了“转发”按钮
            // let visibleOrigin = Laya.Browser.clientWidth
            // let visibleSize = Laya.Browser.clientHeight

            return {
                title: this.channel.getParam(0, ADName.shareTitle),
                imageUrl: this.channel.getParam(0, ADName.shareImage),
                imageUrlId: '',
                success: () => {
                    console.log('onShareAppMessage 分享成功');
                },
                fail: (e) => {
                    console.log('分享失败', e);
                }
                // imageUrl: canvas.toTempFilePathSync({
                //     x: visibleOrigin.x,
                //     y: visibleOrigin.y,
                //     destWidth: visibleSize.width,
                //     destHeight: visibleSize.height
                // }),
                // success: () => {
                //     console.log('分享成功')
                //     this.shareSuccess();
                // },
                // fail: (e) => {
                //     console.log('分享失败', e)
                // }
            }
        })
    }
    protected getData(site): any {
        let data = {
            title: this.channel.getParam(site, ADName.shareTitle),
            imageUrl: this.channel.getParam(site, ADName.shareImage),
            imageUrlId: ''
        }
        return data;
    }



    share(index: number, func?: ResultCallback, isShowRecorder?: boolean) {
        // this.callback = func;
        let title = this.channel.getParam(index, ADName.shareTitle);
        let videoPath = this.channel.getRecorder().getVideoPath();
        if (isShowRecorder && videoPath) {

            tt.shareAppMessage({
                channel: 'video',
                title: title,
                extra: {
                    videoPath: videoPath,
                },
                success: () => {
                    console.log('分享成功');
                    if (func) {
                        func(ResultState.YES);
                    }
                    // this.shareSuccess();
                    this.channel.getRecorder().clear();
                },
                fail: (e) => {
                    console.log('分享失败', e);
                    if (e.errMsg.indexOf('short') >= 0) {
                        this.share(0, func, false)
                    } else {
                        func(ResultState.NO);
                        // ToastController.instance().showLayerByText("分享失败")
                    }

                }
                // x: visibleOrigin.x,
                // y: visibleOrigin.y,
                // imageUrl: canvas.toTempFilePathSync({
                //   destWidth: visibleSize.width,
                //   destHeight: visibleSize.height
                // })
            })
        } else {
            tt.shareAppMessage({
                desc: title,
                imageUrl: this.channel.getParam(index, ADName.shareImage),
                title: '分享有礼',
                imageUrlId: '',
                success: () => {
                    console.log('分享成功');
                    if (func) {
                        func(ResultState.YES);
                    }
                    // this.shareSuccess();
                },
                fail: (e) => {
                    console.log('分享失败');
                    func(ResultState.NO);
                    // ToastController.instance().showLayerByText("分享失败")
                }

            })
        }
    }

    getShareInfo(shareTicket: string, func: (result) => void) {
        if (shareTicket) {
            tt.getShareInfo({
                shareTicket: shareTicket,
                success: () => {

                },
                fail: () => {

                }
            });
        }

    }


}
