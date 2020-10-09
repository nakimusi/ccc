const {ccclass, property} = cc._decorator;

@ccclass
export class LocalizedData extends cc.Component {
    static _startLoad = false
    static _isLoaded = false
    static _loadIndex = 0
    static _loadList = ["Level","Player","Enemy"]
    static _config = {}

    //判断从localStorage取出的值是否是有效的
    static _isValid(value){
        
        if (value === null){
            return false;
        }

        if (value === undefined){
            return false;
        }
        
        // if (value === ""){
        //     return false;
        // }

        if (value === "NaN"){
            return false;
        }

        return true;
    }

    //获取数据
    static _getItem(key){
        let value = cc.sys.localStorage.getItem(key);
        if (this._isValid(value)){
            return value;
        }
        return null;
    }

    //获取数字类型数据
    static getIntItem(key,defaultValue){
        let ret = LocalizedData._getItem(key);
        if (ret != null && ret !== '') {
            return parseInt(ret);
        }

        return defaultValue;
    }

    //获取字符串类型数据
    static getStringItem(key,defaultValue){
        let ret = LocalizedData._getItem(key);
        if (ret != null) {
            return ret;
        }

        return defaultValue;
    }
    
    //获取JSON类型数据
    static getJsonItem(key,defaultValue){
        let ret = LocalizedData._getItem(key);
        if (ret != null && ret !== '') {
            return JSON.parse(ret);
        }

        return defaultValue;
    }
    
    //保存数据
    static _setItem(key,value){
        cc.sys.localStorage.setItem(key, value);
    }
    
    //保存数字类型数据
    static setIntItem(key,value){
        LocalizedData._setItem(key,value);
    }
    
    //保存字符串类型数据
    static setStringItem(key,value){
        LocalizedData._setItem(key,value);
    }

    //保存JSON类型数据
    static setJsonItem(key,value){
        LocalizedData._setItem(key,JSON.stringify(value));
    }
    
    //删除key
    static removeItem(key){
        cc.sys.localStorage.removeItem(key);
    }
}
