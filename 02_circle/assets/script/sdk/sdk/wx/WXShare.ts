import { BaseShare } from "../base/BaseShare";

import { ResultCallback, ADName, SDKState, ResultState } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";
/**
 * auth 游子陈
 * https://developers.weixin.qq.com/minigame/dev/api/share/wx.shareAppMessage.html
 */
export default class WXShare extends BaseShare {
    //由于微信无法得到分享结果，所以以时间来判断是否成功。
    protected time: number = 0;
    protected callback:ResultCallback;
    constructor(channel: BaseChannel) {
        super(channel);

        wx.showShareMenu({
            withShareTicket: true,
        });

        wx.updateShareMenu({
            withShareTicket: true
        })
        wx.onShow(() => {
            this.backGame()
        })
        wx.onShareAppMessage(() => {
            // 用户点击了“转发”按钮
            return this.getData(0)
        })
    }


    share(site: number, func?: ResultCallback, isShowRecorder?: boolean) {
        this.callback = func;
        wx.shareAppMessage(this.getData(site))
        this.state = SDKState.open;
        this.time = Date.now();
    }

    protected getData(site): any {
        let data = {
            title: this.channel.getParam(site, ADName.shareTitle),
            imageUrl: this.channel.getParam(site, ADName.shareImage),
            imageUrlId: this.channel.getParam(site, ADName.shareImageId)
        }
        // cc.log(site);
        // cc.log(data);
        return data;
    }



    protected backGame() {

        if (this.state == SDKState.open) {
            this.state = SDKState.close;
            if (this.callback) {
                let disTime = Date.now() - this.time
                if (disTime >= 3000) {
                    this.callback(ResultState.YES);
                } else {
                    this.callback(ResultState.NO);
                }
                this.callback = null;
            }
        }
    }

    getShareInfo(shareTicket: string, func: (result) => void) {
        if (shareTicket) {
            wx.getShareInfo({
                shareTicket: shareTicket,
                success: (res) => {
                    func(res)
                },
                fail: () => {

                }
            });
        }

    }
}
