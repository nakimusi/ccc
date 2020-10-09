class MusicManager{
    static _startLoad = false;
    static _loadIndex = 0;
    static _loadList = [];

    static _musicFlg = 1;   //音乐开关状态 1 开启 0关闭
    static _effectFlg = 1;  //音效开关状态 1 开启 0关闭
    static _shakeFlg = 1;   //震动开关状态 1 开启 0关闭

    static _musicKey = '_music_flg_';
    static _effectKey = '_effect_flg_';
    static _shakeKey = '_shake_flg_';

    /**
    初始化音乐 音效
    */
    static init() {
        // cc.log('initMusicEffect');
        this._musicFlg = yyp.local.getIntItem(MusicManager._musicKey,1);
        cc.audioEngine.setMusicVolume(this._musicFlg);

        this._effectFlg = yyp.local.getIntItem(MusicManager._effectKey,1);
        cc.audioEngine.setEffectsVolume(this._effectFlg);
        
        this._shakeFlg = yyp.local.getIntItem(MusicManager._shakeKey,1);
        
        MusicManager.preloadMusic();
    }

    
    /**
    开启音乐
    */
    static musicOn(){
        this._musicFlg = 1;
        yyp.local.getIntItem(MusicManager._musicKey,this._musicFlg);
        cc.audioEngine.setMusicVolume(this._musicFlg);
    }
    
    /**
    关闭音乐
    */
    static musicOff(){
        this._musicFlg = 0;
        yyp.local.getIntItem(MusicManager._musicKey,this._musicFlg);
        cc.audioEngine.setMusicVolume(this._musicFlg);
    }

    /**
    开启音效
    */
    static effectOn(){
        this._effectFlg = 1;
        yyp.local.getIntItem(MusicManager._effectKey,this._effectFlg);
        cc.audioEngine.setMusicVolume(this._effectFlg);
    }

    /**
    关闭音效
    */
    static effectOff(){
        this._effectFlg = 0;
        yyp.local.getIntItem(MusicManager._effectKey,this._effectFlg);
        cc.audioEngine.setMusicVolume(this._effectFlg);
    }

    /**
    开启震动
    */
    static shakeOn(){
        this._shakeFlg = 1;
        yyp.local.getIntItem(MusicManager._shakeKey,this._shakeFlg);
    }

    /**
    关闭震动
    */
    static shakeOff(){
        this._shakeFlg = 0;
        yyp.local.getIntItem(MusicManager._shakeKey,this._shakeFlg);
    }
    

    //预加载音乐音效
    static preloadMusic() {
        if (MusicManager._startLoad == false) {
            MusicManager._startLoad = true;

            //获取key
            MusicManager._loadList = [];
            for (const key in yyp.config.Music) {
                if (yyp.config.Music.hasOwnProperty(key)) {
                    MusicManager._loadList.push(key);
                }
            }

            //预加载音效
            MusicManager._preload();
        }
    }

    //预加载音效
    static _preload() {
        let effectKey = MusicManager._loadList[MusicManager._loadIndex];
        cc.log("_preload ",effectKey);
        let onResourceLoaded = function(err, content)
        {
            MusicManager._loadIndex += 1;
            cc.log("_preload ",effectKey,"finish");
            
            if(content instanceof cc.AudioClip) { 
                const element = yyp.config.Music[effectKey];
                element["content"] = content;
                cc.log("_preload ",effectKey,"finish 2");
                if(element.PlayOnload == 1){
                    MusicManager.playMusic(effectKey);
                }
            }
            if (MusicManager._loadIndex >= MusicManager._loadList.length) {
                cc.log("_preload complete ",(new Date()).valueOf());
            }
            else{
                MusicManager._preload();
            }
        };

        cc.resources.load("sfx/" + yyp.config.Music[effectKey].Path, cc.AudioClip, onResourceLoaded);
    }
    

    //播放背景音乐
    static playMusic(key) {
        const element = yyp.config.Music[key];
        if (element && element["content"]) {
            cc.audioEngine.playMusic(element["content"], true);
        }
    }
    
    //播放音效
    static playEffect(key) {
        if (this._effectFlg == 1) {
            const element = yyp.config.Music[key];
            if (element && element["content"]) {
                cc.audioEngine.playEffect(element["content"], false);
            }
        }
    }

    /**
    震动 短15ms
    */
    static vibrateShort(){
        if (this._shakeFlg == 1){
            if (cc.sys.platform === cc.sys.WECHAT_GAME){
                wx.vibrateShort();
            }
        }
    }
    /**
    震动 长400ms
    */
    static vibrateLong(){
        if (this._shakeFlg == 1){
            if (cc.sys.platform === cc.sys.WECHAT_GAME){
                wx.vibrateLong();
            }
        }
    }

}

yyp.music = MusicManager;