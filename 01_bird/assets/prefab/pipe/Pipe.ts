import {BaseComponent} from "../../script/base/BaseComponent";
import {Utils} from "../../script/modlue/Utils";
import {GameManager,GameStatus} from "../../script/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class Pipe extends BaseComponent {

    _pipeSpeed      = 2;    //管道移动速度
    _pipeGapLR      = 400;  //管道间隔(左右)
    _pipeGapUD      = 200;  //管道间隔(上下)
    _minX           = -400; //管道水平移动的最小值(小于此值会重置管道坐标)

    //加载完成
    onLoad () {
        //用来标记管道的初始位置
        this._fire._pipeUp1.savePosition = this._fire._pipeUp1.x;
        this._fire._pipeUp2.savePosition = this._fire._pipeUp2.x;

        //用来标记此管道是否已经计算过得分
        this._fire._pipeUp1.score = false;
        this._fire._pipeUp2.score = false;
    }

    //每帧调用
    update (dt) {
        //处于游戏中状态的时候,移动管道
        if (GameManager.getInstance().getStatus() == GameStatus.Gaming) {
            this._movePipe(1);
            this._movePipe(2);
        }
    }
    
    //移动管道
    _movePipe(index){
        let pipeUp = this._fire['_pipeUp' + index];
        let pipeDown = this._fire['_pipeDown' + index];

        //每帧移动
        pipeUp.x -= this._pipeSpeed;
        pipeDown.x -= this._pipeSpeed;

        //坐标小于最小值时,把管道坐标重置到另一个管道的后边(相隔_pipeGapLR)
        if (pipeUp.x <= this._minX) {
            let frontPipeUp = this._fire['_pipeUp' + (index==1 ? 2 : 1)];
            pipeUp.x = frontPipeUp.x + this._pipeGapLR;
            pipeDown.x = frontPipeUp.x + this._pipeGapLR;

            //获取管道的新高度(每次随机,增加趣味性和难度)
            let newHeight = Utils.randomInt(-200,200);
            //上下管道分别向上下移动一段距离,留给小鸟飞过的缝隙
            pipeUp.y = newHeight + this._pipeGapUD/2;
            pipeDown.y = newHeight - this._pipeGapUD/2;
            
            //重置为没有计算过得分
            pipeUp.score = false;
        }
    }

    //重置为初始状态,以便开始下一局游戏
    reset(){
        //还原管道至初始位置,重置得分标记
        this._fire._pipeUp1.score = false;
        this._fire._pipeUp1.x = this._fire._pipeUp1.savePosition;
        this._fire._pipeDown1.x = this._fire._pipeUp1.savePosition;
        
        this._fire._pipeUp2.score = false;
        this._fire._pipeUp2.x = this._fire._pipeUp2.savePosition;
        this._fire._pipeDown2.x = this._fire._pipeUp2.savePosition;
    }

    //计算得分(条件是:鸟的坐标 > 管道的坐标)
    judgeScore(birdNode){
        //处于游戏中状态的时候,计算得分
        if (GameManager.getInstance().getStatus() == GameStatus.Gaming) {
            //获取鸟的坐标(相对this.node)
            let word = birdNode.parent.convertToWorldSpaceAR(birdNode.position);
            let birdPosition = this.node.convertToNodeSpaceAR(word);

            //如果管道的得分标记是没有得分的状态 且 鸟的坐标大于管道的坐标,说明得分了
            if (this._fire._pipeUp1.score == false && birdPosition.x > this._fire._pipeUp1.x) {
                this._fire._pipeUp1.score = true;
                return true;
            }
            else if (this._fire._pipeUp2.score == false && birdPosition.x > this._fire._pipeUp2.x) {
                this._fire._pipeUp2.score = true;
                return true;
            }
        }
        return false;
    }
}
