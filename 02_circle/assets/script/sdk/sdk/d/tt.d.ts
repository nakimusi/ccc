declare namespace tt {
    function createVideo(obj)
    function getUpdateManager();
    function getGameRecorderManager();
    function getUserInfo(obj)
    function login(obj)
    function checkSession(obj)
    function showToast(obj)
    function showModal(obj)
    //-------------------
    function getSystemInfoSync(): any;
    function request(any): void;
    function connectSocket(any): void;
    function getNetworkType(any);
    function onNetworkStatusChange(callback: Function);
    function onMemoryWarning(callback: Function);
    function shareAppMessage(data: any);
    function createBannerAd(data: any)
    function saveImageToPhotosAlbum(obj)
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
    function getOpenDataContext();
    function vibrateShort(obj);
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

    class UpdateManager{

    }
}