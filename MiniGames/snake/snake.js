//create canvas and a rendering context to draw stuff with


class Tilemap {
    constructor(width, height, size, canvasid) {

        this.width = width
        this.height = height
        this.size = size

        this.c = document.getElementById(canvasid)
        this.ctx = this.c.getContext('2d')
        this.c.width = this.width*size
        this.c.height = this.height*size

        this.tileArray = []
        var i = 0, k=0,column = []
        for (k = 0; k < width; k++) {
            for (i = 0; i < height; i++) {
                column[i] = 0
            }
            this.tileArray.push(column)
        }
    }
    render() {
        this.ctx.clearRect(0,0,this.c.width,this.c.height)
        var x = 0,y=0;
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                if (this.tileArray[x][y] == 1) {
                    this.ctx.fillStyle = 'rgb(255,255,255)'
                }else if (this.tileArray[x][y] == 2) {
                    this.ctx.fillStyle = 'rgb(255,0,0)'
                } else {
                    this.ctx.fillStyle = 'rgb(0,0,0)'
                }
                this.ctx.fillRect(x*this.size,y*this.size,this.size,this.size)
            }
        }
    }
    setTile(x,y,value) {
        if (value && typeof value == 'number' && value < 3 && value > -1) {
            this.tileArray[x][y] = value
            return true
        } else {
            return false
        }
    }
}

tilemap = new Tilemap(21,21,10,'snakeCanvas')
console.log(tilemap)
tilemap.render()