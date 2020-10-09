
import { ResultCallback, SDKState, ResultState } from "../SDKConfig";
import BaseAd from "../base/BaseAd";

/**
 * https://minigame.vivo.com.cn/documents/#/api/da/incentive-video-da
 *  第一次创建视频广告对象时，已自动加载一次广告，请勿重新加载
 */
export default class VivoRewardAd extends BaseAd {

    protected callback: ResultCallback;
    private loadCount: number = 0;
    open(adID: string, callback: ResultCallback) {
        console.log(' showReward adID ', adID)
        // if (this.state == AdState.loading) {
        //     return;
        // }
        this.callback = callback;
        this.setState(SDKState.loading)
        if (this.adUnitID != adID) {
            this.adUnitID = adID
            this.createVideoAd(adID)
        } else {
            this.show()
        }


    }
    createVideoAd(id: string): void {
        this.loadCount = 0;

        console.log(' 不支持多例')
        if (this.instance == null) {
            this.instance = qg.createRewardedVideoAd({ posId: id })
            this.instance.onLoad(this.onLoad.bind(this))
            this.instance.onError(this.onError.bind(this))
            this.instance.onClose(this.onClose.bind(this))
            console.log(' 创建成功')
        } else {
            console.log(' 主动加载')
            this.instance.load();

        }



    }
    onError(err) {
        console.log('QQVideoAd error ', err)

        this.setState(SDKState.loadFail)
        if (this.callback) {
            // SDKManager.getChannel().showShare(this.rewardCallback)
            this.callback(ResultState.NO)
        }
    }
    //oppo渠道需要自己主动加载视频
    onLoad() {
        console.log('视频加载成功 ', this.loadCount)
        // if (this.loadCount == 0) {
        this.setState(SDKState.loadSucess)
        this.show()
        // }
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
                    // GlobalEvent.instance().publish(ADEventName.CHANGE_REWARD_AD_STATE, this.state)
                })
                .catch(err => {
                    console.log(' 激励视频重试失败 err ', err)
                    this.setState(SDKState.loadFail)
                    // callback(false)
                    // SDKManager.getChannel().showShare(this.rewardCallback)

                })
        })
    }
}