import {Dialogs} from "./base/Dialogs";
import {Utils} from "./base/Utils";
import {MusicManager} from "./base/MusicManager";

import {RewardAd} from "./ad/RewardAd";

const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
//弹窗需要继承Dialogs
@ccclass
export class Alchemy extends Dialogs {

    //编辑器属性
    // @property(cc.Prefab)
    // private prefab: cc.Prefab = null;

    //私有属性,请使用'_'开头,驼峰命名
    // _maxSpeed = 3;  //最大速度

    //加载完成
    onLoad () {
        //初始化变量
        this._initVariable();
        
        //初始化UI
        this._initUI();

        //初始化事件
        this._initEvent();
    }

    onDestroy() {
        //销毁事件
        this._destroyEvent();
    }

    //初始化变量
    _initVariable() {
    }

    //初始化UI
    _initUI(){

    }

    //初始化事件
    _initEvent() {
    }

    //销毁事件
    _destroyEvent() {
    }

    //将要弹窗关闭回调
    onBackClick(){
        MusicManager.playEffect('btn');
        this.close();
    }
    
    onGetClick(){
        MusicManager.playEffect('btn');
        if (RewardAd.getInstance().isLoad()) {
            let self = this;
            RewardAd.getInstance().show(function(complete){
                if (complete) {
                    yyp.eventCenter.emit('add-coin',{count:100,position:Utils.getWorldPosition(self._fire._btnGet)});
                }
            });
        }
    }
}
