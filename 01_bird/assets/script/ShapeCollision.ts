
import {BaseComponent} from "./base/BaseComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export class ShapeCollision extends BaseComponent {

    _shape = null;

    onLoad(){
    }

    onCollisionEnter(other:any) {
        if (this._shape && this._shape.isIndicator()) return;

        this.node.color = cc.Color.RED;
        yyp.eventCenter.emit("player-collosion",{});
    }
    
    onCollisionStay(other) {
    }
    
    onCollisionExit() {
    }

    setShape(shape){
        this._shape = shape;
    }
}
