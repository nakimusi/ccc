declare namespace wx {
    function saveImageToPhotosAlbum(obj)
    function getUserInfo(obj)
    function getSystemInfoSync(): any;
    function request(any): void;
    function connectSocket(any): void;
    function getNetworkType(any);
    function onNetworkStatusChange(callback: Function);
    function onMemoryWarning(callback: Function);
    function shareAppMessage(data: any);
    function createBannerAd(data: any)
    function createRewardedVideoAd(data: any)
    function onShareAppMessage(func: Function);
    function showShareMenu(obj);
    function createInterstitialAd(obj)
    function wladGetAds(num, func: Function);
    function updateShareMenu(obj);
    function getShareInfo(obj)
    function setStorageSync(obj, data)
    function getStorageSync(obj)
    function clearStorageSync();
    function removeStorageSync(key)
    function previewImage(obj)
    function navigateToMiniProgram(obj)
    function getLaunchOptionsSync();
    function onShow(fun: Function)
    function onHide(fun: Function)
    function getOpenDataContext();
    function vibrateShort();
    function loadSubpackage(obj)
    function checkSession(obj)
    function login(obj)

    function showToast(obj)

    //---ald
    function aldSendOpenid(key: string);
    function aldSendEvent(name: string, data?: any)
    function aldOnShareAppMessage(func: Function)
    function aldShareAppMessage(obj)

    module aldStage {
        function onEnd(func: any)

        function onStart(obj: any);

        function onRunning(obj: any)
    }

    module aldLevel {
        function onInitLevel(obj)
        function onSetLevel(obj)
    }

    class InterstitialAd {
        show();
        load();
        destroy();
        onLoad(func: Function);
        offLoad(func: Function);
        onError(func: Function)
        offError(func: Function)
        onClose(func: Function)
        offClose(func: Function)
    }

    class RewardedVideoAd {
        load();
        show();
        onLoad(func: Function)
        onClose(func: Function)
        onError(func: Function)
        offLoad(func: Function)
        offError(func: Function)
        offClose(func: Function)
        destroy();
    }

    class BannerAd {
        hide();
        show();
        destroy();

        onResize(func: Function)
        offResize(func: Function)
        onLoad(func: Function)
        offLoad(func: Function)
        onError(func: Function)
        offError(func: Function)

    }
}