'use strict';
//var definitions
var canvas = document.getElementById('dotcanvas');
var ctx = canvas.getContext("2d");
var mouse = { x: 0, y: 0, rightClick: false, leftClick: false, };
var blocks = [];
var cwb = {};// current working block
var state = 0 

//configing
resize()
window.onresize = resize;
window.onmousemove = mouseMove;
window.onmousedown = mouseClick;
window.onmouseup = mouseUnclick;

//function defininitions
function resize() {
    //resize handler
    canvas.width = window.innerWidth;
    if (document.body.scrollHeight > window.innerHeight) {
        canvas.height = document.body.scrollHeight;
    } else {
        canvas.height = window.innerHeight;
    };
}
function mouseMove(e) {
    //mouse move handler
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}
function mouseClick(e) {
    //mouse click handler
    console.log('click')
    if (e.button == 0) {
        mouse.leftClick = true;
    } else if (e.button == 2) {
        if (state == 0) {
            state = 1;
            createNewBlock(mouse.x, mouse.y);
        } else if (state == 1) {
            finishNewBlock(mouse.x, mouse.y);
            state = 0;
        }
    }
}
function mouseUnclick(e) {
    // mouse up handler
    if (e.button === 0) {
        mouse.leftClick = false;
    } else if (e.button === 2) {
        mouse.rightClick = false;
    }
}
function finishNewBlock(x, y) {
    blocks.push(new Block(cwb.x1, cwb.y1, x, y))
}
function createNewBlock(x, y) {
    //generates a new block
    cwb = new Block(x, y, false, false, 0)
    startRenderLoop();
}
function render() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (state == 1) {
        ctx.fillStyle = 'rgb(20,20,20)'
        ctx.fillRect(cwb.x1, cwb.y1, mouse.x-cwb.x1, mouse.y-cwb.y1)
        ctx.fillStyle ='rgb(80,80,80)';
        ctx.fillText(cwb.name,cwb.x1,cwb.y1)
    }
    for (var i = 0; i < blocks.length; i++) {
        ctx.fillStyle = 'rgb(20,20,20)'
        ctx.fillRect(blocks[i].x1, blocks[i].y1, blocks[i].width, blocks[i].height)
        ctx.fillStyle ='rgb(80,80,80)';
        ctx.fillText(blocks[i].name,blocks[i].x1,blocks[i].y1)
    }
    if (!state == 0) {
        requestAnimationFrame(render)
    }
}
function startRenderLoop() {
    render();
}
class Block {
    constructor(
        x = 0,
        y = 0,
        x2 = 0,
        y2 = 0,
        state = 1,
        name = 'New Block',
        connections = [],
    ) {
        this.state = state
        this.x1 = x
        this.y1 = y
        this.x2 = x2
        this.y2 = y2
        this.name = name
        this.connections = connections;
    }
    get width() {
        return this.x2 - this.x1
    }
    set width(value) {
        this.x2 = this.x1 + value
    }

    get height() {
        return this.y2 - this.y1
    }
    set height(value) {
        this.y2 = this.y1 + value
    }
}