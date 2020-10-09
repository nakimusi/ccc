const {ccclass, property} = cc._decorator;

@ccclass
export class ScrollViewEx extends cc.Component {

    @property(cc.Prefab)
    private itemPrefab: cc.Prefab = null;

    @property()
    itemCountInCell = 1;    //一个cell包含item的数量
    
    @property()
    cellInterval = 15;      //cell之间的间隔
    
    @property()
    loadInterval = 0.017;   //当个item加载间隔时间(默认一帧) 

    @property({
        type: cc.Component.EventHandler,
        displayName: "回调函数"
    })
    callback = new cc.Component.EventHandler();

    _scrollView = null;     //滑动列表
    _isVertical = true;     //滑动列表的滑动方向,默认为竖着,(true 竖着滚动的/false 横着滚动)(不支持横竖一起的)
    
    _itemInterval = 0;      //cell内,item的间隔

    _data = null;           //滑动列表对应的数据,设置数据后,item才开始加载
    _loadIndex = 0;         //分帧加载item,目前加载的index
    _loadtime = 1.0/60.0;   //像个多久时间加载一次,默认为一帧
    _loading = false;       //是否正在加载

    _items = [];            //所有item列表

    _arg1 = null;
    _arg2 = null;
    _arg3 = null;

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
    }

    //初始化UI
    _initUI(){
        cc.log(this.itemPrefab.data.width,this.itemPrefab.data.height);
        
        this._scrollView = this.node.getComponent(cc.ScrollView);
        this._isVertical = this._scrollView.vertical;
        
        if (this._isVertical) {//竖着
            this._itemInterval = (this._scrollView.content.width - this.itemCountInCell*this.itemPrefab.data.width)/(this.itemCountInCell + 1);
        }
        else{   //横着
            this._itemInterval = (this._scrollView.content.height - this.itemCountInCell*this.itemPrefab.data.height)/(this.itemCountInCell + 1);
        }
    }

    //初始化事件
    _initEvent() {
    }

    //销毁事件
    _destroyEvent() {
    }

    load(data,arg1,arg2,arg3){
        this._data = data;
        this._arg1 = arg1;
        this._arg2 = arg2;
        this._arg3 = arg3;
        this._loading = true;
        
        let maxCell = Math.ceil(this._data.length/this.itemCountInCell);
        
        if (this._isVertical) {//竖着
            this._scrollView.content.height = this.itemPrefab.data.height * maxCell + this.cellInterval*(maxCell+1);
        }
        else{   //横着
            this._scrollView.content.width = this.itemPrefab.data.width * maxCell + this.cellInterval*(maxCell+1);
        }

    }

    //加载一个item
    _loadItem(index){
        let itemNode = cc.instantiate(this.itemPrefab);
        itemNode.parent = this._scrollView.content;

        itemNode['_index_'] = index;
        itemNode.script.init(this._data[index],this._arg1,this._arg2,this._arg3);
        itemNode.script['_callBack'] = this.callback;

        this._setItemPosition(index,itemNode);
        
        this._items.push(itemNode);
    }

    //根据位置和item尺寸设置item位置
    _setItemPosition(index,item){
        let row = Math.floor(index/this.itemCountInCell);
        let col = Math.floor(index%this.itemCountInCell);
        // cc.log(index,row,col);

        if (this._isVertical) {//竖着this._itemInterval
            item.x =       (item.width  + this._itemInterval) * col + item.width  *      item.anchorX  + this._itemInterval;
            item.y = -1 * ((item.height + this.cellInterval)  * row + item.height * (1 - item.anchorY) + this.cellInterval);
        }
        else{   //横着
            item.x =      ((item.width  + this.cellInterval)  * row + item.width  *     item.anchorX  + this.cellInterval);
            item.y = -1 * ((item.height + this._itemInterval) * col + item.height * (1- item.anchorY) + this._itemInterval);
        }

    }

    // 控制所有item显示隐藏
    _changeItemVisiable(){
        if (this._scrollView.isScrolling() || this._scrollView.isAutoScrolling() || this._loading) {
            cc.log(this._scrollView.isScrolling(),this._scrollView.isAutoScrolling(),this._loading)
            
            for (let i = 0; i < this._items.length; i++) {
                this._changeVisiable(this._items[i]);
            }
        }

    }

    // 控制单个item显示隐藏
    _changeVisiable(item){
        let view = item.parent.parent
        let position = item.parent.convertToWorldSpaceAR(item.position);
        position = view.convertToNodeSpaceAR(position);
        
        if (this._isVertical) {//竖着
            let posyUp = position.y + item.height*(1-item.anchorY);
            let posyBottom = position.y - item.height*item.anchorY;
            if (posyBottom > 0 || posyUp < -view.height) {
                item.opacity = 0;
            }
            else{
                item.opacity = 255;
            }
        }
        else{   //横着
            let posyLeft = position.x + item.width*(1-item.anchorX);
            let posyRight = position.y - item.width*item.anchorY;
            if (posyLeft < 0 || posyRight > view.width) {
                item.opacity = 0;
            }
            else{
                item.opacity = 255;
            }
        }

    }

    //分帧加载scrollview的项目
    update(dt){
        if (this._loading) {
            this._loadtime -= dt;
         
            //加载
            if (this._loadIndex < this._data.length) {
                if (this._loadtime < 0) {
                    this._loadItem(this._loadIndex);

                    this._loadIndex++;
                    this._loadtime = this.loadInterval;
                }
            }
            else{
                this._loading = false;
            }

        }

        //控制所有item显示隐藏
        this._changeItemVisiable();
    }

}
