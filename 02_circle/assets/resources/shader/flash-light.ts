const { ccclass, executeInEditMode, property } = cc._decorator;

@ccclass
@executeInEditMode
export default class FlashLight extends cc.Component {
    //扫光颜色
    @property()
    private _lightColor = cc.Color.YELLOW;
    @property({visible: true, displayName: "angle 0~180"})
    set lightColor(value) {
        this._lightColor = value;
        this._updateProperty(); 
    }
    get lightColor(){ return this._lightColor; }

    //扫光角度
    @property()
    private _lightAngle = 135;
    @property({visible: true, displayName: "angle 0~180"})
    set lightAngle(value) {
        this._lightAngle = value;
        this._updateProperty(); 
    }
    get lightAngle(){ return this._lightAngle; }

    //扫光宽度
    @property()
    private _lightWidth = 0.2;
    @property({visible: true, displayName: "width"})
    set lightWidth(value) {
        this._lightWidth = value;
        this._updateProperty(); 
    }
    get lightWidth(){ return this._lightWidth; }
    
    //扫光速度
    @property()
    private _lightSpeed = 0.01;
    @property({visible: true, displayName: "width"})
    set lightSpeed(value) {
        this._lightSpeed = value;
        this._updateProperty(); 
    }
    get lightSpeed(){ return this._lightSpeed; }

    //扫光位置
    _pos        = cc.v2(0, 1);      //扫光初始位置
    _material   = null;             //材质
    _running    = true;             //是否正在扫光

    onLoad() {
        cc.dynamicAtlasManager.enabled = false; //关闭引擎的动态图集的功能,不然shader无效

        if (CC_EDITOR) {
            var self = this
            cc.loader.loadRes("shader/flash-light", cc.Material, function(err, res) {
                self._material = res;
            });
        }

        this._updateMaterial();
    }
    
    //更新属性-编辑器
    _updateProperty(){
        // 调整角度
        if (this._lightAngle > 180) this._lightAngle = 180;
        if (this._lightAngle < 0 ) this._lightAngle = 0;

        this._updateMaterial();
    }

    private _updateMaterial() {
        if (CC_EDITOR && this._material == null) return;

        // let aaa = this.getComponents(cc.RenderComponent);
        this.getComponents(cc.RenderComponent).forEach(renderComponent => {
            let material: cc.Material = renderComponent.getMaterial(0);
            material.setProperty("lightColor", this._lightColor);
            material.setProperty("lightCenterPoint", this._pos);
            material.setProperty("lightAngle", this._lightAngle);
            material.setProperty("lightWidth", this._lightWidth);
            material.setProperty("enableGradient", 1);  //是否启用光束渐变
            renderComponent.setMaterial(0, material);
        });
    }

    update(){
        if (CC_EDITOR) {
            this.node.getComponent(cc.Sprite).setMaterial(0, this._material);
            this._pos.x = 0.5;
            this._pos.y = 0.5;
        }
        else{
            if (this._running) {
                this._pos.x = this._pos.x + this._lightSpeed;
                if (this._pos.x > 2) {
                    this._pos.x = 0
                }
                this._pos.y = 1 - this._pos.x;
    
            }
        }
        
        this._updateMaterial();
        
    }

    //开始扫光
    setStart(){
        this._running = true;
        this._pos = cc.v2(0, 1);
        this._updateMaterial();
    }

    //停止扫光
    setPause(){
        this._running = false;
        this._pos = cc.v2(-1, 2);
        this._updateMaterial();
    }
}

