import {BaseComponent} from "../../script/base/BaseComponent";
import {GameManager,GameStatus} from "../../script/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class Land extends BaseComponent {

    _landSpeed  = 2;    //地面移动速度
    _minX       = 0;    //地面水平移动的最小值(小于此值会重置地面坐标)

    //加载完成
    onLoad () {
        //初始化时,记录地面水平移动的最小值
        this._minX = this._fire._land1.x;
    }

    //每帧调用
    update (dt) {
        this._moveBg();
    }
    
    //移动地面
    _moveBg(){
        //游戏状态不处于结束时,移动地面
        if (GameManager.getInstance().getStatus() != GameStatus.Finish) {
            //每帧移动
            this._fire._land1.x -= this._landSpeed;
            this._fire._land2.x -= this._landSpeed;

            //坐标小于最小值时,把地面坐标重置到另一个地面的后边(相隔一个地面的宽度)
            if (this._fire._land1.x <= this._minX) {
                this._fire._land1.x = this._fire._land2.x + this._fire._land2.width;
            }
            if (this._fire._land2.x <= this._minX) {
                this._fire._land2.x = this._fire._land1.x + this._fire._land2.width;
            }
        }
    }
}
