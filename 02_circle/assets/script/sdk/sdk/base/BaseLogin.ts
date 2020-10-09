import { DataCallback, ResultCallback } from "../SDKConfig";
import BaseChannel from "./BaseChannel";

export default class BaseLogin {
    protected channel: BaseChannel;

    constructor(channel: BaseChannel) {
        this.channel = channel;
    }

    login(account: string, func: ResultCallback) {

    }

    getUserInfo(withCredentials:string,lang:string,func: DataCallback) {

    }

    checkSession(callback: ResultCallback) {

    }
}