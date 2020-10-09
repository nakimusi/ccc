//游戏状态
export enum GameStatus {
    Ready,  //准备
    Gaming, //游戏中
    Finish  //结束
};

//游戏管理类
export class GameManager  {

    static _sInstance           = null;             //静态实例
    private _status:GameStatus  = GameStatus.Ready; //默认为准备状态

    constructor() {
        let a = 1;

    }

    static getInstance() : GameManager{
        if (GameManager._sInstance == null) {
            GameManager._sInstance = new GameManager();
        }
        return GameManager._sInstance;
    }
    
    //获取当前游戏状态
    getStatus(){
        return this._status;
    }

    //设置当前游戏状态
    setStatus(status:GameStatus){
        return this._status = status;
    }
}
