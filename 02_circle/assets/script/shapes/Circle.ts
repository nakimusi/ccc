import {BaseComponent} from "../base/BaseComponent";
import {Utils} from "../base/Utils";
import {MusicManager} from "../base/MusicManager";

const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
@ccclass
export class Circle extends BaseComponent {

    _isJump = false;        //是否处在跳跃状态
    _isJumpUp = false;      //是否处在跳跃(上升)状态
    _isJumpDown = false;    //是否处在跳跃(下降)状态
    _jumpUpTime = 0;        //上升状态持续时间
    _jumpDownTime = 0;      //下降状态持续时间
    _jumpHeight = 0;        //当前跳跃的高度
    _jumpMaxHeight = 0;     //跳跃的最大高度
    _jumpDownHeight = 0;    //下降状态总高度
    _jumpDownAllTime = 0;   //下降状态持续总时间

    _isIndicator = true;    //是否处在提示状态
    _indicatorTime = 0;     //提示状态持续时间
    _indicatorLifespan = 0; //提示状态总时间

    _isFree = false;        //是否处在空闲状态
    _freeTime = 0;          //空闲状态持续时间

    _shapeSpace = 0;        //当前形状留白距离
    _shapeAngle = 270;      //当前形状角度
    _shapeSpeed = 0;        //移动速度

    _circle = null;
    _radius = 0;            //围着转的圆圈半径
    _config:any = {};       //当前形状移动相关配置   

    _win = false;           //已经胜利
    _fail = false;          //已经失败

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
        this._fire._shape.script.setShape(this);
    }

    //初始化事件
    _initEvent() {
    }

    //销毁事件
    _destroyEvent() {
    }

    start(){
    }

    //初始化
    init(config, circle){
        this._radius = circle.getRadius();
        this._config = config;
        this._circle = circle;

        this._jumpMaxHeight = this._config.jump.maxHeight * this._radius;
        this._shapeSpeed = Utils.randomIntEx(this._config.movementSpeed);
        this._shapeAngle = Utils.randomIntEx(this._config.position || [0,360]) - 90;

        this.node.scale = Utils.randomIntEx(this._config.scale.width)*this._radius/this._fire._shape.width;
        this._shapeSpace = this._fire._shape.width/2 * this.node.scale;
        this.move(this._shapeAngle);
    }

    //移动
    move(angle) {
        //角度
        this.node.angle = angle + 90;

        //位置
        let dir = Utils.degressToVectors(angle);
        let pos = dir.mul(this._radius - this._shapeSpace - this._jumpHeight);
        this.node.position = cc.v3(pos);
    }

    //每帧调用
    update(dt) {
        if (this._win) return;

        let speed = this._shapeSpeed;
        if (this._isIndicator) {
            if (this._indicatorTime == 0) {
                this._fire._shape.color = cc.Color.YELLOW;
                this._indicatorLifespan = Utils.randomFloatEx(this._config.indicator.lifespan);
                let blinkSpeed = Utils.randomFloatEx(this._config.indicator.blinkSpeed);
                this._fire._shape.runAction(cc.sequence(
                    cc.fadeIn(blinkSpeed),
                    cc.delayTime(this._config.indicator.delay),
                    cc.fadeOut(0)
                ).repeatForever());
            }

            this._indicatorTime += dt;
            if (this._indicatorTime >= this._indicatorLifespan) {
                this._fire._shape.color = cc.Color.BLACK;
                this._fire._shape.stopAllActions();
                this._fire._shape.opacity = 255;
                this._isIndicator = false;
                this._isJump = true;
                this._isJumpUp = true;
                this._isJumpDown = false;
            }
            speed = 0;
        }
        else if (this._isJump){
            if (this._isJumpUp) {
                this._jumpUpTime += dt;
                let rate = this._jumpUpTime/this._config.jump.timeToApex - 1;
                this._jumpHeight = this._jumpMaxHeight * (rate*rate*rate+1);
                if (this._jumpUpTime >= this._config.jump.timeToApex) {
                    this._jumpHeight = this._jumpMaxHeight;
                    this._jumpUpTime = 0;
                    this._isJumpUp = false;
                    this._isJumpDown = true;
                    
                    this._jumpDownHeight = this._jumpHeight;
                    this._jumpDownAllTime = this._config.jump.timeToGround;
                }
            }
            else if (this._isJumpDown) {
                this._jumpDownTime += dt;
                let rate = this._jumpDownTime/this._jumpDownAllTime;
                this._jumpHeight = this._jumpDownHeight * (1 - rate*rate*rate);
                if (this._jumpDownTime >= this._jumpDownAllTime) {
                    this._jumpHeight = 0;
                    this._jumpDownTime = 0;
                    this._isJumpUp = false;
                    this._isJumpDown = false;
                    this._isJump = false;
                    this._isFree = true;
                    MusicManager.playEffect('jumping_ball');
                }
            }
        }
        else if (this._isFree){
            this._freeTime += dt;
            if (this._freeTime >= this._config.jump.jumpDelayInterval || 0) {
                this._freeTime = 0;
                this._isFree = false;
                this._isJump = true;
                this._isJumpUp = true;
                this._isJumpDown = false;
            }
        }

        //移动
        this._shapeAngle -= dt * speed; 
        if (this._shapeAngle < 0) {
            this._shapeAngle += 360;
        }
        this.move(this._shapeAngle);
    }

    //是否处于提示状态
    isIndicator(){
        return this._isIndicator;
    }

    //设置结果
    setResult(result){
        // cc.log("circle setResult ",result);

        if (result) {
            this._win = true;
            this.node.runAction(cc.sequence(
                cc.delayTime(1),
                cc.fadeOut(0.5),
                cc.removeSelf()
            ));
        }
        else{
            this._fail = true;
        }
        
    }
}
