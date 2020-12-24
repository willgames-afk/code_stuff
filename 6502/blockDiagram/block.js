//class definitions
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

var ui = {
    open() {
        this.addInputElement('name', blocks[this.editingIndex].name)
        this.htmlElement.style.width = this.maxWidth;
        document.getElementById('all').style.marginRight = this.maxWidth;
        state = 2
    },
    close() {
        this.clearInputElements();
        this.htmlElement.style.width = "0";
        document.getElementById('all').style.marginRight = '0';
        state = 1
    },
    addInputElement(name = '', value) {
        if (!name || !value) {
            console.error('addInputElement reqires name and value inputs')
            return false
        }
        var nameElement = document.createElement('p');
        nameElement.appendChild(document.createTextNode(name));
        var inputElement = document.createElement('textarea');
        inputElement.appendChild(document.createTextNode(value))
        inputElement.id = 'name'
        this.elements.push(nameElement)
        this.elements.push(inputElement)


        this.htmlElement.appendChild(nameElement)
        this.htmlElement.appendChild(inputElement)
        autoExpand(inputElement)
    },
    clearInputElements() {
        for (var i = 0; i < this.elements.length; i++) {
            this.htmlElement.removeChild(this.elements[i])
        }
        this.elements = [];
    },
    state: 'closed',
    maxWidth: '300px',
    maxTextareaHeight: 1000,
    elements: [],
    htmlElement: document.getElementById('gui-side'),
    editingIndex: null,
}
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
var config = {
    textColor: "rgb(200,200,200)",
    blockColor: "rgb(20,20,20)",
}
//configing
resize()
window.onresize = resize;
document.addEventListener('mousemove', mouseMove)
document.addEventListener('mousedown', mouseClick)
document.addEventListener('mouseup', mouseUnclick)
document.addEventListener('input', checkInputs, false)
//function defininitions
function checkInputs(e) {
    if (state == 2) {
        var tagname = e.target.tagName.toLowerCase();
        if (tagname == 'textarea') {
            autoExpand(e.target, ui.maxTextareaHeight);
            blocks[ui.editingIndex][e.target.id] = e.target.value
            render();
        }
    }
}
function autoExpand(field) {
    field.rows = 1;
    if (field.scrollHeight / 12 > field.rows) {
        field.rows = field.scrollHeight / 12
    }
}
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
    console.log(state)
    if (e.button == 0) {
        var collisions = detectBlockCollision(mouse.x, mouse.y)
        if (collisions.length == 1) {
            if (state == 2) {
                ui.clearInputElements()
                ui.editingIndex = collisions[0]
                ui.open();
            } else {
                state = 2
                ui.editingIndex = collisions[0]
                ui.open();
                render()
            }
        }
    } else if (e.button == 2) {
        if (state == 1) {
            if (detectBlockCollision(x,y).length == 0) {
                createNewBlock(mouse.x, mouse.y);
            }
        } else if (state == 0) {
            finishNewBlock(mouse.x, mouse.y);
        } else if (state == 2) {
            ui.close();
            createNewBlock(mouse.x, mouse.y);
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
    if (detectBlockCollision(x, y).length == 0) {
        blocks.push(new Block(cwb.x1, cwb.y1, x, y))
        state = 1;
    } else {
        console.log(detectBlockCollision(x, y))
        console.error("Cannot create blocks inside blocks.")
    }
}
function createNewBlock(x, y) {
    //generates a new block
    state = 0;
    cwb = new Block(x, y, false, false, 0)
    startRenderLoop();
    
}
function render() {
    //Renders the screen

    //draw current working block
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (state == 0) {
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


    if (state == 0) {
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
state = 1;