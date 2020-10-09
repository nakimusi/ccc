import { SDKState } from "../SDKConfig";



export default class BaseRecorder {


    protected recorder: any;

    protected videoPath: string = null;

    protected state: SDKState = SDKState.close
    start(obj?: any) { }
    pause() { }
    resume() { }
    stop(isSave: boolean = true) { }
    //记录精彩的视频片段
    recordClip(object) { }

    changeState(s) {
        this.state = s;
    }

    getVideoPath() {
        return this.videoPath;
    }

    clear() {
        this.videoPath = null;
    }

    isOpen() {
        return this.state == SDKState.open;
    }

    isClose() {
        return this.state == SDKState.close;
    }

    getState() {
        return this.state;
    }

}
