
import {BaseComponent} from "../script/base/BaseComponent";
import {GameManager,GameStatus} from "../script/GameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export class BirdScene extends BaseComponent {

    @property(cc.Prefab)
    private finishPrefab: cc.Prefab = null;

    _score  =   0;  //当前分数

    //加载完成
    onLoad () {
        yyp.utils.init();
        yyp.music.init();
        
        cc.director.getPhysicsManager().enabled = true; //开启物理系统
        cc.director.getPhysicsManager().gravity = cc.v2(0, -1000);
        // cc.director.getPhysicsManager().debugDrawFlags= cc.PhysicsManager.DrawBits.e_jointBit | cc.PhysicsManager.DrawBits.e_shapeBit;

        //初始化事件
        this._initEvent();
    }

    start(){
        this._onGameReady();
    }

    onDestroy() {
        //销毁事件
        this._destroyEvent();
    }

    //初始化事件
    _initEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        yyp.eventCenter.on("game-ready",this._onGameReady,this);
        yyp.eventCenter.on("game-finish",this._onGameFinish,this);
    }

    //销毁事件
    _destroyEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        yyp.eventCenter.off("game-ready",this._onGameReady,this);
        yyp.eventCenter.off("game-finish",this._onGameFinish,this);
    }
    
    //点击屏幕(准备状态:开始游戏/游戏状态:控制小鸟向上)
    _onTouchStart(event) {
        if (GameManager.getInstance().getStatus() == GameStatus.Ready) {
            this._onGameStart();
        }
        else if (GameManager.getInstance().getStatus() == GameStatus.Gaming) {
            this._fire._bird.script.moveUp();
        }
    }

    //开始准备
    _onGameReady(){
        yyp.music.playEffect("swooshing");
        GameManager.getInstance().setStatus(GameStatus.Ready);
        this._fire._ready.active = true;
        this._fire._score.active = false;
        // this._fire._finish.active = false;
        this._fire._bird.script.reset();
        this._fire._pipe.script.reset();
    }

    //开始游戏
    _onGameStart(){
        GameManager.getInstance().setStatus(GameStatus.Gaming);
        this._fire._ready.active = false;
        this._fire._score.active = true;
        // this._fire._finish.active = false;
        this._fire._bird.script.setRigidToDynamic();
    }

    //游戏结束
    _onGameFinish(){
        GameManager.getInstance().setStatus(GameStatus.Finish);
        // this._fire._finish.active = true;
        // this._fire._finish.script.setScore(this._score);

        let finish = cc.instantiate(this.finishPrefab);
        finish.parent = this.node;
        finish.zIndex = 200;
        finish.x = 0;
        finish.y = 0;
        finish.script.setScore(this._score);

        this._score = 0;
        this._fire._score.$Label.string = 0;
        this._fire._score.active = false;
    }


    update(){
        //计算得分
        if (GameManager.getInstance().getStatus() == GameStatus.Gaming) {
            if (this._fire._pipe.script.judgeScore(this._fire._bird)) {
                this._score++;
                this._fire._score.$Label.string = this._score;
                yyp.music.playEffect("point");
                cc.log(this._score);
            }
        }
    }
    
}
