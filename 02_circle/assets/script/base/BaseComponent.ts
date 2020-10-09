import {LinkPrefab} from "./LinkPrefab";
import {Utils} from "./Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export class BaseComponent extends cc.Component {

     _fire : any = {};      //保存所有从ui布局文件中解析出来的节点

    __preload() {
        Utils._initBaseSize();
        // cc.log("BaseScript __preload start");
        this._bind(this.node);
        // cc.log("BaseScript __preload end");
    }
    
    //绑定
    _bind(node) {
        let changeZindex = 0;
        this._bindComponent(node);
        node.children.forEach((child) => {
            let name = child.name;

            //动态调整zindex
            child.zIndex = changeZindex;
            changeZindex = changeZindex + 10;
            // cc.log("    " + name,child.zIndex);

            // child.rootNode = this.node;
            //名字前缀是_的导出
            if (name[0] == "_") {
                if (this._fire[name]) {
                    cc.warn("BaseComponent WARNNING : [" + name + "(" + node.parent.name + ")] is already exists!");
                }
                this._fire[name] = child;
            }
            this._bind(child);
            
        });
    }
    
    //绑定组件至节点
    _bindComponent(node) { 
        node._components.forEach((component) => {
            let name = component.__classname__.replace("cc.","");
            node["$" + name] = component;

            //如果节点挂了LinkPrefab组件,说明此节点是为了引用prefab而存在的
            if (component.__classname__ == "LinkPrefab") {
                node["__RootScript__"] = this;
            }
        });
    }

}


// node.script可以获取第一个自定义脚本
cc.js.get(cc.Node.prototype, 'script', function () {
    let LinkPrefabScript = this.getComponent(LinkPrefab);
    if (LinkPrefabScript) {
        if (LinkPrefabScript._prefabNode) {
            return LinkPrefabScript._prefabNode.script;
        }
    }
    return this.getComponent(BaseComponent);
},true,true);