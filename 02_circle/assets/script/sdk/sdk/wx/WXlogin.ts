import BaseLogin from "../base/BaseLogin";
import { ResultCallback, ResultState, DataCallback } from "../SDKConfig";

/**
 * https://developers.weixin.qq.com/minigame/dev/api/open-api/login/wx.login.html
 */
export default class WXLogin extends BaseLogin {


    checkSession(callback: ResultCallback) {
        wx.checkSession({
            success(res) {
                console.log(`session未过期`);
                callback(ResultState.YES);
            },
            fail(res) {
                console.log(`session已过期，需要重新登录`);
                callback(ResultState.NO);
            }
        });
    }


    login(account: string, func: ResultCallback) {
        let isForce: boolean = false;
        wx.login({
            force: isForce,
            success(res) {
                console.log(`login调用成功${res.code} ${res.anonymousCode}`);
                func(ResultState.YES)
            },
            fail(res) {
                // console.log(`login调用失败`);
                if (isForce) {
                    func(ResultState.NO)
                } else {
                    func(ResultState.YES)
                }

            }
        });

    }

    getUserInfo(withCredentials: string, lang: string, func: DataCallback) {
        wx.getUserInfo({
            withCredentials: withCredentials,
            lang: lang,
            success(res) {
                console.log(`getUserInfo调用成功${res.userInfo}`);
                func(ResultState.YES, res)
            },
            fail(res) {
                console.log(`getUserInfo调用失败`, res);
                func(ResultState.NO, null)
            }
        });
    }

    logout() {

    }
}
