'use strict';
//var definitions
var canvas = document.getElementById('dotcanvas');
var ctx = canvas.getContext("2d");
var mouse = { x: 0, y: 0, rightClick: false, leftClick: false, };
var blocks = [];
var cwb = {};// current working block
var state = 0 
/*STATE TABLE:
-1: Invisible but otherwise same as state 1
 0: Being Created.
 1: Stable. 
 2: Being Edited
 3: Being Deleted
*/
var gui = {
    visible: false,
}
var config = {
    textColor: "rgb(200,200,200)",
    blockColor: "rgb(20,20,20)",
}

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
    render()
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
        if (detectBlockCollision(mouse.x, mouse.y).length == 1) {
            
        }
    } else if (e.button == 2) {
        if (state == 0) {
            state = 1;
            createNewBlock(mouse.x, mouse.y);
        } else if (state == 1) {
            finishNewBlock(mouse.x, mouse.y);
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
    if (detectBlockCollision(x,y).length == 0) {
        blocks.push(new Block(cwb.x1, cwb.y1, x, y))
        state = 0;
    } else {
        console.log(detectBlockCollision(x, y))
        console.error("Cannot create blocks inside blocks.")
    }
}
function createNewBlock(x, y) {
    //generates a new block
    if (detectBlockCollision(x, y).length == 0) {
        cwb = new Block(x, y, false, false, 0)
        startRenderLoop();
    } else {
        console.log(detectBlockCollision(x, y))
        console.error("Cannot create blocks inside blocks.")
    }
}
function render() {
    //Renders the screen

    //draw current working block
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (state == 1) {
        //draw block
        ctx.fillStyle = config.blockColor
        ctx.fillRect(cwb.x1, cwb.y1, cwb.width, cwb.height)
        //draw block name
        ctx.fillStyle = config.textColor
        ctx.fillText(
            cwb.name,
            cwb.x1 + cwb.width / 2 - (ctx.measureText(cwb.name).width / 2),
            cwb.y1 + (cwb.height / 2)
        )
    }

    //draw all other blocks
    for (var i = 0; i < blocks.length; i++) {
        //draw the block
        ctx.fillStyle = config.blockColor
        ctx.fillRect(blocks[i].x1, blocks[i].y1, blocks[i].width, blocks[i].height)

        //draw the block's name
        ctx.fillStyle = config.textColor
        ctx.fillText(
            blocks[i].name,
            blocks[i].x1 + (blocks[i].width / 2) - (ctx.measureText(blocks[i].name).width / 2),
            //X-pos of block + offset to get the x of the text center - 1/2 of text's length to get the text centered
            blocks[i].y1 + (blocks[i].height / 2)
        )

        //draw connection labels (not implemented)
    }
    
    //draw connections (not implemented)



    if (!state == 0) {
        requestAnimationFrame(render)
    }
}
function detectBlockCollision(x, y) {
    //checks if a given point intersects with any block and returns a list of indexes of all the blocks it collides with.
    var outArray = []
    for (var i = 0; i < blocks.length; i++) {
        if (x > blocks[i].x1 && x < blocks[i].x2 && y > blocks[i].y1 && y < blocks[i].y2) {
            outArray.push(i)
            console.log('collision')
        }
    }
    return outArray
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
        if (this.state == 0) {
            return mouse.x - this.x1
        } else {
            return this.x2 - this.x1
        }
    }
    set width(value) {
        this.x2 = this.x1 + value
    }

    get height() {
        if (this.state == 0) {
            return mouse.y - this.y1
        } else {
            return this.y2 - this.y1
        }
    }
    set height(value) {
        this.y2 = this.y1 + value
    }
}

class GUI {
    constructor(
        x = 0,
        y = 0,
        x2 = 0,
        y2 = 0,
        state = 1,
        name = 'GUI',
        elements = {
            delete: {name: 'Delete Block', type: 'bool'},
            name: {name: 'New Block', type: 'text'}
        },
    ) {
        this.state = state
        this.x1 = x
        this.y1 = y
        this.x2 = x2
        this.y2 = y2
        this.name = name
        this.elements = elements;
        this.visible = false
    }
    get width() {return this.x2 - this.x1}
    set width(value) {this.x2 = this.x1 + value}
    get height() {return this.y2 - this.y1}
    set height(value) {this.y2 = this.y1 + value}
    
}