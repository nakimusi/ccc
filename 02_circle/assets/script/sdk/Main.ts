import SDKManager from "./sdk/SDKManager";
import { ChannelID, ResultState } from "./sdk/SDKConfig";
import {AnalyticsManager} from "../base/AnalyticsManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {


    @property(cc.Prefab)
    BannerView: cc.Prefab = null;

    @property(cc.Prefab)
    nativeView: cc.Prefab = null;

    @property(cc.Prefab)
    insertView: cc.Prefab = null;

    start() {
        cc.log(cc.sys.MOBILE_BROWSER)
        cc.log(cc.sys.DESKTOP_BROWSER)
        cc.log(cc.sys.EDITOR_PAGE)
        cc.log(cc.sys.EDITOR_CORE)
        cc.log(cc.sys.WECHAT_GAME)
        cc.log(cc.sys.QQ_PLAY)
        cc.log(cc.sys.FB_PLAYABLE_ADS)
        cc.log(cc.sys.BAIDU_GAME)
        cc.log(cc.sys.VIVO_GAME)
        cc.log(cc.sys.OPPO_GAME)
        cc.log(cc.sys.HUAWEI_GAME)
        cc.log(cc.sys.XIAOMI_GAME)
        cc.log(cc.sys.JKW_GAME)
        cc.log(cc.sys.ALIPAY_GAME)
        cc.log(cc.sys.WECHAT_GAME_SUB)
        cc.log(cc.sys.BAIDU_GAME_SUB)
        cc.log(cc.sys.QTT_GAME)
        cc.log(cc.sys.BYTEDANCE_GAME)
        cc.log(cc.sys.BYTEDANCE_GAME_SUB)
        cc.log(cc.sys.LINKSURE)
        cc.log(cc.sys.BROWSER_TYPE_WECHAT)
        cc.log(cc.sys.BROWSER_TYPE_ANDROID)
        cc.log(cc.sys.BROWSER_TYPE_IE)
        cc.log(cc.sys.BROWSER_TYPE_EDGE)
        cc.log(cc.sys.BROWSER_TYPE_QQ)
        cc.log(cc.sys.BROWSER_TYPE_MOBILE_QQ)
        cc.log(cc.sys.BROWSER_TYPE_UC)
        cc.log(cc.sys.BROWSER_TYPE_UCBS)
        cc.log(cc.sys.BROWSER_TYPE_360)
        cc.log(cc.sys.BROWSER_TYPE_BAIDU_APP)
        cc.log(cc.sys.BROWSER_TYPE_BAIDU)
        cc.log(cc.sys.BROWSER_TYPE_MAXTHON)
        cc.log(cc.sys.BROWSER_TYPE_OPERA)
        cc.log(cc.sys.BROWSER_TYPE_OUPENG)
        cc.log(cc.sys.BROWSER_TYPE_MIUI)
        cc.log(cc.sys.BROWSER_TYPE_FIREFOX)
        cc.log(cc.sys.BROWSER_TYPE_SAFARI)
        cc.log(cc.sys.BROWSER_TYPE_CHROME)
        cc.log(cc.sys.BROWSER_TYPE_LIEBAO)
        cc.log(cc.sys.BROWSER_TYPE_QZONE)
        cc.log(cc.sys.BROWSER_TYPE_SOUGOU)
        cc.log(cc.sys.BROWSER_TYPE_UNKNOWN)

        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            let _channel = "wechat";
        }

        SDKManager.init(ChannelID.DEV)
        SDKManager.getChannel().checkSession((result: ResultState) => {
            // console.log(' checkSession result ', result)
            SDKManager.getChannel().login('test', (r: ResultState) => {
                // console.log(' login result ', r)
                if (r) {
                    SDKManager.getChannel().getUserInfo('ssss', 'zh', (rs: ResultState, data: any) => {
                        console.log(' getUserInfo result ', rs, data)
                    })
                }
            })
        })

        AnalyticsManager.login();
    }


    onShareResult(state: ResultState) {
        SDKManager.getChannel().showToast("分享：" + state)
    }


    onButtonOpenBannerClick() {
        this.node.addChild(cc.instantiate(this.BannerView))
    }


    onButtonInsertClick() {
        this.node.addChild(cc.instantiate(this.insertView))
    }

    onButtonNativeClick() {
        this.node.addChild(cc.instantiate(this.nativeView))
    }

    onRewardAdResult(state: ResultState) {
        SDKManager.getChannel().showToast("激励视频展示：" + state)
    }

    onInstallIconResult(state: ResultState) {
        SDKManager.getChannel().showToast("安装图标：" + state)
    }

    onBtnClick(event){
        AnalyticsManager.virtualGet(20,500,'金币',"视频")
        AnalyticsManager.virtualConsume(10,490,'金币',"提示")

        
        AnalyticsManager.levelStart("1-1")
        AnalyticsManager.levelComplete("1-1")

        AnalyticsManager.levelStart("1-2")
        AnalyticsManager.levelFailed("1-2","时间到了")


        AnalyticsManager.videoADStart("yyp-1")
        AnalyticsManager.videoADComplete("yyp-1","15","20钻石")
        
        AnalyticsManager.videoADStart("yyp-2")
        AnalyticsManager.videoADFailed("yyp-2","退出")


        AnalyticsManager.customEvent("yyp-custom-1",{key1:10,key2:"hahah"})
        AnalyticsManager.customEvent("yyp-custom-2",{key1:20})
        AnalyticsManager.customEvent("yyp-custom-3",{})
    }
}
