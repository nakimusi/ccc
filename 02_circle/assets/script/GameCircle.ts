import {BaseComponent} from "./base/BaseComponent";
import {Utils} from "./base/Utils";
import {ShapeCollision} from "./ShapeCollision";
import {LocalizedData} from "./base/LocalizedData";
import {MusicManager} from "./base/MusicManager";

const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
@ccclass
export class CircleScene extends BaseComponent {

    //编辑器属性
    @property(cc.Prefab)
    private PlayerPrefab: cc.Prefab = null;

    //编辑器属性
    @property(cc.Prefab)
    private CirclePrefab: cc.Prefab = null;

    //编辑器属性
    @property(cc.Prefab)
    private TrianglePrefab: cc.Prefab = null;
    
    //编辑器属性
    @property(cc.Prefab)
    private RectanglePrefab: cc.Prefab = null;
    
    //编辑器属性
    @property(cc.Prefab)
    private CannonPrefab: cc.Prefab = null;
    
    //编辑器属性
    @property(cc.Prefab)
    private PerimeterCannonPrefab: cc.Prefab = null;
    
    @property(cc.Prefab)
    private CoinPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    private bgFrames: cc.SpriteFrame[] = [];
    //私有属性,请使用'_'开头,驼峰命名
    // _maxSpeed = 3;  //最大速度

    _radius = 150;      //半径
    _player = null;

    _obstacles = [];
    _bullets = [];
    _degress = [];

    _maxLevel = 1;
    _level = 1;
    _config = {};

    _win = false;           //已经胜利
    _fail = false;          //已经失败

    _num = 0;
    //加载完成
    onLoad () {
        cc.log("gamecircle onLoad ",this._num);

        // cc.log("gamecircle onLoad");
        //初始化变量
        this._initVariable();
        
        //初始化UI
        this._initUI();

        //初始化事件
        this._initEvent();
        
    }

    onDestroy() {
        cc.log("gamecircle onDestroy ",this._num);
        // if (this._level > 0) {
        //     LocalizedData.removeItem("_test_heroid_");
        // }
        //销毁事件
        this._destroyEvent();
    }

    //初始化变量
    _initVariable() {
    }

    start(){
    }

    //初始化UI
    _initUI(){
        this.node.width = 2000;
        this.node.height = 2000;

        this._fire._level.y = yyp.safeTopBottom-30;
        
        // this.node["$Graphics"].lineWidth = 5;
        // this.node["$Graphics"].strokeColor = cc.color(255,0,0);
        // this.node["$Graphics"].arc(this._fire._mask.x, this._fire._mask.y, this._radius+5, 0, 2*Math.PI, true);
        // this.node["$Graphics"].stroke();
    }

    //初始化事件
    _initEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        yyp.eventCenter.on("player-pass",this._playerPass,this);
        yyp.eventCenter.on("player-collosion",this._playerCollosion,this);
    }
    //销毁事件
    _destroyEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        yyp.eventCenter.off("player-pass",this._playerPass,this);
        yyp.eventCenter.off("player-collosion",this._playerCollosion,this);
    }

    init(level){
        this._maxLevel = LocalizedData.getIntItem("_max_level_",1);
        this._level = level;
        this._config = yyp.config.Level[this._level];

        let _map = yyp.config.Map[this._level];
        //150 190 230 
        this._radius = _map.Radius;
        this._fire._sprBg.$Sprite.spriteFrame = this.bgFrames[_map.Color - 1];
        this._fire._sprBg.width = this._radius * 2;
        this._fire._sprBg.height = this._radius * 2;
        
        this._fire._sprite.width = this._radius * 2 + 30;
        this._fire._sprite.height = this._radius * 2 + 30;

        
        this._fire._lbLevel.$Label.string = level;
        this._fire._lbPercent.$Label.string = 0 + '%';
        if (level == 0) {
            this._fire._level.active = false;
            this._fire._lbPercent.active = false;
            this._fire._btnStart.active = true;
            
            this.doCircle(0,359);
            this.doCircle(359,360);
        }

        //创建障碍物
        this._config["gameElements"].forEach(obstacle => {
            this._createObstacle(obstacle);
        });
        
        //创建玩家
        this._player = cc.instantiate(this.PlayerPrefab);
        this._player.parent = this.node;
        this._player.zIndex = 100;
        this._player.script.init(this._config["player"],this);
        this._player.script.setLevel(this._level);

        if (this._level > 0) {
            for (let i = 0; i < 3; i++) {
                let coin = cc.instantiate(this.CoinPrefab);
                coin.parent = this.node;
                coin.script.init(this,Math.floor(this._level/10));
                this._obstacles.push(coin);
            }
        }
    }

    _onTouchStart(event) {
        if (this._level > 0) {
            yyp.eventCenter.emit("player-jump",{type:"start"});
        }
    }

    _onTouchEnd(event) {
        if (this._level > 0) {
            yyp.eventCenter.emit("player-jump",{type:"end"});
        }
    }

    //创建障碍物
    _createObstacle(config){

        switch(config["item"]){
            case "circle":{
                let circle = cc.instantiate(this.CirclePrefab);
                circle.parent = this.node;
                circle.script.init(config,this);
                this._obstacles.push(circle);
                break;
            }
            case "triangle":{
                let triangle = cc.instantiate(this.TrianglePrefab);
                triangle.parent = this.node;
                triangle.script.init(config,this);
                this._obstacles.push(triangle);
                break;
            }
            case "rectangle":{
                let rectangle = cc.instantiate(this.RectanglePrefab);
                rectangle.parent = this.node;
                rectangle.script.init(config,this);
                this._obstacles.push(rectangle);
                break;
            }
            case "cannon":{
                let cannon = cc.instantiate(this.CannonPrefab);
                cannon.parent = this.node;
                cannon.script.init(config,this);
                this._obstacles.push(cannon);
                break;
            }
            case "perimeterCannon":{
                let perimeterCannon = cc.instantiate(this.PerimeterCannonPrefab);
                perimeterCannon.parent = this.node;
                perimeterCannon.script.init(config,this);
                this._obstacles.push(perimeterCannon);
                break;
            }
        }
    }

    //获取当前半径
    getRadius(){
        return this._radius;
    }

    // player跑动进度变化
    _playerPass(event){
        this.doCircle(event.angle1,event.angle2);
    }

    // player与障碍物发生碰撞
    _playerCollosion(event){
        if (this._level == 0 || this._win || this._fail) return;

        if (event.coin) {
            let coinNode = event.coin.node;
            let num = event.coin.getCoinNum();
            yyp.eventCenter.emit('add-coin',{count:num,position:Utils.getWorldPosition(coinNode)});
            
            this._removeObstacles(coinNode);
        }
        else{
            this._setResult(false);
        }
    }

    update(dt){
        if (this._win) return;
        
        this.updateBullet(dt);

        if (this._player) {
        //     this.node["$Graphics"].lineWidth = 1;
        //     this.node["$Graphics"].strokeColor = cc.color(255,0,0);
        //     this.node["$Graphics"].arc(this._player.x, this._player.y, 1, 0, 2*Math.PI, true);
        //     this.node["$Graphics"].stroke();
        
            this._fire._playerParticle.position = this._player.script.getParticlePos();
        }
        else{
            this._fire._playerParticle.x = -500;
        }

        if (this._level == 0) {
            
            if (this._player) {
                let playerAngle = Utils.correctionAngle(this._player.script.getShapeAngle());
                for (let i = this._obstacles.length - 1; i >= 0 ; i--) {
                    let obstacles = this._obstacles[i];
                    let angle = Utils.correctionAngle(obstacles.script.getShapeAngle());
                    if (playerAngle > angle-25 && playerAngle < angle) {
                        yyp.eventCenter.emit("player-jump",{type:"start"});
                        break;
                    }
                }
            }
        }
        else if (this._level == 1) {
            
            if (this._player) {
                let playerAngle = Utils.correctionAngle(this._player.script.getShapeAngle());
                let obstacle1 = this._obstacles[0];
                let angle1 = Utils.correctionAngle(obstacle1.script.getShapeAngle());
                if (playerAngle > angle1-15 && playerAngle < angle1) {
                    this._player.script.setGuide(obstacle1,this._fire._guide);
                }

                let obstacle2 = this._obstacles[1];
                let angle2 = Utils.correctionAngle(obstacle2.script.getShapeAngle());
                if (playerAngle > angle2-22 && playerAngle < angle2) {
                    this._player.script.setGuide2(obstacle2,this._fire._guide);
                }

                // for (let i = this._obstacles.length - 1; i >= 0 ; i--) {
                //     let obstacles = this._obstacles[0];
                //     let angle = Utils.correctionAngle(obstacles.script.getShapeAngle());
                //     if (playerAngle > angle-25 && playerAngle < angle) {
                //         yyp.eventCenter.emit("player-jump",{type:"start"});
                //         break;
                //     }
                // }
            }
        }
    }

    //创建子弹
    createBullet(spriteFrame, position,angle,anchorX,anchorY,scale,speed){
        MusicManager.playEffect('cannon');
        let bullet = new cc.Node();
        let sprite = bullet.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
        bullet.position = position;
        bullet.angle = angle;
        bullet.anchorX = anchorX;
        bullet.anchorY = anchorY;
        bullet.scale = scale;
        bullet.group = "obstacle";
        bullet.parent = this.node;
        bullet["speed"] = speed;
        this._bullets.push(bullet);

        bullet.color = cc.Color.RED;
        bullet.addComponent(ShapeCollision);

        let collider = bullet.addComponent(cc.CircleCollider);
        collider.offset = cc.v2(0,-5);
        collider.tag = 0;
        collider.radius = 5;
    }

    //刷新子弹位置
    updateBullet(dt){
        for (let i = this._bullets.length - 1; i >= 0 ; i--) {
            let bullet = this._bullets[i];
            let dir = Utils.degressToVectors(bullet.angle+90);
            let pos = dir.mul(bullet["speed"] * this._radius * dt);
            bullet.position = bullet.position.add(pos);

            if (bullet.position.mag() >= this._radius) {
                bullet.destroy();
                this._bullets.splice(i,1);
            }
        }
    }

    doCircle(deg1,deg2){
        deg1 = Math.floor(deg1);
        deg1 = Utils.correctionAngle(deg1);
        deg2 = Math.floor(deg2);
        deg2 = Utils.correctionAngle(deg2);
        if (deg2 < deg1) {
            deg2 += 360;
        }
        // cc.log("    ",deg1,deg2);

        let radian1 = cc.misc.degreesToRadians(deg1);
        let radian2 = cc.misc.degreesToRadians(deg2);

        this._fire._mask.$Mask._graphics.lineWidth = 0;
        this._fire._mask.$Mask._graphics.strokeColor = cc.color(255,255,255);
        this._fire._mask.$Mask._graphics.fillColor = cc.color(255,255,0);
        this._fire._mask.$Mask._graphics.arc(0, 0, this._fire._sprite.width/2, radian1, radian2, true);
        this._fire._mask.$Mask._graphics.lineTo(0, 0);
        this._fire._mask.$Mask._graphics.close();

        this._fire._mask.$Mask._graphics.fill();
        this._fire._mask.$Mask._graphics.stroke();
        for (let i = deg1; i < deg2; i++) {
            let item = i;
            if (item < 0) { 
                item += 360; 
            }
            else if(item >= 360){
                item -= 360; 
            }

            if (Utils.itemInList(item,this._degress) == false) {
                this._degress.push(item);
            }
        }
        function sortNumber(a, b)
        {
            return a-b;
        }
        this._degress.sort(sortNumber);

        let jindu = this._degress.length/360;
        // cc.log("jindu ",jindu);
        
        if (jindu == 1) {
            // cc.log("gameCircle _playerCollosion win");
            this._setResult(true);
        }
        
        //进度发生变化
        let percent = Math.floor(jindu*100);
        this._fire._lbPercent.$Label.string = percent + '%';
    }

    //设置结果
    _setResult(result){
        if (this._level == 0 || this._win || this._fail) return;
        
        if (result) {
            yyp.eventCenter.emit("game-finish",{result:1});
            MusicManager.playEffect('win');

            this._win = true;
            this._fire._btnNext.active = true;
            this._fire._btnNext.opacity = 0;
            this._fire._btnNext.runAction(cc.fadeIn(0.3));
            
            if (this._level + 1 > this._maxLevel) {
                LocalizedData.setIntItem("_max_level_",this._level + 1);
            }
            LocalizedData.setIntItem("_level_",this._level + 1);
        }
        else{
            yyp.eventCenter.emit("game-finish",{result:0});
            MusicManager.playEffect('hit');
            MusicManager.vibrate();

            MusicManager.playEffect('dead_voice_' + Utils.randomInt(1,4));

            this._fail = true;
            this._fire._btnRestart.active = true;
            this._fire._btnRestart.opacity = 0;
            this._fire._btnRestart.runAction(cc.fadeIn(0.3));
        }

        this._fire._playerParticle.active = false;
        this._player.script.setResult(result);
        for (let i = this._obstacles.length - 1; i >= 0 ; i--) {
            let obstacles = this._obstacles[i];
            obstacles.script.setResult(result);
        }
    }

    //清理
    _removeObstacles(item){

        for (let i = this._obstacles.length - 1; i >= 0 ; i--) {
            let obstacle = this._obstacles[i];
            if (item == obstacle) {
                this._obstacles.splice(i,1);
                obstacle.destroy();
            }
        }
    }

    
    //开始
    onStartClick(event){
        MusicManager.playEffect('btn');
        let lv = LocalizedData.getIntItem("_level_",1);
        yyp.eventCenter.emit("game-start",{level:lv});
    }
    
    //重新开始
    onRestartClick(event){
        MusicManager.playEffect('btn');
        yyp.eventCenter.emit("game-start",{level:this._level});
    }
    
    onNextClick(event){
        MusicManager.playEffect('btn');
        yyp.eventCenter.emit("game-start",{level:this._level + 1});
    }

    doDestroy(){
        let self = this;
        this.node.runAction(
            cc.sequence(
                cc.fadeOut(0.2),
                cc.callFunc(function(){
                    self.node.destroy();
                })
            )
        );
    }
    
    
}
