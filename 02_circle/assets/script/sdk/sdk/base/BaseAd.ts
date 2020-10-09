import { SDKState, ResultCallback } from "../SDKConfig";
import BaseChannel from "./BaseChannel";
/**
 * 所有广告的父类
 * 
 */
export default abstract class BaseAd {
    //广告状态
    protected state: SDKState = SDKState.close;
    //当前使用的广告ID
    protected adUnitID: string = ''
    //游戏逻辑状态
    protected logicState: SDKState = SDKState.open
    //当前广告实例
    protected instance: any = null;
    //广告实例保存位置
    protected instanceMap = {}

    //连续点击次数
    protected clickCount: number = 0;

    //广告展示次数
    protected showCount: number = 0

    protected callback: any;
    protected channel: BaseChannel;

    constructor(channel: BaseChannel) {
        this.channel = channel;
    }
    setState(s: SDKState) {
        this.state = s;
    }

    getState() {
        return this.state;
    }


    abstract open(adID: string, callback?: Function)

    close() {

    }
    reportAdClick(adId) { }

    reportAdShow(adId) { }
}