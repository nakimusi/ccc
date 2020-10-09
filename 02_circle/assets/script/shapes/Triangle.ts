    import {BaseComponent} from "../base/BaseComponent";
    import {Utils} from "../base/Utils";


    const {ccclass, property} = cc._decorator;

    //私有函数,请使用'_'开头
    //请修改'NewClass' => 自己的类名
    @ccclass
    export class Triangle extends BaseComponent {

        _shapeSpace = 0;        //当前形状留白距离
        _shapeAngle = 270;      //当前形状角度

        _circle = null;
        _radius = 0;            //围着转的圆圈半径
        _config:any = {};       //当前形状移动相关配置   

        _repeatCount = 0;
        _collisionAllow = false;
        
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
            this.doAction();
        }

        //初始化
        init(config, circle){
            this._radius = circle.getRadius();
            this._config = config;
            this._circle = circle;

            this._repeatCount = Utils.randomIntEx(this._config.reappearance.count);
            this._shapeAngle = Utils.randomIntEx(this._config.position || [0,360]) - 90;

            this.node.scaleX = Utils.randomIntEx(this._config.scale.width)*this._radius/this._fire._shape.width;
            this.node.scaleY = Utils.randomIntEx(this._config.scale.height)*this._radius/this._fire._shape.height;
            this._shapeSpace = this._radius - Math.sqrt(this._radius*this._radius - (this._fire._shape.width/2 * this.node.scaleX)*(this._fire._shape.width/2 * this.node.scaleX))
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

        doAction(){
            if (this._win) return;

            if (this._repeatCount > 0) {
                let self = this;
                let blinkSpeed = Utils.randomFloatEx(this._config.indicator.blinkSpeed);
                let freeLifespan = Utils.randomFloatEx(this._config.lifespan)/3;
                let changeTime = Utils.randomFloatEx(this._config.reappearance.delay);
                this._fire._shape.color = cc.Color.YELLOW;
                this._fire._shape.runAction(cc.sequence(
                    //Indicator
                    cc.fadeIn(blinkSpeed),
                    cc.delayTime(this._config.indicator.delay),
                    cc.fadeOut(0),
                    cc.fadeIn(blinkSpeed),
                    cc.delayTime(this._config.indicator.delay),
                    cc.fadeOut(0),
                    cc.fadeIn(blinkSpeed),
                    cc.delayTime(this._config.indicator.delay),
                    cc.fadeOut(0),
                    cc.fadeIn(blinkSpeed),
                    cc.callFunc(function(){ 
                        self._collisionAllow = true; 
                        self._fire._shape.color = cc.Color.BLACK;
                    }),

                    //delay
                    cc.delayTime(freeLifespan),
                    cc.fadeOut(0.5),
                    cc.callFunc(function(){ self._collisionAllow = false; }),
        
                    //change
                    cc.delayTime(changeTime),
                    cc.callFunc(function(){
                        self._repeatCount -= 1;
                        self._shapeAngle = Utils.randomIntEx(self._config.position || [0,360]) - 90;
                        self.move(self._shapeAngle);
                        self.doAction();
                    })
        
                ));
            }

        }

        //获取角度
        getShapeAngle(){
            return this._shapeAngle;
        }

        //是否处于提示状态
        isIndicator(){
            return !this._collisionAllow;
        }

        //设置结果
        setResult(result){
            // cc.log("triangle setResult ",result);

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

        guideFadeOut(){
            this._fire._shape.stopAllActions();
            let self = this;
            this._fire._shape.runAction(cc.sequence(
                cc.fadeOut(0.5),
                cc.callFunc(function(){
                    self._collisionAllow = false;
                })
            ));
        }
    }
