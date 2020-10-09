import {BaseComponent} from "./base/BaseComponent";
import {MusicManager} from "./base/MusicManager";
import {AnalyticsManager} from "./base/AnalyticsManager";
import SDKManager from "./sdk/sdk/SDKManager";
import { ChannelID, ResultState } from "./sdk/sdk/SDKConfig";

import {BannerAd} from "./ad/BannerAd";
import {InsertAd} from "./ad/InsertAd";
import {RewardAd} from "./ad/RewardAd";

const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
@ccclass
export class GameScene extends BaseComponent {

    //编辑器属性
    @property(cc.Prefab)
    private MainPrefab: cc.Prefab = null;


    //加载完成
    onLoad () {
        let manager=cc.director.getCollisionManager();  // 获取碰撞检测类
        manager.enabled=true   //开启碰撞检测
        // manager.enabledDebugDraw=true //显示碰撞检测区域
        // manager.enabledDrawBoundingBox = true;// 显示碰撞组件的包围盒

        AnalyticsManager.login();   //数据统计
        
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            SDKManager.init(ChannelID.WX)
        }
        else{
            SDKManager.init(ChannelID.DEV)
        }
        SDKManager.getChannel().checkSession((result: ResultState) => {
            console.log(' checkSession result ', result)
            SDKManager.getChannel().login('test', (r: ResultState) => {
                console.log(' login result ', r)
                if (r) {
                    SDKManager.getChannel().getUserInfo('ssss', 'zh', (rs: ResultState, data: any) => {
                        console.log(' getUserInfo result ', rs, data)
                    })
                }
            })
        })

        MusicManager.initConfig();
        
        //初始化变量
        this._initVariable();
        
        //初始化UI
        this._initUI();

        //初始化事件
        this._initEvent();
    }

    start(){
        BannerAd.getInstance().showBottom();   
        InsertAd.getInstance();
        RewardAd.getInstance();
    }
    
    onDestroy() {
        AnalyticsManager.logout();   //数据统计
        //销毁事件
        this._destroyEvent();
    }

    //初始化变量
    _initVariable() {
    }

    //初始化UI
    _initUI(){
        let game = cc.instantiate(this.MainPrefab);
        game.x = 0;
        game.y = 0;
        game.parent = this._fire._lyGame;
    }

    //初始化事件
    _initEvent() {
    }

    //销毁事件
    _destroyEvent() {
    }

}
