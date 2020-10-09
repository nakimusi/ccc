declare module yyp {
    /**
     消息发送中心
    */
    export const eventCenter: any;

    /**
     游戏窗口大小
    */
    export let gameFrameSize: cc.Size;	

    /**
     游戏窗口缩放比例
    */
    export let gameFactor: number;	

    /**
     游戏窗口安全区域上(上边缘)
    */
    export let safeTopTop: number;	

    /**
     游戏窗口安全区域上(下边缘)
    */
    export let safeTopBottom: number;	


    export let config: any;	
    export let bundle: any;	
    
    /**
     * 实现WebGL program的类，用来做shader编程
     */
    // export class EffectAsset11{
    // };

    // // export String;
    // export type String=string;
};

declare module wx {
    export const getMenuButtonBoundingClientRect: any;
    export const getSystemInfoSync: any; 
    export const vibrateShort: any; 
}