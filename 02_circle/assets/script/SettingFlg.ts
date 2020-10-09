import {BaseComponent} from "./base/BaseComponent";
import {LocalizedData} from "./base/LocalizedData";
import {MusicManager} from "./base/MusicManager";


const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
//弹窗需要继承Dialogs
@ccclass
export class SettingMusic extends BaseComponent {

    //编辑器属性
    @property(cc.SpriteFrame)
    onSpriteFrame : cc.SpriteFrame = null;
    
    @property(cc.SpriteFrame)
    offSpriteFrame : cc.SpriteFrame = null;

    @property()
    typeString = "music";     //(music/effect/shake)

    _flg = 1;   //开关 (0 关 / 1 开)

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
        this._flg = LocalizedData.getIntItem(`_${this.typeString}_flg_`,1);
    }

    //初始化UI
    _initUI(){
        this.node["$Sprite"].spriteFrame = this._flg == 1 ? this.onSpriteFrame : this.offSpriteFrame;
    }

    //初始化事件
    _initEvent() {
        this.node.on('click', this._onChange, this);
    }

    //销毁事件
    _destroyEvent() {
        this.node["$Button"].off('click', this._onChange, this);
    }

    _onChange () {
        MusicManager.playEffect('btn');

        this._flg = this._flg == 1 ? 0 : 1;
        this.node["$Sprite"].spriteFrame = this._flg == 1 ? this.onSpriteFrame : this.offSpriteFrame;
        
        LocalizedData.setIntItem(`_${this.typeString}_flg_`,this._flg);
        
        if (this.typeString == "music") {
            cc.audioEngine.setMusicVolume(this._flg);
        }
        else{
            cc.audioEngine.setEffectsVolume(this._flg);
        }
    }
    
    //打开弹窗完成回调
    // _openedCallback(){
    // }

    //关闭弹窗完成回调
    // _closedCallback(){
    // }

    //将要弹窗关闭回调
    // _willCloseCallback(){
    // }
}
