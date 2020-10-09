import {BaseComponent} from "./base/BaseComponent";
import {MusicManager} from "./base/MusicManager";


const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
//弹窗需要继承Dialogs
@ccclass
export class Setting extends BaseComponent {

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
        this._fire._sprBg.active = false;
        this._fire._btns.x = -640;
    }

    //初始化事件
    _initEvent() {
        this._fire._sprBg.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
    }

    _onTouchStart(event) {
        this._hide();

    }

    //销毁事件
    _destroyEvent() {
        this._fire._sprBg.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
    }

    show(){
        this._fire._sprBg.active = true;

        this._fire._btns.runAction(cc.moveBy(0.2,640,0));
    }

    _hide(){
        this._fire._sprBg.active = false;
        
        this._fire._btns.runAction(cc.moveBy(0.2,-640,0));
    }
    
    onCloseClick(event){
        MusicManager.playEffect('btn');
        this._hide();
    }
}
