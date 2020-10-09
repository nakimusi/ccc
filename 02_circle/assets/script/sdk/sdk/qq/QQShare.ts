import { BaseShare } from "../base/BaseShare";
import { ResultCallback, ADName, SDKState, ResultState } from "../SDKConfig";

export default class QQShare extends BaseShare {

    protected time: number = 0;
    constructor(channel) {
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
            imageUrlId: ''
        }
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
