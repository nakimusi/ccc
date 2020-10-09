import {BaseComponent} from "./base/BaseComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export class StartScene extends BaseComponent {

    @property(cc.Prefab)
    LevelPrefab : cc.Prefab = null;

    // @property(cc.Prefab)
    // private LevelPrefab: cc.Prefab = null;

    //加载完成
    onLoad () {
        // this.scheduleOnce(() => {
        //     cc.director.loadScene('GameScene');
        // });
    }

    
    //关卡
    onLevelClick(event){

        let aaa = [];
        for (let i = 0; i < 101; i++) {
            aaa.push(i);
        }
        let startTime = (new Date()).valueOf();
        let skin = cc.instantiate(this.LevelPrefab);
        skin.zIndex = 100;
        skin.x = 0;
        skin.y = 0;
        skin.parent = this.node;
        
        // let skin = cc.instantiate(this.LevelPagePrefab);
        // skin.zIndex = 100;
        // skin.x = 0;
        // skin.y = 0;
        // skin.parent = this.node;
        
        // for (let i = 0; i < 3; i++) {
        //     let itemNode = cc.instantiate(this.LevelPagePrefab);
        //     // itemNode.width = 200;
        //     // itemNode.height = 50;
        //     itemNode.parent = this._fire._scrollview.$ScrollView.content;
        //     // itemNode.setPosition(0, 0);
            
        // }

        // this._fire._scrollview.$ScrollViewEx.load(aaa);

        let endTime = (new Date()).valueOf();
        this._fire._lbTitle.$Label.string = (endTime - startTime) + ''
    }

    onScroll(aa,bb,cc){
        let q = 1;
    }
}
