import {BaseComponent} from "./base/BaseComponent";
import {Utils} from "./base/Utils";
import {MusicManager} from "./base/MusicManager";

import {InsertAd} from "./ad/InsertAd";

const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
//弹窗需要继承Dialogs
@ccclass
export class GameMain extends BaseComponent {

    //编辑器属性
    @property(cc.Prefab)
    private GameCirclePrefab: cc.Prefab = null;
    
    @property(cc.Prefab)
    private SkinPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    private LevelPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    private AlchemyPrefab: cc.Prefab = null;

    //私有属性,请使用'_'开头,驼峰命名
    // _maxSpeed = 3;  //最大速度

    _gaming = false;
    _gameCircle = null;

    _finishCount = 0;

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
        this._fire._nUI.y = yyp.safeTopBottom-30;

        this._gameInit(0);
        this.showMainBtns();
        
        this._fire._recommendBtns.runAction(cc.moveTo(0.1,-270,0));
        Utils.doQAction(this._fire._btnCube);
        Utils.doQAction(this._fire._btnTank);
        
        this._fire._winParticle1.opacity = 0;
        this._fire._winParticle2.opacity = 0;
        this._fire._winParticle1.$ParticleSystem.stopSystem();
        this._fire._winParticle2.$ParticleSystem.stopSystem();
    }

    //初始化事件
    _initEvent() {
        yyp.eventCenter.on("game-start",this._gameStart,this);
        yyp.eventCenter.on("game-finish",this._gameFinish,this);
        yyp.eventCenter.on('add-coin',this._addCoin,this);
    }


    //销毁事件
    _destroyEvent() {
        yyp.eventCenter.off("game-start",this._gameStart,this);
        yyp.eventCenter.off("game-finish",this._gameFinish,this);
        yyp.eventCenter.off('add-coin',this._addCoin,this);
    }

    // 金币增加
    _addCoin(event){
        this._fire._nCoinItem.script.refresh(event.count,event.position);
    }

    _gameStart(event){
        this._fire._winParticle1.opacity = 0;
        this._fire._winParticle2.opacity = 0;
        this._fire._winParticle1.$ParticleSystem.stopSystem();
        this._fire._winParticle2.$ParticleSystem.stopSystem();
        if (this._gaming == false) {
            this._gaming = true;
            let self = this;
            
            this._fire._recommendBtns.runAction(cc.moveTo(0.1,-390,0));

            this._gameCircle.script.doDestroy();
            this._fire._sprLogo.runAction(cc.fadeOut(0.2));
            this._fire._nBtns.runAction(cc.fadeOut(0.2));
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(0.2),
                    cc.callFunc(function(){
                        self._fire._nBtns.active = false;
                        self._gameInit(event.level);
                        // self._gameInit(11);
                    })
                )
            );
        }
    }
    
    _gameFinish(event){
        if (event.result == 1) {
            this._fire._winParticle1.opacity = 255;
            this._fire._winParticle2.opacity = 255;
            this._fire._winParticle1.$ParticleSystem.resetSystem();
            this._fire._winParticle2.$ParticleSystem.resetSystem();
        }
        this._gaming = false;
        this.showGameBtns();

        this._finishCount++;
        if (this._finishCount >= 5) {
            if (InsertAd.getInstance().isLoad()) {
                this._finishCount = 0;
                InsertAd.getInstance().show();
            }
        }
    }

    _gameInit(level){
        cc.log("_gameInit ",level);
        this._gameCircle = cc.instantiate(this.GameCirclePrefab);
        this._gameCircle.parent = this.node;
        this._gameCircle.script.init(level);
    }

    showMainBtns(){
        this._fire._nBtns.active = true;
        this._fire._btnHome.active = false;

        this._fire._nBtns.runAction(cc.fadeIn(0.2));
    }

    showGameBtns(){
        this._fire._nBtns.active = true;
        this._fire._btnHome.active = true;
                
        this._fire._nBtns.runAction(cc.fadeIn(0.2));
    }

    //设置
    onSettingClick(event){
        MusicManager.playEffect('btn');
        this._fire._nSetting.script.show();
    }
    
    //关卡
    onLevelClick(event){
        MusicManager.playEffect('btn');

        let skin = cc.instantiate(this.LevelPrefab);
        skin.zIndex = 100;
        skin.x = 0;
        skin.y = 0;
        skin.parent = this.node;
    }

    //设置
    onSkinClick(event){
        MusicManager.playEffect('btn');

        let skin = cc.instantiate(this.SkinPrefab);
        skin.zIndex = 100;
        skin.x = 0;
        skin.y = 0;
        skin.parent = this.node;
    }
    
    //主页
    onHomeClick(event){
        MusicManager.playEffect('btn');
        
        this._fire._recommendBtns.runAction(cc.moveTo(0.1,-270,0));

        this._fire._btnHome.$Button.interactable = false;

        let self = this;
            
        this._gameCircle.script.doDestroy();
        // this._fire._sprLogo.runAction(cc.fadeOut(0.2));
        this._fire._nBtns.runAction(cc.fadeOut(0.2));
        this.node.runAction(
            cc.sequence(
                cc.delayTime(0.2),
                cc.callFunc(function(){
                    self._fire._btnHome.$Button.interactable = true;
                    self._fire._sprLogo.runAction(cc.fadeIn(0.2));
                    self._gameInit(0);
                    self.showMainBtns();
                })
            )
        );

    }
    
    //炼金(看广告，得金币)
    onAlchemyClick(event){
        MusicManager.playEffect('btn');

        Utils.showDialogs(this.AlchemyPrefab);
        
    }

    // SkinPrefab
}
