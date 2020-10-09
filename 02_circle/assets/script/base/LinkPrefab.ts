const {ccclass, executeInEditMode, property} = cc._decorator;

// 屏蔽2.3.1版本prefab嵌套prefab的弹框问题
if (CC_EDITOR && !window["Editor"].isBuilder) {
    window["_Scene"].DetectConflict.beforeAddChild = function() {
        return false
    }
}


@ccclass
@executeInEditMode
export class LinkPrefab extends cc.Component {

    private _prefabNode: cc.Node = null

    @property(cc.Prefab)
    private _prefab: cc.Prefab = null

    @property({type: cc.Prefab, visible: true, displayName: "预制体"})
    set prefab(value: cc.Prefab) {
        this._onPrefabChanged(this._prefab, value)
    }

    get prefab(): cc.Prefab {
        //编辑器状态下,此函数每帧都会调用,所以在这里做动态处理
        if (CC_EDITOR) {
            //编辑器状态下,此节点不能隐藏,锚点和尺寸不能修改
            this.node.active = true;
            if (this._prefabNode) {
                this.node.setContentSize(this._prefabNode.getContentSize());
                this.node.anchorX = this._prefabNode.anchorX;
                this.node.anchorY = this._prefabNode.anchorY;
            }
        }
        return this._prefab
    }

    private _onPrefabChanged(oldValue:cc.Prefab, newValue:cc.Prefab) {
        if (this._prefabNode) {
            this._prefabNode.destroy();
            this._prefabNode = null;
        }
        this._prefab = newValue
        if (newValue) {
            let prefabNode = cc.instantiate(newValue);
            if(prefabNode){
                this._prefabNode = prefabNode;

                // cc.Object["Flags"].DontSave          // 当前节点不会被保存到prefab文件里
                // cc.Object["Flags"].LockedInEditor    // 当前节点及子节点在编辑器里不会被点击到
                // cc.Object["Flags"].HideInHierarchy   // 当前节点及子节点在编辑器里不显示
                prefabNode["_objFlags"] |= (cc.Object["Flags"].DontSave | cc.Object["Flags"].LockedInEditor | cc.Object["Flags"].HideInHierarchy);

                prefabNode.x = 0;
                prefabNode.y = 0;
                this.node.addChild(prefabNode, -1) // 添加到最底层
                prefabNode.name = "prefabNode";
                this.node.setContentSize(prefabNode.getContentSize());
                this.node.anchorX = prefabNode.anchorX;
                this.node.anchorY = prefabNode.anchorY;
            }
        }
    }

    onLoad() {
        this._initPrefab()
    }

    private _initPrefab() {
        if (!this._prefab || this._prefabNode) {
            return
        }

        if (CC_EDITOR) {
            this._onPrefabChanged(null, this._prefab)
        }
        else {
            let prefabNode = cc.instantiate(this._prefab);
            if(prefabNode){
                //复制属性
                prefabNode.x = this.node.x;
                prefabNode.y = this.node.y;
                prefabNode.scale = this.node.scale;
                prefabNode.y = this.node.y;
                prefabNode.angle = this.node.angle;
                prefabNode.opacity = this.node.opacity;
                prefabNode.zIndex = this.node.zIndex;
                prefabNode.parent = this.node.parent;
                prefabNode.name = this.node.name;
                // 更新this.node所在的根节点脚本对应ui树中的引用
                if (this.node["__RootScript__"]) {
                    if (this.node["__RootScript__"]["_fire"]) {
                        if (this.node["__RootScript__"]["_fire"][prefabNode.name]) {
                            this.node["__RootScript__"]["_fire"][prefabNode.name] = prefabNode;
                        }
                    }
                }

                this._prefabNode = prefabNode;
                this.node.destroy();
            }
        }
    }
}
