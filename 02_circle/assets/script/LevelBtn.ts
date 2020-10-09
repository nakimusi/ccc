import {BaseComponent} from "./base/BaseComponent";
import {LocalizedData} from "./base/LocalizedData";
import {MusicManager} from "./base/MusicManager";


const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
//弹窗需要继承Dialogs
@ccclass
export class LevelBtn extends BaseComponent {

    @property(cc.SpriteFrame)
    private bgFrames: cc.SpriteFrame[] = [];

    _data = null;
    _level = 1;

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

    //每帧调用
    // update (dt) {
    // }
    
    //打开弹窗完成回调
    // _openedCallback(){
    // }

    //关闭弹窗完成回调
    // _closedCallback(){
    // }

    //将要弹窗关闭回调
    // _willCloseCallback(){
    // }

    init(data,maxLevel,level){
        this._data = data;
        this._level = this._data.Type;

        this._fire._lb.$Label.string = this._level;
        
        //替换资源,设置按钮大小
        this._fire._bg.$Sprite.spriteFrame = this.bgFrames[this._data.Color - 1];
        if (this._data.Radius == 150) {
            this._fire._bg.width = 80;
            this._fire._bg.height = 80;
            this._fire._bgCircle.width = 100;
            this._fire._bgCircle.height = 100;
        }
        else if (this._data.Radius == 190) {
            this._fire._bg.width = 100;
            this._fire._bg.height = 100;
            this._fire._bgCircle.width = 120;
            this._fire._bgCircle.height = 120;
        }
        else if (this._data.Radius == 230) {
            this._fire._bg.width = 120;
            this._fire._bg.height = 120;
            this._fire._bgCircle.width = 140;
            this._fire._bgCircle.height = 140;
        }

        this._fire._bgCircle.active = (this._level == level); //当前关卡才显示圈圈

        //设置按钮是否可点击
        if (this._level > maxLevel) {
            this._fire._bg.$Button.interactable = false;
        }
        else{
            this._fire._bg.$Button.interactable = true;
        }
    }

    onClick(){
        cc.log(this._fire._lb.$Label.string)
        
        MusicManager.playEffect('btn');
        
        LocalizedData.setIntItem("_level_",this._level);
        yyp.eventCenter.emit('game-start',{level:this._level});

        //回调设置好的函数
        if (this['_callBack']) {
            this['_callBack'].emit([this._level]);
        }
    }
}
