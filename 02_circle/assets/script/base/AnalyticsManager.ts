const {ccclass, property} = cc._decorator;

@ccclass
export class AnalyticsManager extends cc.Component {
    static _channel = '';

    //初始化
    static getChannel() {
        // cc.sys.MOBILE_BROWSER	100
        // cc.sys.DESKTOP_BROWSER	101
        // cc.sys.EDITOR_PAGE	102
        // cc.sys.EDITOR_CORE	103
        // cc.sys.WECHAT_GAME	104
        // cc.sys.QQ_PLAY	105
        // cc.sys.FB_PLAYABLE_ADS	106
        // cc.sys.BAIDU_GAME	107
        // cc.sys.VIVO_GAME	108
        // cc.sys.OPPO_GAME	109
        // cc.sys.HUAWEI_GAME	110
        // cc.sys.XIAOMI_GAME	111
        // cc.sys.JKW_GAME	112
        // cc.sys.ALIPAY_GAME	113
        // cc.sys.WECHAT_GAME_SUB	114
        // cc.sys.BAIDU_GAME_SUB	115
        // cc.sys.QTT_GAME	116
        // cc.sys.BYTEDANCE_GAME	117
        // cc.sys.BYTEDANCE_GAME_SUB	118
        // cc.sys.LINKSURE	119

        if (AnalyticsManager._channel === '') {
            if (cc.sys.platform === cc.sys.MOBILE_BROWSER ||
                cc.sys.platform === cc.sys.DESKTOP_BROWSER ||
                cc.sys.platform === cc.sys.EDITOR_PAGE ||
                cc.sys.platform === cc.sys.EDITOR_CORE){
                
                AnalyticsManager._channel = "debug";
            }
            else if (cc.sys.platform === cc.sys.WECHAT_GAME){
                AnalyticsManager._channel = "wechat";
            }
            else{
                AnalyticsManager._channel = "other";
            }
        }

        return AnalyticsManager._channel;
    }

    //初始化
    static init() {
        //CocosAnalytics 自动调用
    }

    //登录
    static login() {
        if (AnalyticsManager._channel == "debug") return;

        cocosAnalytics.enableDebug(true);
        // 开始登陆
        cocosAnalytics.CAAccount.loginStart({
            channel: AnalyticsManager.getChannel(),   // 获客渠道，指获取该客户的广告渠道信息   
        });

        // 登陆成功
        cocosAnalytics.CAAccount.loginSuccess({
            userID: 'default',
            age: 1,             // 年龄
            sex: 1,             // 性别：1为男，2为女，其它表示未知
            channel: AnalyticsManager.getChannel(),   // 获客渠道，指获取该客户的广告渠道信息   
        })

        // 登陆失败
        // cocosAnalytics.CAAccount.loginFailed({
        //     // reason: '密码错误' // 失败原因
        // })

    }
    
    //退出登录
    static logout() {
        if (AnalyticsManager._channel == "debug") return;

        // 退出登陆 （我们已经考虑和完善处理玩家异常登出操作）
        cocosAnalytics.CAAccount.logout()
    }

    //支付不需要
    static pay() {
        if (AnalyticsManager._channel == "debug") return;
    }
    
    //虚拟货币 - 获得
    static virtualGet(_count,_totalCount,_type = '钻石',_reason = ""){
        if (AnalyticsManager._channel == "debug") return;
        
        // 虚拟币获取
        cocosAnalytics.CAVirtual.get({
            type : _type,            //虚拟币类型，字符串，"钻石"、"金币"
            count : _count,          //购买数量，int 数字,
            reason : _reason         //获得原因，字符串
        })
        
        // 设置虚拟币留存总量
        cocosAnalytics.CAVirtual.setVirtualNum({
            type : _type,             //虚拟币类型，字符串，"钻石"、"金币"
            count : _totalCount       //虚拟币数量，long 型
        })
    }

    //虚拟货币 - 消费
    static virtualConsume(_count,_totalCount,_type = '钻石',_reason = ""){
        if (AnalyticsManager._channel == "debug") return;
        
        // 虚拟币消耗
        cocosAnalytics.CAVirtual.consume({
            type : _type,          //虚拟币类型，字符串，"钻石"、"金币"
            count : _count,        //购买数量，int 数字,
            reason : _reason       //消耗原因，字符串
        })
        
        // 设置虚拟币留存总量
        cocosAnalytics.CAVirtual.setVirtualNum({
            type : _type,             //虚拟币类型，字符串，"钻石"、"金币"
            count : _totalCount       //虚拟币数量，long 型
        })
    }


    //关卡开始
    static levelStart(_level){
        if (AnalyticsManager._channel == "debug") return;
        
        // 关卡开始
        cocosAnalytics.CALevels.begin({
            level : _level  // 关卡名称
        })
    }

    //关卡完成
    static levelComplete(_level){
        if (AnalyticsManager._channel == "debug") return;
        
        // 关卡完成
        cocosAnalytics.CALevels.complete({
            level : _level
        })
    }
    
    //关卡失败
    static levelFailed(_level,_reason = ""){
        if (AnalyticsManager._channel == "debug") return;
        
        // 关卡失败
        cocosAnalytics.CALevels.failed({
            level : _level,   // 关卡名称
            reason : _reason  // 失败原因
        })
    }

    
    //视频广告开始
    static videoADStart(_adID){
        if (AnalyticsManager._channel == "debug") return;
        
        // 广告任务 (广告ID)
        cocosAnalytics.CAAdvertising.begin({
            adID : _adID,
        })
    }

    //视频广告播放完成
    static videoADComplete(_adID,_time,_profit){
        if (AnalyticsManager._channel == "debug") return;
        
        // 广告任务
        cocosAnalytics.CAAdvertising.complete({
            adID : _adID,
            timeLong: _time,    //15*60,
            profit: _profit     //"10钻石"
        })
    }

    //视频广告播放失败
    static videoADFailed(_adID,_reason){
        if (AnalyticsManager._channel == "debug") return;
        
        // 广告失败
        cocosAnalytics.CAAdvertising.failed({
            adID : _adID,
            reason : _reason    //"取消播放"
        })
    }

    /*自定义事件
    {
        name: "事件ID",
        player1: 1,
        player2: 1
    }
    */
    static customEvent(_eventId,_data){
        if (AnalyticsManager._channel == "debug") return;
        
        // 事件开始
        // 参数：事件ID（必填）, 不得超过30个字符
        // 参数：事件内容（必填）,不能传空值
        cocosAnalytics.CACustomEvent.onStarted(_eventId, _data);
    }
    
    static clickEvent(_eventId){
        if (AnalyticsManager._channel == "debug") return;
        
        // 事件开始
        // 参数：事件ID（必填）, 不得超过30个字符
        // 参数：事件内容（必填）,不能传空值
        cocosAnalytics.CACustomEvent.onStarted('click-' + _eventId, {});
    }
}
