import {BaseComponent} from "../base/BaseComponent";
import {Utils} from "../base/Utils";


const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
@ccclass
export class Rectangle extends BaseComponent {
    
    _isIndicator = true;    //是否处在提示状态
    _indicatorTime = 0;     //提示状态持续时间
    _indicatorLifespan = 0; //提示状态总时间


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

        this._shapeSpeed = Utils.randomIntEx(this._config.movementSpeed);
        this._shapeAngle = Utils.randomIntEx(this._config.position || [0,360]) - 90;

        this.node.scaleX = Utils.randomIntEx(this._config.scale.width)*this._radius/this._fire._shape.width;
        this.node.scaleY = Utils.randomIntEx(this._config.scale.height)*this._radius/this._fire._shape.height;
        this._shapeSpace = this._radius - Math.sqrt(this._radius*this._radius - (this._fire._shape.width/2 * this.node.scale)*(this._fire._shape.width/2 * this.node.scale))
        this.move(this._shapeAngle);
    }

    //移动
    move(angle) {
        //角度
        this.node.angle = angle + 90;

        //位置
        let dir = Utils.degressToVectors(angle);
        let pos = dir.mul(this._radius - this._shapeSpace);
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
            }
            speed = 0;
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
        // cc.log("Rectangle setResult ",result);

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
