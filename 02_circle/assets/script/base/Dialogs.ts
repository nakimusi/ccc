import {BaseComponent} from "./BaseComponent";
import {Utils} from "./Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export class Dialogs extends BaseComponent {

    _bottomLayout_  = null;     //底层遮罩
    _topLayout_     = null;     //顶层遮罩
    _maskOpacity_   = 160;      //遮罩透明度
    _maskDuration_  = 0.2;      //遮罩渐变时间
    
    __preload() {
        super.__preload();
        
        this._bottomLayout_ = Utils.createLayout(yyp.gameFrameSize.width*2,yyp.gameFrameSize.height*2,new cc.Color(0,0,0,255),this.node);
        this._bottomLayout_.addComponent(cc.BlockInputEvents);
        this._bottomLayout_.zIndex = -1;
        this._bottomLayout_.opacity = 0;
        
        this._topLayout_ = Utils.createLayout(yyp.gameFrameSize.width*2,yyp.gameFrameSize.height*2,new cc.Color(0,0,0,255),this.node);
        this._topLayout_.zIndex = 9999;
        this._topLayout_.opacity = 0;
    }

    /**
    显示弹窗
    */
    show() {
        this._showMask_();
        this._doShowAnimation_();
    }

    /**
    关闭弹窗
    */
    close(){
        this._hideMask_();
        this._doCloseAnimation_();
        this._doCloseHide_();
    }

    //显示遮罩
    _showMask_() {
        this._bottomLayout_.stopAllActions();
        this._bottomLayout_.runAction(cc.fadeTo(this._maskDuration_, this._maskOpacity_));
        this._topLayout_.addComponent(cc.BlockInputEvents);
    }

    //隐藏遮罩
    _hideMask_() {
        this._bottomLayout_.stopAllActions();
        this._bottomLayout_.runAction(cc.fadeTo(this._maskDuration_, 0));
        this._topLayout_.addComponent(cc.BlockInputEvents);
    }
    
    //显示动画
    _doShowAnimation_() {
        let self = this;
        let onDialogOpened = function(){
            // cc.log("onDialogOpened");
            self._topLayout_.removeComponent(cc.BlockInputEvents);
            self._openedCallback();
        }
        let saveScale = this.node.scale;

		this.node.stopAllActions();
		this.node.scale = saveScale * 0.8;
		this.node.opacity = 0;
		this.node.runAction(cc.fadeIn(this._maskDuration_ + 0.1))
        this.node.runAction(cc.sequence(
            cc.scaleTo(this._maskDuration_ + 0.1, saveScale).easing(cc.easeBackInOut()),
            cc.callFunc(onDialogOpened))
        );
    }

    //关闭动画
    _doCloseAnimation_() {
        let self = this;
        let onDialogClosed = function(){
            // cc.log("closedCallback");
            self._closedCallback();
        }
        let onDialogWillClose = function(){
            // cc.log("onDialogWillClose");
            self._willCloseCallback();
        }
        let saveScale = this.node.scale;

		this.node.stopAllActions();
		this.node.runAction(cc.sequence(
			cc.callFunc(onDialogWillClose),
			cc.spawn(
				cc.fadeOut(this._maskDuration_),
                cc.scaleTo(this._maskDuration_, saveScale*0.8).easing(cc.easeBackIn())),
            cc.callFunc(onDialogClosed)));
    }

    //销毁
    _doCloseHide_(){
        this.node.runAction(cc.sequence(
            cc.delayTime(this._maskDuration_ + 0.1),
            cc.removeSelf()));
    }

    /**
    打开完成回调
    */
    _openedCallback(){
        // cc.log("Dialogs openedCallback")
    }

    /**
    关闭完成回调
    */
   _closedCallback(){
        // cc.log("Dialogs closedCallback")
    }

    /**
    将要关闭回调
    */
    _willCloseCallback(){
        // cc.log("Dialogs willCloseCallback")
    }
}
