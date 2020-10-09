import TextureRenderInterface from "../cfw/interface/TextureRenderInterface";


/**
 * https://github.com/cocos-creator/example-cases/tree/master/assets/cases/07_capture_texture
 */
export default class TextureRenderUtils implements TextureRenderInterface{



    private static ins: TextureRenderUtils;

    static instance() {
        if (!this.ins) {
            this.ins = new TextureRenderUtils()
        }
        return this.ins;
    }


    protected camera: cc.Camera = null;
    protected renderNode: cc.Node = null;
    protected _canvas: any = null;
    protected texture: cc.RenderTexture;

    getTexture() {
        return this.texture;
    }


    init(camera: cc.Camera, renderNode: cc.Node) {
        this.camera = camera;
        this.renderNode = renderNode;
        // this.label = '';
        let texture = new cc.RenderTexture();
        // cc.log(' cc.game ', cc.game)
        let gl = cc.game._renderContext;
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
        this.camera.targetTexture = texture;
        this.texture = texture;
    }
    // create the img element
    // create the canvas and context, filpY the image Data
    createCanvas(): void {
        let width = this.texture.width;
        let height = this.texture.height;
        // logInfo('createCanvas ==============11111 ', document)
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
            this._canvas.width = width;
            this._canvas.height = height;
        }
        else {
            this.clearCanvas();
        }
        // logInfo('createCanvas ==============222222 ')
        this.camera.render(this.renderNode);
        this.setData()
    }

    getCanvas(): any {
        return this._canvas;
    }

    stopCamera() {
        this.camera.node.active = false;
    }


    /**
     * 获取截取的图片
     */
    getSpriteFrame() {
        this.createCanvas()
        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(this.texture);
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
        return node;
    }

    setData(): any {
        // logInfo('createCanvas ==============33333 ', this._canvas)
        let width = this.texture.width;
        let height = this.texture.height;
        let ctx = this._canvas.getContext('2d');
        // console.log(' ctx ', ctx)
        let data = this.texture.readPixels();
        // write the render data
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }

            ctx.putImageData(imageData, 0, row);
        }
        // logInfo('createCanvas ==============444444 ')
        return data;
    }




    // show on the canvas

    clearCanvas() {
        let ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
}
