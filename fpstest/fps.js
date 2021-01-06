class Vector {
    constructor(x=0,y=0,v=0) {
        this.x = x;
        this.y = y;
        this.v = v;
    }
    static fromAngle(a,v) {
        return new Vector(cos(a),sin(a),v)
    }
}
class Game {
    constructor(element) {
        this.canvas = document.createElement('canvas')
        element.appendChild(this.canvas)
        this.resolution = 10;
        this.player = {
            x:0,
            y:0,
            a:0,
            FOV: this.toRad(90),
        };
        window.onload = this.init.bind(this)
        window.onresize = this.resize.bind(this)
        this.resize.bind(this)();
    }
    init() {
        this.ctx = this.canvas.getContext('2d');
        this.main.bind(this)();
    }
    main(){
        this.render();
        window.requestAnimationFrame(this.main.bind(this))
    }
    render() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.fillStyle = '#000000'
        for (var i=0;i<this.resolution;i++) {
            var length = 100;
            var x = this.player.x;
            var y = this.player.y;
            var a = this.player.a - this.player.FOV/2
            while(length > 0 && !collision(x,y)) {
                
            }
            this.ctx.fillRect(i*this.width,this.canvas.height*(1-(length/100))/2,this.width,this.canvas.height*(length/100))
        }
    }
    collision() {

    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = Math.round(this.canvas.width/this.resolution);
    }
    toRad(val) {
        return val*Math.PI/180
    }
    toDeg(val) {
        return val * 180 / Math.PI
    }
}
var game = new Game(document.getElementById('gameContainer'))