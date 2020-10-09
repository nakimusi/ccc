import BaseNativeAdItemModel from "./base/BaseNativeAdItemModel";
export function isNull(obj: any): boolean {
    return obj == undefined || obj == null;
}

export function random(start: number, end?: number): number {
    if (end) {
        return Math.floor(Math.random() * (end - start) + start)
    } else {
        return Math.floor(Math.random() * start);
    }
}
export function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}

export type DataCallback = (result: ResultState, data: any) => void;
export type ResultCallback = (result: ResultState) => void
export type NativeAdCallback = (list: BaseNativeAdItemModel[]) => void;
//广告名称，对应SDKCOnfig中的key
export class ADName {
    static banner: string = 'banner'//bander 广告
    static reward: string = 'reward'//激励视频
    static insert: string = 'insert'//插屏广告
    static native: string = 'native'//原生广告
    static appbox: string = 'appbox'//盒子广告
    static shareTitle: string = 'shareTitle'//分享标题
    static shareImage: string = 'shareImage'//分享图片或者ID
    static shareImageId: string = 'shareImageId'//分享图片的ID
}


//广告拉取失败是否使用分享
export let USE_SHARE: boolean = true;


export enum ResultState {
    NO,
    YES,
    PROGRESS,
}
/**
 * 广告状态
 * 
 */
export enum SDKState {
    close,//关闭状态
    loading,//加载状态
    loadSucess,//加载成功
    loadFail,//加载失败
    open,//播放状态

}

/**
0	开发
1	微信
2	QQ
3	头条
4	OPPO
5	VIVO
6	百度
 */
export enum ChannelID {
    DEV,
    WX,
    QQ,
    TT,
    OPPO,
    VIVO,
    BD,//百度
}


export let SDKConfig: any[] = [
    {},//dev
    {//微信
        'banner': ['adunit-d5f649ff30c2ff12'],
        'reward': ['adunit-a57ea0e6ae249c23'],
        'shareTitle': ['拼图大战,你准备好了吗?','可爱的小猫咪,快来帮帮她!'],
        'shareImage': ['https://mmocgame.qpic.cn/wechatgame/Yc0K0gtav8ZN7gbMSS3ErS4KrdSocf75AJ9KvNL3LURMcIQUUYzKQZG0sk59mic93/0','https://mmocgame.qpic.cn/wechatgame/Yc0K0gtav8ZP5fdofPFRqwfsG69IusJ6A6ibW0CMI02dRcXTMkJm88TLskeJI40V1/0'],
        'shareImageId': ['fB0y1lGuRwu935jIG0mFNw==','O5iRP90kQPWgGFGd4/PRjw==']
    },
    {//qq
        'banner': ['3dc6fcfee4628890315d17344b304198'],
        'insert': ['eb6a8d5369ad7568ce03dc2941063bd4'],
        'reward': ['1cbf2104918dc3fce3528e4e50d5de3f',],
        'appbox': ['3c1dbaed966527bb40c4cfda9e9789d1'],
        'shareTitle': ['[有人@你]快来挑战吧'],
        'shareImage': ['share4.jpg'],
    },
    {//tt
        'banner': ['11kgdie55kae611xob'],
        'reward': ['3dcflbcao8dh18g6ja',],
        'insert': ['9406efbfk8eh2hccel'],
        'shareTitle': ['[有人@你]快来挑战吧'],
        'shareImage': ['share4.jpg'],
    },
    {//oppo
        'banner': ['184591'],
        'reward': ['184600',],
        'native': ['184599', '184598', '184597'],
        'insert': ['184593']
    },
    {//vivo
        'banner': ['a0d995c8e3e945e89455612b15a2d24c'],
        'reward': ['83c0e30bf7b0473c9cbfcf9b6644527c'],
        'insert': ['4f9d9fff72b64f868e48a3be2674f344'],
        'native': ['8e95b90220c04fa5934cd4a079ad8f53']
    },
    {//baidu
        'banner': [''],
        'reward': [
            '7052091',//复活
        ]
    },


]