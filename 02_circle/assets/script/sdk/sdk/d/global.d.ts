// 全局声明，以免有错误提示
declare class http {
    onreadystatechange: Function;
    status: number;
    readyState: number;
    responseText: string;
    statusText: string;
    open(method, address, flag: boolean);
    send(data?);
    setRequestHeader(s1, s2);
}

declare module canvas {
    function toTempFilePathSync(obj)
}


declare class AdvOTImage {
    static start(func: Function);
    static change(func: Function);
    static navigateToMiniProgram();
}

// declare namespace msgpack{
//     function decode(str: Uint8Array):any;
//     function encode(str): any;
// }
declare function require(moduleName: string): any;

declare module dcodeIO {
    module ByteBuffer {
        function allocate(number?: number): any;
        function wrap(buffer: any): any;
    }

}

declare module pako {
    function inflate(a): any;
}

declare namespace jsb {
    export class AssetsManager {

    }
}

declare namespace PlatformClass {
    function createClass(obj)
}

