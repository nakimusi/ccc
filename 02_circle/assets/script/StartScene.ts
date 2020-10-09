const {ccclass, property} = cc._decorator;

@ccclass
export class StartScene extends cc.Component {

    //加载完成
    onLoad () {
        this.scheduleOnce(() => {
            cc.director.loadScene('GameScene');
        });
    }
}
