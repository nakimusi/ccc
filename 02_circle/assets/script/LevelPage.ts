import {BaseComponent} from "./base/BaseComponent";
import {LocalizedData} from "./base/LocalizedData";
import {MusicManager} from "./base/MusicManager";


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

    _maxLevel = 1;
    _level = 1;

    //加载完成
    onLoad () {
        //初始化变量
        this._initVariable();
        
        //初始化UI
        this._initUI();

        //初始化事件
        this._initEvent();
    }

    onDestroy() {
        //销毁事件
        this._destroyEvent();
    }

    //初始化变量
    _initVariable() {
        this._maxLevel = LocalizedData.getIntItem("_max_level_",1);
        this._level = LocalizedData.getIntItem("_level_",1);
    }

    //初始化UI
    _initUI(){
    }

    //初始化事件
    _initEvent() {
    }

    //销毁事件
    _destroyEvent() {
    }

    start(){
        let list = [];
        for (const key in yyp.config.Map) {
            if (key != '0' && yyp.config.Map.hasOwnProperty(key)) {
                const element = yyp.config.Map[key];
                list.push(element);
            }
        }
        this._fire._levelView.$ScrollViewEx.load(list,this._maxLevel,this._level);
    }

    //每帧调用
    // update (dt) {
    // }
    
    //打开弹窗完成回调
    // _openedCallback(){
    // }

    //关闭弹窗完成回调
    // _closedCallback(){
    // }

    //将要弹窗关闭回调
    // _willCloseCallback(){
    // }
    
    //点击返回按钮
    onBack(){
        MusicManager.playEffect('btn');

        yyp.eventCenter.emit('return-main',{});
        this.node.destroy();
    }
    
    //点击了列表中的item
    onItemClick(level){
        cc.log('+++++++++');
        this.node.destroy();
    }
}
