import {BaseComponent} from "../base/BaseComponent";
import {Utils} from "../base/Utils";
import {LocalizedData} from "../base/LocalizedData";
import {MusicManager} from "../base/MusicManager";


const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
@ccclass
export class Player extends BaseComponent {
    @property(cc.SpriteFrame)
    heroSpriteFrames : cc.SpriteFrame[] = [];

    _isJump = false;        //是否处在跳跃状态
    _isJumpUp = false;      //是否处在跳跃(上升)状态
    _isJumpDown = false;    //是否处在跳跃(下降)状态
    _jumpUpTime = 0;        //上升状态持续时间
    _jumpDownTime = 0;      //下降状态持续时间
    _jumpHeight = 0;        //当前跳跃的高度
    _jumpMaxHeight = 0;     //跳跃的最大高度
    _jumpDownHeight = 0;    //下降状态总高度
    _jumpDownAllTime = 0;   //下降状态持续总时间

    _shapeRadiusAngle = 1;  //当前形状圆心角大小
    _shapeSpace = 0;        //当前形状留白距离
    _shapeAngle = 270;      //当前形状角度

    _radius = 0;            //围着转的圆圈半径
    _config:any = {};       //当前形状移动相关配置   
    _shapeSpeed = 0;        //速度

    _win = false;           //已经胜利
    _fail = false;          //已经失败

    _level = 0;
    _obstacle = null;
    _guideNode = null;

    _guide1 = false;
    _guide1_jump = false;
    _guide1_time = 0.2;
    _guide1_complete = false;

    _guide2 = false;
    _guide2_jump = false;
    _guide2_complete = false;

    _heroid = 0;

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
        // this._fire._particlesystem.positionType = cc.ParticleSystem.PositionType.GROUPED;
    }

    //初始化事件
    _initEvent() {
        yyp.eventCenter.on("player-jump",this._jumpStatus,this);
        yyp.eventCenter.on("change-skin",this._changeSkin,this);
    }

    //销毁事件
    _destroyEvent() {
        yyp.eventCenter.off("player-jump",this._jumpStatus,this);
        yyp.eventCenter.off("change-skin",this._changeSkin,this);
    }

    //监听跳跃状态
    _jumpStatus(event) {
        // if (this._level == 1 && (this._guide1_complete == false || this._guide2_complete == false)) {
        //     return;
        // }
        if (this._level != 1 || 
           (this._guide1_complete && this._guide2_complete) ||
           this._guide1 || 
           this._guide2) {
            
            if (event.type == "start") {
                if (this._isJump == false) {
                    
                    if (this._guide1 && this._guide1_jump == false) {
                        this._guide1_jump = true;
                    }
                    if (this._guide2 && this._guide2_jump == false) {
                        this._guide2_jump = true;
                    }

                    this._isJump = true;
                    this._isJumpUp = true;
                    this._isJumpDown = false;
                    MusicManager.playEffect('jump');
                }
                else{
                    if (this._guide2 && this._guide2_jump == false) {
                        this._guide2_jump = true;
                    }

                }
            }
            else if (event.type == "end") {
                if (this._isJump == true && this._isJumpUp == true) {
                    if (this._guide1 && this._guide1_jump) {
                        return;
                    }
                    if (this._guide2 && this._guide2_jump) {
                        this._guide2_jump = false;
                        return;
                    }
                    this._isJumpUp = false;
                    this._isJumpDown = true;
                    this._jumpDownHeight = this._jumpHeight;
                    this._jumpDownAllTime = this._jumpUpTime;
                    this._jumpUpTime = 0;
                }
            }
        }
    }

    start(){
    }

    //初始化
    init(config, circle){
        this._radius = circle.getRadius();
        this._config = config;
        this._jumpMaxHeight = this._config.jump.maxHeight * this._radius;
        this._shapeSpeed = Utils.randomIntEx(this._config.speed);

        this.node.scale = 2*Utils.randomIntEx(this._config.scale)*this._radius/this._fire._shape.width;
        this._shapeSpace = this._radius - Math.sqrt(this._radius*this._radius - (this._fire._shape.width/2 * this.node.scale)*(this._fire._shape.width/2 * this.node.scale))
        // this._shapeRadiusAngle = Math.abs(cc.misc.radiansToDegrees(Math.asin(this._fire._shape.width/2* this.node.scale/this._radius)));
        this.move(this._shapeAngle);

        this._changeSkin();
    }

        //替换不同英雄皮肤
    _changeSkin(){
        if (this._win || this._fail) return;
        //     this._heroid = heroid;
        // }
        // else{
            this._heroid = LocalizedData.getIntItem("_test_heroid_",-1);
            if (this._heroid == -1) {
                this._heroid = LocalizedData.getIntItem("_heroid_",0);
            }
        
        this._fire._shape.$Sprite.spriteFrame = this.heroSpriteFrames[this._heroid];
    }

    //移动
    move(angle) {
        //角度
        this.node.angle = angle + 90;

        //位置
        let dir = Utils.degressToVectors(angle);
        let pos = dir.mul(this._radius - this._shapeSpace - this._jumpHeight);
        this.node.position = cc.v3(pos);
        
        if (this._jumpHeight == 0) {
            yyp.eventCenter.emit("player-pass",{angle1:this.node.angle - this._shapeRadiusAngle - 90,angle2:this.node.angle + this._shapeRadiusAngle - 90});
        }
    }

    //每帧调用
    update(dt) {
        if (this._fail) return;
        if (this._guide1 && this._guide1_jump == false) return;
        if (this._guide2 && this._guide2_jump == false) return;
        
        if (this._isJump){
            if (this._isJumpUp) {
                this._jumpUpTime += dt;
                let rate = this._jumpUpTime/this._config.jump.timeToApex - 1;
                this._jumpHeight = this._jumpMaxHeight * (rate*rate*rate+1);

                let time = (this._guide1 && this._guide1_jump) ? this._guide1_time : this._config.jump.timeToApex;
                if (this._jumpUpTime >= time) {
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
                    
                    if (this._guide1 && this._guide1_jump) {
                        this._guide1 = false;
                        this._guide1_jump = false;
                        this._guide1_complete = true;
                        this._obstacle.script.guideFadeOut();
                        this._guideNode.script.stop();
                    }

                    if (this._guide2 && this._guide2_jump) {
                        this._guide2 = false;
                        this._guide2_jump = false;
                        this._guide2_complete = true;
                        this._obstacle.script.guideFadeOut();
                        this._guideNode.script.stop();
                    }

                    this._jumpHeight = 0;
                    this._jumpDownTime = 0;
                    this._isJumpUp = false;
                    this._isJumpDown = false;
                    this._isJump = false;
                    MusicManager.playEffect('land');
                }
            }
        }

        //移动
        this._shapeAngle += dt * this._shapeSpeed; 
        if (this._shapeAngle < 0) {
            this._shapeAngle += 360;
        }
        this.move(this._shapeAngle);
    }

    //获取角度
    getShapeAngle(){
        return this._shapeAngle;
    }

    //设置结果
    setResult(result){
        // cc.log("player setResult ",result);
        LocalizedData.removeItem("_test_heroid_");
        if (result) {
            this._win = true;
        }
        else{
            this._fail = true;
            this.node.runAction(cc.fadeOut(0.5));
        }
    }

    getParticlePos(){
        let position = this._fire._particlePos.position;
        position = this._fire._particlePos.parent.convertToWorldSpaceAR(position);
        position = this.node.parent.convertToNodeSpaceAR(position);
        return position;
    }

    setLevel(level){
        this._level = level;
    }

    setGuide(obstacle,guideNode){
        if (this._guide1_complete) return;
        
        guideNode.script.playGuide1();

        this._obstacle = obstacle;
        this._guideNode = guideNode;
        this._guide1 = true;
    }

    setGuide2(obstacle,guideNode){
        if (this._guide2_complete) return;

        guideNode.script.playGuide2();

        this._obstacle = obstacle;
        this._guideNode = guideNode;
        this._guide2 = true;
    }
}
