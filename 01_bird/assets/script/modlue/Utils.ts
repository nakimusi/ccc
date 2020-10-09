
export class Utils{

    static seed = 0;    //随机种子

    //初始化基础的位置信息
    static init () {
        if (yyp.gameFrameSize == null) {
            //屏幕大小
            yyp.gameFrameSize = cc.view.getVisibleSize();
    
            //缩放比例
            yyp.gameFactor = yyp.gameFrameSize.width/cc.view.getVisibleSizeInPixel().width;
    
            // cc.log("Base wx gameFrameSize ",yyp.gameFrameSize);
            // cc.log("Base wx gameFactor ",yyp.gameFactor);

            yyp.safeTopTop = yyp.gameFrameSize.height/2;
            yyp.safeTopBottom = yyp.gameFrameSize.height/2 - 30;
            if (cc.sys.platform === cc.sys.WECHAT_GAME){
                // cc.log("Base wx start ");
    
            　　let menu = wx.getMenuButtonBoundingClientRect();
                // cc.log("Base wx top ",menu.top);
                // cc.log("Base wx bottom ",menu.bottom);
            　　let res = wx.getSystemInfoSync();
                // cc.log("Base wx ratio ",res.pixelRatio);
                
                let top = menu.top * res.pixelRatio * yyp.gameFactor;
                let bottom = menu.bottom * res.pixelRatio * yyp.gameFactor;
                // cc.log("Base after top ",top);
                // cc.log("Base after bottom ",bottom);
                
                yyp.safeTopTop = yyp.gameFrameSize.height/2 - top;
                yyp.safeTopBottom = yyp.gameFrameSize.height/2 - bottom;
                // cc.log("Base safeTopTop top ",yyp.safeTopTop);
                // cc.log("Base safeTopBottom bottom ",yyp.safeTopBottom);
                
                // cc.log("Base wx end ");
            }
            
        }
    }
    

    ///////////////  角度 数学  ///////////////
    
    /**
    修正角度在-180~180范围内
    */
    static correctionAngle(angle){
        if (angle > 180)
            angle = angle - 360;
        else if (angle < -180)
            angle = angle + 360;

        if (angle > 180 || angle < -180) {
            return Utils.correctionAngle(angle);
        }
        return angle;
    }

    /**
    修正角度在0~360范围内
    */
    static correctionAngle360(angle){
        if (angle < 0)
            angle = angle + 360;

        if (angle < 0)
            return Utils.correctionAngle360(angle);

        return angle;
    }

    /**
    向量转角度
    */
    static vectorsToDegress(dir) {
        let radian = cc.v2(dir).signAngle(cc.v2(1, 0));    // 求方向向量与对比向量间的弧度
        let degree = -cc.misc.radiansToDegrees(radian);    // 将弧度转换为角度(返回角度在-180~180范围内)

        return degree;
    }
    
    /**
    角度转向量
    */
    static degressToVectors(degree) {
        let radian = cc.misc.degreesToRadians(degree);
        let dir = cc.v2(1, 0).rotate(radian);
        return dir;
    }

    /**
    获取向量旋转指定角度后的向量
    */
    static vectorsRotateDegress(dir, rotateDegree) {
        let degree = Utils.vectorsToDegress(dir);
        degree = degree + rotateDegree;
        return Utils.degressToVectors(degree);
    }

    /**
    获取点到线段的最短距离,最近点坐标
    */
    static getPointLineShortestInfo(P, A, B){
        let ret:any = {};

        let cross = (B.x - A.x) * (P.x - A.x) + (B.y - A.y) * (P.y - A.y);
        if (cross <= 0) {
            ret.point = A;
            ret.len = P.sub(ret.point).mag();
            return ret;
        }

        let d2 = B.sub(A).magSqr();
        if (cross >= d2)  {
            ret.point = B;
            ret.len = P.sub(ret.point).mag();
            return ret;
        }

        let r = cross / d2;
        let p1x = A.x + (B.x - A.x) * r;
        let p1y = A.y + (B.y - A.y) * r;
        ret.point = cc.v2(p1x,p1y);
        ret.len = P.sub(ret.point).mag();

        return ret;
    }
    
    /**
    点p为圆心,radius为半径,方向dir的圆,会不会经过点B
    */
    static circlePassPoint(P,radius,dir,B){
        let P1 = P.add(Utils.vectorsRotateDegress(dir, 90).mul(radius));    //左转90度的圆上的点
        let P2 = P.add(Utils.vectorsRotateDegress(dir, -90).mul(radius));   //右转90度的圆上的点

        let P1B = B.sub(P1).normalize();
        let P1P2 = P2.sub(P1).normalize();
        let radianP1P2 = cc.v2(P1P2).signAngle(P1B);
        let degreeP1P2 = cc.misc.radiansToDegrees(radianP1P2);

        let P2B = B.sub(P2).normalize();
        let P2P1 = P1.sub(P2).normalize();
        let radianP2P1b = cc.v2(P2B).signAngle(P2P1);
        let degreeP2P1b = cc.misc.radiansToDegrees(radianP2P1b);

        if (degreeP1P2 >=0 && degreeP1P2 <= 90 && degreeP2P1b >=0 && degreeP2P1b <= 90) {
            return true;
        }
        return false;
    }

    /**
    射线起始点P,方向dir,是否经过线段AB
    */
    static radialPassLine(P,dir,A,B){
        let radianPA = A.sub(P).normalize().signAngle(dir);
        let radianPB = B.sub(P).normalize().signAngle(dir);

        let degreePA = cc.misc.radiansToDegrees(radianPA);
        let degreePB = cc.misc.radiansToDegrees(radianPB);

        // 射线与AB重合
        if (radianPA == 0 || radianPB == 0) {
            return true;
        }
        if (radianPA*radianPB<=0 && (Math.abs(degreePB) + Math.abs(degreePA)) <= 180) {
            return true;
        }

        return false;
    }

    /**
    点P为圆心,radius为半径,方向dir的圆,会不会经过线段AB
    */
    static circlePassLine(P,radius,dir,A,B){
        if (Utils.circlePassPoint(P,radius,dir,A) || Utils.circlePassPoint(P,radius,dir,B)) {
            return true;
        }
        
        if (Utils.radialPassLine(P,dir,A,B)) {
            return true;
        }

        return false;
    }
    
    /**
    点P,P1为圆心,radius为半径的圆,会不会经过线段AB
    */
    static circleCirclePassLine(P,P1,radius,A,B){
        if (Utils.circlePassLine(P,radius,P1.sub(P).normalize(),A,B) && Utils.circlePassLine(P1,radius,P.sub(P1).normalize(),A,B)) {
            return true;
        }

        return false;
    }
    
    /**
    线段PP1,是否经过线段AB
    */
    static linePassLine(P,P1,A,B){
        if (this.radialPassLine(P,P1.sub(P).normalize(),A,B) && this.radialPassLine(P1,P.sub(P1).normalize(),A,B)) {
            return true;
        }
        return false;
    }
    ///////////////  角度 数学  ///////////////

    
    ///////////////  常用函数  ///////////////
    
    /**
    创建一个指定颜色的layout
    */
    static createLayout(width,height,color,parent=null) {
        width = width || 20;
        height = height || 20;
        color = color || cc.Color.WHITE;

        let node = new cc.Node();
        node.color = color;
        if (parent) { node.parent = parent; }
        cc.loader.loadRes("default/panel", cc.SpriteFrame, (err, spriteFrame) => {
            //加载失败,打印日志
            if(err) {
                // cc.log('createLayout failed: ' + err);
                return; 
            }

            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            sprite.type = cc.Sprite.Type.SLICED;
            node.width = width;
            node.height = height;
        });

        return node;
    }

    /**
    获取当前场景的ui根节点
    */
    static getCurrentSceneCanvas(){
        let scene = cc.director.getScene();
        let canvas = cc.find("Canvas",scene);
        return canvas;
    }
    
    /**
    添加到当前场景的ui根节点
    */
    static addtoCurrentScene(node, pos = null){
        let canvas = Utils.getCurrentSceneCanvas();
        canvas.addChild(node);
        if (pos != null) {
            node.setPosition(pos);            
        }
        else{
            node.setPosition(new cc.Vec2(0,0));
        }
        // cc.log(node.x,node.y);
    }
    
    /**
    显示弹窗
    */
    static showDialogs(prefab){
        let dialogs = cc.instantiate(prefab);
        dialogs.zIndex = 1000;
        Utils.addtoCurrentScene(dialogs);
        dialogs.script.show();

        return dialogs;
    }
    
    /**
    列表中是否存在item
    */
    static itemInList(item,list){
        for (let i = 0; i < list.length; i++) {
            if (list[i] == item) {
                return true;
            }
        }
        return false;
    }

    /**
    获取碰撞框-所放值
    */
    static getWorldBoundingBox(node,scale=1) {
        let ret = node.getBoundingBoxToWorld();
        if (scale != 1) {
            ret.x = ret.x + ret.width*(1-scale)/2;
            ret.y = ret.y + ret.height*(1-scale)/2;
            ret.width = ret.width * scale;
            ret.height = ret.height * scale;
        }
        return ret;
    }
    
    /**
    把数字转为千进位
    */
    static transformNumber(num){
        if (num >= 1000) {
            let qian = Math.floor(num/1000);
            num = (num%1000);
            let bai = Math.floor(num/100);

            let ret = qian + "." + bai + "K";
            return ret;
        }
        return num;
    }

    /**
    获取世界坐标
    */
    static getWorldPosition(node){
        return node.parent.convertToWorldSpaceAR(node.position);
    }
    
    /**
    产生 a-b(不包含) 之间的随机整数
    */
    static randomInt(a,b){
        return Math.floor(Utils.gameRandom()*(b-a)) + a;
    }

    /**
    产生 a[0]-a[1](不包含) 之间的随机整数
    */
    static randomIntEx(a){
        return Utils.randomInt(a[0],a[1]);
    }
    
    /**
    产生 a-b(不包含) 之间的随机浮点数
    decimals:小数保留位置
    */
    static randomFloat(a,b,decimals=3){
        let multiplea = Math.pow(10,decimals);
        a = Math.floor(a*multiplea);
        b = Math.floor(b*multiplea);
        let ret = Math.floor(Utils.gameRandom()*(b-a)) + a;
        return ret/multiplea;
    }

    /**
    产生 a[0]-a[1](不包含) 之间的随机浮点数
    decimals:小数保留位置
    */
    static randomFloatEx(a,decimals=3){
        return Utils.randomFloat(a[0],a[1],decimals);
    }

    /**
    游戏用随机数生成
    */
    static gameRandom = function() {
        let aa = Utils.seed;
        Utils.seed = (Utils.seed * 9301 + 49297) % 233280; 
        let aa1 = Utils.seed;
        return Utils.seed / 233280.0; 
    };

    /**
    重置随机种子(以当前时间戳为准)
    */
    static seededRandom = function() {
        Utils.seed = (new Date()).valueOf();
    };

    static getNowDate(){
        let date = new Date();
        let y = date.getFullYear().toString()        // 年
        let m = (date.getMonth() + 1).toString()     // 月
        let d = date.getDate().toString()            // 日

        return y + '-' + m + '-' + d;
    }
        /**
    Q弹效果
    */
    static doQAction(node){
        node.runAction(cc.sequence(
            cc.delayTime(1),
            cc.scaleTo(0.1,1.2,1.2),
            cc.scaleTo(0.1,1,1),
            cc.scaleTo(0.05,1.05,1.05),
            cc.scaleTo(0.02,1,1)
        ).repeatForever());
    }
    ///////////////  常用函数  ///////////////
}

yyp.utils = Utils;