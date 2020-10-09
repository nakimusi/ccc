import {BaseComponent} from "./base/BaseComponent";
// import {Dialogs} from "./base/Dialogs";


const {ccclass, property} = cc._decorator;

//私有函数,请使用'_'开头
//请修改'NewClass' => 自己的类名
//弹窗需要继承Dialogs
@ccclass
export class NewClass extends BaseComponent {

    //编辑器属性
    // @property(cc.Prefab)
    // private prefab: cc.Prefab = null;

    //私有属性,请使用'_'开头,驼峰命名
    // _maxSpeed = 3;  //最大速度

    _guide1
    _playing = false;

    //加载完成
    onLoad () {

        // this.node['_components'].forEach((component) => {
        //     if (component.__classname__ == 'cc.Animation') {
        //         let a = 1;
        //         if (component.defaultClip.name == 'guide1') {
                    
        //         }
        //         else if (component.defaultClip.name == 'guide2') {
                    
        //         }
        //     }
        //     cc.log(component.__classname__);
        // });

        this.node.active = false;
    }


    playGuide1 () {
        if (this._playing == false) {
            this._playing = true;
            this.node.active = true;
            this._fire._label.$Label.string = '点击屏幕跳跃';
    
            this._playGuide1();
        }
    }
    
    _playGuide1 () {
        let ani = this.node.getComponent(cc.Animation);
        ani.play("guide1");
        ani.on("finished", this._playGuide1, this);
    }

    playGuide2 () {
        if (this._playing == false) {
            this._playing = true;
            this.node.active = true;
            this._fire._label.$Label.string = '长按屏幕跳的更高';
    
            this._playGuide2();
        }
    }
    
    _playGuide2 () {
        let ani = this.node.getComponent(cc.Animation);
        ani.play("guide2");
        ani.on("finished", this._playGuide2, this);
    }

    stop(){
        this._playing = false;
        this.node.active = false;
        let ani1 = this.node.getComponent(cc.Animation);
        ani1.stop;
    }
    
}
