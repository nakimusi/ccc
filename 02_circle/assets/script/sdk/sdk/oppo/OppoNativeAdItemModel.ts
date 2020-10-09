import BaseNativeAdItemModel from "../base/BaseNativeAdItemModel";


export default class OppoNativeAdItemModel extends BaseNativeAdItemModel {

    //广告标识，用来上报曝光与点击
    adId;

    //广告标题
    title;

    //广告描述
    desc;

    //推广应用的Icon图标
    iconUrlList;

    //广告图片
    imgUrlList;

    //“广告”标签图片
    logoUrl;

    //点击按钮文本描述
    clickBtnTxt;

    //获取广告类型，取值说明：0：无 1：纯文字 2：图片 3：图文混合 4：视频
    creativeType;
    //获取广告点击之后的交互类型，取值说明： 0：无 1：浏览类 2：下载类 3：浏览器（下载中间页广告） 4：打开应用首页 5：打开应用详情页
    interactionType;

    initWithOppo(res){
        this.adId = res.adId;
        this.title = res.title;
        this.desc = res.desc;
        this.iconUrlList = res.iconUrlList;
        this.imgUrlList = res.imgUrlList;
        this.logoUrl = res.logoUrl;
        this.clickBtnTxt = res.clickBtnTxt;
        this.creativeType = res.creativeType;
        this.interactionType = res.interactionType;
    }
    getShowImageList(){
        return this.getImgList()
    }
    getID(){
        return this.adId
    }

    getTitle(){
        return this.title;
    }

    getDesc(){
        return this.desc;
    }

    getIconList(){
        return this.iconUrlList;
    }

    getImgList(){
        return this.imgUrlList
    }

    getButtonText(){
        return this.clickBtnTxt;
    }






}
