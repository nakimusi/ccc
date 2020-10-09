import {BaseComponent} from "../base/BaseComponent";
import {Utils} from "../base/Utils";


const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
@ccclass
export class Coin extends BaseComponent {
    

    _shapeSpace = 0;        //当前形状留白距离
    _shapeAngle = 270;      //当前形状角度
    _shapeSpeed = 0;        //移动速度

    _circle = null;
    _radius = 0;            //围着转的圆圈半径

    _win = false;           //已经胜利
    _fail = false;          //已经失败

    _coinNum = 1;

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
    init(circle,num){
        this._radius = circle.getRadius();
        this._circle = circle;
        this._coinNum = Utils.randomInt(num+1,num+5);
        this._fire._lbNum.$Label.string = this._coinNum;

        this._shapeSpeed = Utils.randomInt(2,5)*10;
        this._shapeAngle = this._coinNum*40;

        this.node.scale = 0.5;
        this._shapeSpace = Utils.randomInt(6,8)*10;
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

        //移动
        this._shapeAngle -= dt * this._shapeSpeed; 
        if (this._shapeAngle < 0) {
            this._shapeAngle += 360;
        }
        this.move(this._shapeAngle);
    }

    //是否处于提示状态
    isIndicator(){
        return false;
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

    getCoinNum(){
        return this._coinNum;
    }
}
