//create canvas and a rendering context to draw stuff with


class Tilemap {
    constructor(width, height, size, canvasid) {

        this.width = width
        this.height = height
        this.size = size

        this.c = document.getElementById(canvasid)
        this.ctx = this.c.getContext('2d')
        this.c.width = this.width * size
        this.c.height = this.height * size

        this.tileArray = []
        var i = 0, k = 0, column = []
        for (k = 0; k < width; k++) {
            for (i = 0; i < height; i++) {
                column[i] = 0
            }
            this.tileArray.push(column)
        }
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
                console.log(x+' ,'+y)
                console.log(this.size)
                this.ctx.fillRect(x * this.size, y * this.size, this.size, this.size)
            }
        }
    }
    setTile(x, y, value) {
        if (value && typeof value == 'number' && value < 3 && value > -1) {
            this.tileArray[x][y] = value
            return value
        } else {
            return false
        }
    }
}
class Snake {
    constructor(x, y, dir, len) {
        this.direction = dir
        this.x = x
        this.y = y
        this.length = len
        this.bodySegments = []
        var i = 0
        for (i = 0; i < len; i++) {
            this.bodySegments.push({ x: x, y: y })
        }
    }
    move() {
        if (this.direction == 0) {
            this.bodySegments.unshift({ x: this.x, y: this.y + 1 });
        } else if (this.direction == 1) {
            this.bodySegments.unshift({ x: this.x + 1, y: this.y });
        } else if (this.direction == 2) {
            this.bodySegments.unshift({ x: this.x, y: this.y - 1 });
        } else if (this.direction == 3) {
            this.bodySegments.unshift({ x: this.x - 1, y: this.y });
        } else {
            return false;
        }
        this.bodySegments.pop();
        return true
    }
    setDirection(dir) {
        if (dir && typeof dir == 'number' && dir < 4 && dir > -1) {
            this.direction = dir
        } else {
            console.error('Direction must be a number less than 4 and greater than -1')
            return false
        }
        return true
    }
    applyToTilemap(tilemap) {
        var i=0
        for (i=0;i<this.bodySegments.length;i++) {
            tilemap.setTile(this.bodySegments[i].x,this.bodySegments[i].y, 1)
        }
    }
}

var tilemap = new Tilemap(21, 21, 10, 'snakeCanvas')
var snake = new Snake(11, 11, 0, 5)
//var interval = window.setInterval(loop,1000)
console.log(snake.bodySegments)

function loop() {
    snake.move()
    snake.applyToTilemap(tilemap)

    tilemap.render()
}
function handleKeyboard(e) {
    if (e.key == 'w') {
        snake.setDirection(0)
    } else if (e.key == 'd') {
        snake.setDirection(1)
    } else if (e.key == 's') {
        snake.setDirection(2)
    } else if (e.key == 'a') {
        snake.setDirection(3)
    }
}