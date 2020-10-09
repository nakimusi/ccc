
import BaseAd from "../base/BaseAd";
import { SDKState, ResultCallback, ResultState } from "../SDKConfig";

export default class BDRewardAd extends BaseAd {
    protected loadCount: number = 0;
    protected callback: ResultCallback;
    open(adID: string, callback: ResultCallback) {
        console.log(' showReward adID ', adID)
        if (this.state == SDKState.loading) {
            return;
        }
        this.callback = callback;
        this.setState(SDKState.loading)
        if (this.adUnitID != adID) {
            this.adUnitID = adID
            this.create(adID)
        } else {
            this.show()
        }


    }

    protected show(): void {
        if (!this.instance) {
            this.callback(ResultState.NO)
            return;
        }
        this.instance.show().then(() => {
            this.setState(SDKState.open)
            console.log(' 激励视频展示成功 ')

        }).catch(() => {
            // 失败重试
            console.log(' show  激励视频 播放失败重试')
            this.instance.load()
                .then(() => {
                    this.instance.show()
                    this.setState(SDKState.open)

                })
                .catch(err => {
                    console.log(' 激励视频重试失败 err ', err)
                    this.setState(SDKState.loadFail)
                    // callback(false)
                    this.channel.showShare(0, this.callback)

                })
        })
    }
    create(id: string): void {
        this.adUnitID = id;
        if (!this.instance) {
            console.log('createVideoAd id ', id)
            this.instance = swan.createRewardedVideoAd({ adUnitId: id, appSid: 'bfbff884' })
            this.instance.onLoad(this.onLoad.bind(this))
            this.instance.onError(this.onError.bind(this))
            this.instance.onClose(this.onClose.bind(this))
        }
    }

    onError(err) {
        console.log('BDRewardAd error ', err)
        this.setState(SDKState.loadFail)
        if (this.callback) {
            this.callback(ResultState.NO)
        }
    }

    onLoad() {
        console.log('视频加载成功 ', this.loadCount)
        if (this.loadCount == 0) {
            this.instance.show();
            this.setState(SDKState.loadSucess)
        }
        this.loadCount++;
        // sel
    }


    onClose(res) {
        this.setState(SDKState.close)
        if (res && res.isEnded || res === undefined) {
            console.log('视频结束关闭 ')
            // 正常播放结束，可以下发游戏奖励
            if (this.callback) {
                this.callback(ResultState.YES)
            }

        } else {
            // 播放中途退出，不下发游戏奖励
            console.log('视频中途关闭 ')
            if (this.callback) {
                this.callback(ResultState.NO);
                // ToastController.instance().intoLayer('ui.not_finish');
            }

        }
    }
}