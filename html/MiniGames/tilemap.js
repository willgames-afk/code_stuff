class Tilemap {
    constructor(config) {
        this.width = config.width
        this.height = config.height
        this.size = config.size

        this.c = document.getElementById(config.canvasid)
        this.ctx = this.c.getContext('2d')
        this.c.width = this.width * config.size
        this.c.height = this.height * config.size

        this.tileArray = []
        var i = 0, k = 0
        for (k = 0; k < this.width; k++) {
            this.tileArray[k] = []
            for (i = 0; i < this.height; i++) {
                this.tileArray[k].push(0)
            }
        }

        this.textures = {}
        this.textureLookup = []
    }
    render() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height)
        var x = 0, y = 0;
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                if (this.tileArray[x][y] == 1) {
                    this.ctx.fillStyle = 'rgb(255,255,255)'
                } else if (this.tileArray[x][y] == 2) {
                    this.ctx.fillStyle = 'rgb(255,0,0)'
                } else {
                    this.ctx.fillStyle = 'rgb(0,0,0)'
                }
                //console.log(x+' ,'+y)
                //console.log(this.size)
                this.ctx.fillRect(x * this.size, y * this.size, this.size, this.size)
            }
        }
    }
    setTile(x = 0, y = 0, value = 0) {
        if (typeof value == 'number' && value < 3 && value >= 0 && x < this.width && x >= 0 && y < this.width && y >= 0) {
            this.tileArray[x][y] = value
            return value
        } else {
            return false
        }
    }
    clear() {
        this.tileArray = [];
        var i = 0, k = 0
        for (k = 0; k < this.width; k++) {
            this.tileArray[k] = []
            for (i = 0; i < this.height; i++) {
                this.tileArray[k].push(0)
            }
        }    
    }
    loadTexture(name,url,width,height) {
        var img = new Image(width,height)
        img.src = url
        img.onload = (e) => {
            texture = this.Texture(img,name)
            this.textures[name] = texture
            console.log('texture loaded as '+name)
            return texture
        }
    }
    applyTexture(name, tilenum) {
        this.textures[name].apply(tilenum)
    }
    Texture(img,name) {
        return {
            sourceImg: img,
            name: name,
            apply(tilenum) {
                this.textureLookup[tilenum] = this.name
            }
        }
    }
}