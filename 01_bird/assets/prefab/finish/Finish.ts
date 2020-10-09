import {BaseComponent} from "../../script/base/BaseComponent";
import {GameManager,GameStatus} from "../../script/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class Finish extends BaseComponent {

    //加载完成
    onLoad () {

        this._fire._scorePabel.opacity = 0;
        this._fire._btns.opacity = 0;
        this._fire._btnReady.$Button.interactable = false;

        let ani = this.node.getComponent(cc.Animation);
        ani.play("Finish");
        ani.on("finished", this._aniFinished, this);
    }

    //设置分数
    setScore(score){
        let bestScore = yyp.local.getIntItem('__best_score__',0);
        if (score > bestScore) {
            bestScore = score;
            yyp.local.setIntItem('__best_score__',bestScore);
        }
        this._fire._score.$Label.string = score;
        this._fire._bsestScore.$Label.string = bestScore;

        //延迟0.5s播放死亡音效
        let id = setTimeout(() => {
            yyp.music.playEffect("die");
        }, 500)
        
    }

    _aniFinished(){
        this._fire._btnReady.$Button.interactable = true;
    }

    onReadyClick(event){
        yyp.eventCenter.emit("game-ready",{});
        this.node.destroy();
    }

}
