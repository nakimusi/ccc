import {BaseComponent} from "./base/BaseComponent";
import {MusicManager} from "./base/MusicManager";
import {LocalizedData} from "./base/LocalizedData";

import {Utils} from "./base/Utils";
import {RewardAd} from "./ad/RewardAd";


const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
//弹窗需要继承Dialogs
@ccclass
export class Skin extends BaseComponent {

    //编辑器属性
    // @property(cc.Prefab)
    // private prefab: cc.Prefab = null;

    //私有属性,请使用'_'开头,驼峰命名
    // _maxSpeed = 3;  //最大速度

    _currentHeroid = -1;
    _speed = 0;
    _moving = false;
    _heroUnlocks = [];

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
        this._heroUnlocks = LocalizedData.getJsonItem("_hero_unlock_",[1,0,0,0,0,0,0,0,0,0]);
        
    }

    //初始化UI
    _initUI(){
        for (let i = 1; i <= 10; i++) {
            const hero = this._fire["_sprHero" + i];
            hero["heroid"] = i-1;
            hero.on("click",this._onClick,this);

            let angle = 36 * (i - 1) - 90;
            let dir = Utils.degressToVectors(angle);
            hero.position = dir.mul(this._fire._sprBg.width/2);
            hero.angle = angle + 90;
            hero["heroAngle"] = Utils.correctionAngle(angle);
        }
    }

    //初始化事件
    _initEvent() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    //销毁事件
    _destroyEvent() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }
    
    _onTouchMove(event){
        this._moving = true;
        let off = event.getDelta();
        this._speed = off.x/5;
        this._fire._nHeroes.angle += this._speed;
    }

    _onTouchEnd(event){
        this._moving = false;
    }

    _onClick(event){

    }

    //每帧调用
    update (dt) {
        if (this._moving == false) {
            if (Math.abs(this._speed) < 1) {
                this._speed = 0;
            }
            else{
                if (this._speed > 0) {
                    this._speed -= 0.3;
                }
                else if (this._speed < 0) {
                    this._speed += 0.3;
                }
            }
            this._fire._nHeroes.angle += this._speed;
        }
        
        this.changeHero();
    }
    
    changeHero(){
        let heroid = this.getCurrentHeroid();
        if (this._currentHeroid != heroid) {
            if (this._currentHeroid >= 0) {
                let currentHero = this._fire["_sprHero" + (this._currentHeroid+1)];
                // currentHero.scale = 1;
                currentHero.stopAllActions();
                currentHero.runAction(cc.scaleTo(0.1,1));
            }
            if (heroid >= 0) {
                let hero = this._fire["_sprHero" + (heroid+1)];
                // hero.scale = 1.5;
                hero.stopAllActions();
                hero.runAction(cc.scaleTo(0.1,2));
            }

            this._currentHeroid = heroid;
        }

        if (heroid >= 0) {
            let isUnlock = this._heroUnlocks[heroid] == 1;
            if (isUnlock) {
                this._fire._btnUnlock.active = false;
                this._fire._lbSelect.active = true;
                this._fire._lbUse.active = false;
            }
            else{
                this._fire._btnUnlock.active = true;
                this._fire._lbSelect.active = false;
                this._fire._lbUse.active = true;
            }
        }
    }

    getCurrentHeroid(){
        for (let i = 1; i <= 10; i++) {
            const hero = this._fire["_sprHero" + i];
            hero["heroid"] = i-1;
            hero.on("click",this._onClick,this);

            // cc.log(i,Utils.correctionAngle(-this._fire._nHeroes.angle - 90),hero["heroAngle"]);
            if (Math.abs(Utils.correctionAngle(-this._fire._nHeroes.angle - 90) - hero["heroAngle"]) <= 18) {
                return i-1;
            }
        }

    }
    
    //返回按钮
    onBackClick(event){
        MusicManager.playEffect('btn');
        this.node.destroy();
    }
    
    //选择按钮
    onSelectClick(event){
        MusicManager.playEffect('btn');
        let isUnlock = this._heroUnlocks[this._currentHeroid] == 1;
        if (isUnlock) {
            LocalizedData.setIntItem("_heroid_",this._currentHeroid); 
            yyp.eventCenter.emit("change-skin");
            this.node.destroy();  
        }
        else{
            
            if (RewardAd.getInstance().isLoad()) {
                let self = this;
                RewardAd.getInstance().show(function(complete){
                    if (complete) {
                        LocalizedData.setIntItem("_test_heroid_",self._currentHeroid); 
                        yyp.eventCenter.emit("change-skin");
                        self.node.destroy();
                    }
                });
            }
            else{
                if (cc.sys.platform === cc.sys.DESKTOP_BROWSER){
                    LocalizedData.setIntItem("_test_heroid_",this._currentHeroid); 
                    yyp.eventCenter.emit("change-skin");
                    this.node.destroy();  
                }
            }

        }

    }
    
    //解锁按钮
    onUnlockClick(event){
        MusicManager.playEffect('btn');
        if (this._fire._nCoinItem.script.count() >= 10) {
            this._fire._btnUnlock.active = false;
            this._fire._lbSelect.$Label.string = "选择";

            this._heroUnlocks[this._currentHeroid] = 1;
            LocalizedData.setJsonItem("_hero_unlock_",this._heroUnlocks);
            
            yyp.eventCenter.emit('add-coin',{count:-10});
            this._fire._nCoinItem.script.refresh(-10);
        }
    }

}
