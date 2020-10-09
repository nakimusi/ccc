
export default interface TextureRenderInterface {

    getTexture();


    init(camera: cc.Camera, renderNode: cc.Node);
    createCanvas(): void;

    getCanvas();

    stopCamera();

}
