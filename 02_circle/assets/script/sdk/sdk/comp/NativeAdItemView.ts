import BaseNativeAdItemModel from "../base/BaseNativeAdItemModel";
import SDKManager from "../SDKManager";
import { random } from "../SDKConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NativeAdItemView extends cc.Component {

    @property(cc.Sprite)
    adImage: cc.Sprite = null;

    @property(cc.Label)
    title: cc.Label = null;

    protected model: BaseNativeAdItemModel;
    start() {

    }

    setModel(item) {
        this.model = item;
        // console.log('item.imgUrl =========== ', this.model.getIcon())
        this.title.string = this.model.getTitle();
        let imageList: string[] = this.model.getImgList();
        if (imageList) {
            cc.assetManager.loadRemote(imageList[random(0, imageList.length)], (err, texture) => {
                if (err) {
                    console.log(' err ', err)
                    return;
                }
                this.adImage.spriteFrame = new cc.SpriteFrame(texture)
                SDKManager.getChannel().reportAdShow(this.model.getID())
            });
        }

    }

    onButtonClick() {
        SDKManager.getChannel().reportAdClick(this.model.getID())
    }
}
