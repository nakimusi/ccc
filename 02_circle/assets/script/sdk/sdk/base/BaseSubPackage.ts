import { ResultState, DataCallback } from "../SDKConfig";
import BaseChannel from "./BaseChannel";

export default class BaseSubPackage {

    protected subNames: string[];

    protected callback: DataCallback;

    protected channel: BaseChannel;

    constructor(channel: BaseChannel) {
        this.channel = channel;
    }

    /**
     * 加载单个分包
     * @param name 
     * @param callback 
     */
    loadSingle(name: string, callback: DataCallback) {

    }


    /**
     * 根据给定的分包列表加载
     * @param subNames 
     * @param callback 
     */
    loadList(subNames: string[], callback: DataCallback) {
        this.loadSingle(subNames.shift(), (state: ResultState, progress) => {
            switch (state) {
                case ResultState.YES:
                    if (this.subNames.length > 0) {
                        this.loadList(subNames, callback)
                    }else{
                        callback(state, progress)
                    }
                    break;
                case ResultState.NO:
                    callback(state, progress)
                    break;
                case ResultState.PROGRESS:
                    callback(state, progress)
                    break;
            }

        })
    }
}
