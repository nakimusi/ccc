import {BaseComponent} from "../../script/base/BaseComponent";
import { Utils } from "../../script/modlue/Utils";
import {GameManager,GameStatus} from "../../script/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class Bird extends BaseComponent {

    _index = 1;
    _changeTime = 0;
    _gameOver = false;  //游戏是否结束
    _savePosition;

    //加载完成
    onLoad () {
        this._savePosition = this.node.position;
    }

    start(){
        this._changeBirdSpriteframe(this._index);
    }

    //每帧调用
    update (dt) {
        //呼扇翅膀
        if (GameManager.getInstance().getStatus() != GameStatus.Finish) {
            this._changeTime += dt;
            if (this._changeTime > 0.08) {
                this._changeTime = 0;

                this._index = this._index + 1 > 3 ? 1 : this._index + 1;
                this._changeBirdSpriteframe(this._index);
            }
        }

        //控制角度
        if (GameManager.getInstance().getStatus() == GameStatus.Gaming) {
            let rigidBody = this.node['$RigidBody'];
            let dir = cc.v2(500,rigidBody.linearVelocity.y).normalize();
            let angle = Utils.vectorsToDegress(dir);
            
            this.node.angle = angle; 
            
            //控制最大高度
            if (this.node.y >= yyp.gameFrameSize.height/2) {
                this.node.y = yyp.gameFrameSize.height/2;
            }
        }


    }
    
    _changeBirdSpriteframe(index){
        for (let i = 1; i <= 3; i++){
            let bird = this._fire['_bird' + i];
            bird.active = i == index;
        }
    }

    readyAction(){
        this.node.runAction(
            cc.sequence(
                cc.moveBy(0.3,0,25),
                cc.moveBy(0.3,0,-25)
            ).repeatForever()
        )
    }

    //给小鸟一个向上的冲力
    moveUp(){
        yyp.music.playEffect("wing");
        let rigidBody = this.node['$RigidBody'];
        rigidBody.linearVelocity = cc.v2(0,400);

        this.node.stopAllActions();
    }

    //设置小鸟为动态刚体
    setRigidToDynamic(){
        let rigidBody = this.node['$RigidBody'];
        rigidBody.type = cc.RigidBodyType.Dynamic;
    }

    reset(){
        let rigidBody = this.node['$RigidBody'];
        rigidBody.type = cc.RigidBodyType.Static;
        
        this.node.angle = 0;
        this.node.position = this._savePosition;

        this.readyAction();
    }

    // 小鸟碰到障碍物
    onBeginContact(contact, selfCollider, otherCollider) {
        cc.log("onBeginContact ")

        if (GameManager.getInstance().getStatus() == GameStatus.Gaming) {
            yyp.music.playEffect("hit");
            yyp.eventCenter.emit("game-finish",{});
        }
    }

}
