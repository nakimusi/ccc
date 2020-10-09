import BaseChannel from "./base/BaseChannel";
import { ChannelID } from "./SDKConfig";
import WXChannel from "./wx/WXChannel";
import OppoChannel from "./oppo/OppoChannel";
import QQChannel from "./qq/QQChannel";
import VivoChannel from "./vivo/VivoChannel";
import TTChannel from "./tt/TTChannel";
import BDChannel from "./bd/BDChannel";
import DevChannel from "./dev/DevChannel";

export default class SDKManager {

    protected channel: BaseChannel = null;

    static channel: BaseChannel;
    static getChannel() {
        return this.channel;
    }

    static init(id: ChannelID) {
        let channelID: number = id
        switch (channelID) {
            case ChannelID.WX:
                this.channel = new WXChannel(channelID)
                break;
            case ChannelID.BD:
                this.channel = new BDChannel(channelID)
                break;
            case ChannelID.TT:
                this.channel = new TTChannel(channelID)
                break;
            case ChannelID.VIVO:
                this.channel = new VivoChannel(channelID)
                break;
            case ChannelID.OPPO:
                this.channel = new OppoChannel(channelID)
                break;
            case ChannelID.QQ:
                this.channel = new QQChannel(channelID)
                break;
            default:
                this.channel = new DevChannel(channelID)
                break;
        }

    }

    //是否有分享能力
    static hasShare() {
        return this.channel.hasShare();
    }

    //分享
    static showShare(site, callback, isShowRecorder?: boolean) {
        return this.channel.showShare(site, callback, isShowRecorder);
    }
}
