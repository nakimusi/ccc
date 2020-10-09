

export default class BaseSDK {
    protected sdk: any;
    constructor(sdk) {
        this.setSDK(sdk)
    }

    setSDK(sdk: any) {
        this.sdk = sdk;
    }
}