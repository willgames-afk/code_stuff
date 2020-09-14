class W_0Simulator {
    constructor(element){
        this.canvas = document.createElement('canvas')
        element.appendChild(this.canvas)
        this.canvas.width = 100
    }
}

thing = new W_0Simulator(document.getElementsByClassName('widget')[0])