import { ResultCallback, SDKState } from "../SDKConfig";
import BaseChannel from "./BaseChannel";


export abstract class BaseShare {

    protected state: SDKState = SDKState.close;

    protected callback: ResultCallback = null

    protected channel: BaseChannel;

    constructor(channel: BaseChannel) {
        this.channel = channel;
    }
    /**
     * 
     * @param title  分享标题
     * @param func 分享回调函数
     * @param isShowRecorder 是否分享录屏 
     */
    abstract share(site: number, func?: ResultCallback, isShowRecorder?: boolean)
    
    getShareInfo(shareTicket: string, func: (result) => void) {}
}
