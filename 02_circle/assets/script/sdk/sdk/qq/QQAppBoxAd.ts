
import BaseAd from "../base/BaseAd";

export default class QQAppBoxAd extends BaseAd {

    protected instance: qq.AppBox;
    open(id: string) {

        this.create(id)
    }

    create(id: string) {
        this.adUnitID = id;
        this.instance = qq.createAppBox({ adUnitId: id })
        this.load()
    }

    load() {
        if (this.instance) {
            this.instance.load()
        }
    }

    show() {
        if (this.instance) {
            this.instance.show()
        }
    }

    destroy() {
        if (this.instance) {
            this.instance.destroy()
        }
    }


}