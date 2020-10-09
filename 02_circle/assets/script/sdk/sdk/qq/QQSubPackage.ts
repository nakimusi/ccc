import BaseSubPackage from "../base/BaseSubPackage";
import { ResultState, DataCallback } from "../SDKConfig";


export default class QQSubPackage extends BaseSubPackage {


    loadSingle(subname: string, callback: DataCallback) {

        const loadTask = wx.loadSubpackage({
            name: subname, // name 可以填 name 或者 root
            success: (res) => {
                // 分包加载成功后通过 success 回调
                callback(ResultState.YES, null)
            },
            fail: (res) => {
                // 分包加载失败通过 fail 回调
                callback(ResultState.NO, null)
            },
        });

        loadTask.onProgressUpdate((res: { progress: number, }) => {
            callback(ResultState.PROGRESS, res.progress)
        })


    }
}
