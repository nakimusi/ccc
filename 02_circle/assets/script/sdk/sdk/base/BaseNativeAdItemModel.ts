export default class BaseNativeAdItemModel {
    getID() {
    }

    getTitle(): string {
        return ''
    }

    getIcon() {
        let list = this.getIconList();
        if (list && list.length > 0) {
            return list[0]
        }
        return null;
    }


    getDesc() {

    }

    getIconList(): string[] {
        return [];
    }

    getImgList(): string[] {
        return [];
    }

    getButtonText() {

    }

    getShowImageList() {
        return []
    }
}