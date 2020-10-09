import {BaseComponent} from "./base/BaseComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export class ShapeCollision extends BaseComponent {

    _shape = null;

    onLoad(){
        let a = 1;
    }

    onCollisionEnter(other:any) {
        if (this._shape) {
            if (!this._shape.isIndicator()) {
                let getCoinNum = this._shape.getCoinNum;
                if (getCoinNum) {
                    yyp.eventCenter.emit("player-collosion",{coin:this._shape});
                }
                else{
                    yyp.eventCenter.emit("player-collosion",{});
                }
            }
        }
        else{
            yyp.eventCenter.emit("player-collosion",{});
        }
    }
    
    onCollisionStay(other) {
    }
    
    onCollisionExit() {
    }

    setShape(shape){
        this._shape = shape;
    }
}
