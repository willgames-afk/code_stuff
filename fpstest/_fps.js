class Game {
    constructor(element) {
        this.canvas = document.createElement('canvas')
        element.appendChild(this.canvas)
        window.onload = this.init.bind(this)
        window.onresize = this.resize.bind(this)
        this.resize.bind(this)();
    }
    init() {
        this.gl = this.canvas.getContext('webgl');
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.main.bind(this);
    }
    main(){
        this.render();
        window.requestAnimationFrame(this.main.bind(this))
    }
    render() {
    }
    resize() {
        console.log('resize')
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}