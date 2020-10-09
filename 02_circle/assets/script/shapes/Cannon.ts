import {BaseComponent} from "../base/BaseComponent";
import {Utils} from "../base/Utils";


const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
@ccclass
export class Cannon extends BaseComponent {

    _shootingTime = 0;          //射击时间
    _shootingActiveTime = 0;    //射击生效时间
    _shootingSpeed = 0;         //子弹移动速度
    
    _shapeSpace = 0;        //当前形状留白距离
    _shapeAngle = 270;          //当前形状角度
    _shapeSpeed = 0;        //移动速度

    _bullets = [];

    _radius = 0;            //围着转的圆圈半径
    _config:any = {};       //当前形状移动相关配置   

    _circle = null;
    _scaleRate = 1;

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
        
        this._shootingActiveTime = Utils.randomFloatEx(this._config.projectile.shootingInterval);
        this._shootingSpeed = Utils.randomFloatEx(this._config.projectile.velocity);
        this._shapeAngle = Utils.randomIntEx(this._config.position || [0,360]) - 90;
        this._shapeSpeed = Utils.randomIntEx(this._config.movementSpeed);

        this._scaleRate = 1.3*Utils.randomIntEx(this._config.scale.width)*this._radius/this._fire._shape.height;
        this.node.scale = this._scaleRate;
        this._shapeSpace = this._fire._shape.height*this.node.scaleY;

        this._fire._shape.color = cc.Color.BLACK;
        this.move(this._shapeAngle);
    }

    //移动
    move(angle) {
        //角度
        this.node.angle = angle-90;

        //位置
        let dir = Utils.degressToVectors(angle);
        let pos = dir.mul(this._shapeSpace);
        this.node.position = cc.v3(pos);
    }

    //每帧调用
    update(dt) {
        this._shootingTime += dt;
        if (this._shootingTime >= this._shootingActiveTime) {
            this._shootingTime = 0;
            let scale = this._scaleRate*0.5;
            this._circle.createBullet(this._fire._shape.$Sprite.spriteFrame,this.node.position,this.node.angle,this._fire._shape.anchorX,this._fire._shape.anchorY,scale,this._shootingSpeed);
        }

        //移动
        this._shapeAngle -= dt * this._shapeSpeed;
        if (this._shapeAngle < 0) {
            this._shapeAngle += 360;
        }
        this.move(this._shapeAngle);
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
