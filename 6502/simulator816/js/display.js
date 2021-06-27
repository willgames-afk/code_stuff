const PXWIDTH = 640, PXHEIGHT = 480

class Display {
    constructor(parentElement) {

        //Create Canvas
        this._canvas = document.createElement("canvas");
        this._canvas.width = PXWIDTH;
        this._canvas.height = PXHEIGHT;
        parentElement.appendChild(this._canvas);

        //Create drawing context 
        this._ctx = this._canvas.getContext("2d");

        //Get canvas image data
        this._ctx.fillStyle = "#000000FF";
        this._ctx.fillRect(0,0,PXWIDTH,PXHEIGHT)
        var imgdata = this._ctx.getImageData(0, 0, PXWIDTH, PXHEIGHT);

        this.vgaDisplay.data = imgdata.data;
        this.vgaDisplay.update = () => {
            this._ctx.putImageData(this.vgaDisplay.data);
        }

        this.blinkenlights = 0;
    }
}

export { Display };