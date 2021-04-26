//class definitions
class Block {
    constructor(
        x = 0,
        y = 0,
        x2 = 0,
        y2 = 0,
        state = 1,
        name = 'New Block',
        connections = [false, false, false],
    ) {
        this.state = state
        this.x1 = x
        this.y1 = y
        this.x2 = x2
        this.y2 = y2
        this.name = name
        this.connections = connections;
        //this.will_explode = false;
        //this.number = 42;
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
class BlockDiagram {
    constructor(element, config = {}) {
        //General Init
        this.containerElement = element;
        this.state = 1; //0 = creating block, 1 = stable, 1.5 = moving editor, 2 = editing block, 3 = deleting block
        this.blocks = [];
        this.mouse = {
            x: 0,
            y: 0,
        }
        this.style = {
            /*canvas: {
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: 'grey',
                zIndex: -1
            },*/
            blocks: {
                textColor: "rgb(200,200,200)",
                blockColor: "rgb(20,20,20)"
            },/*
            sidebar: {
                container: {
                    width: 0,
                    position: 'fixed',
                    zIndex: 1,
                    top: 0,
                    right: 0,
                    backgroundColor: '#111',
                    overflow: 'hidden',
                    transition: '0.5s',
                    paddingTop: '60px',
                    textDecoration: 'none',
                    color: '#818181',
                    fontSize: '12px',
                },
                closebutton: {
                    float: 'right',
                    fontSize: '36px',
                    marginRight: '8px',
                    padding: 0,
                    color: '#818181',
                },
            }*/
        }
        this.editingIndex = false;

        //CANVAS CONFIG
        this.c = document.createElement('canvas')
        //applyStyle(this.c, this.style.canvas)                     //style
        this.c.addEventListener('contextmenu', e => { e.preventDefault() }) //Prevent right clicks from opening menu
        this.containerElement.appendChild(this.c)                           //adding it to the doc
        this.ctx = this.c.getContext('2d')
        this.resize();



        //SIDEBAR CONFIG
        this.sidebar = {
            element: null,//Containing HTML element
            onClose: function () {
                this.sidebar.element.style.width = "0";
                this.sidebar.viewer.remove();
                this.sidebar.viewer = null;
            }.bind(this),
            open: function () {
                if (this.sidebar.viewer) {
                    this.sidebar.viewer.remove();
                    this.sidebar.viewer = null;
                }
                this.sidebar.viewer = new EditableObject(this.sidebar.element, this.blocks[this.editingIndex], this.sidebar.setCallback);
                this.sidebar.element.style.width = this.sidebar.width;
            }.bind(this),
            setCallback: function (v) {
                this.blocks[this.editingIndex] = v.target.value;
                this.render(); //Update the
            }.bind(this),
            viewer: null,
            width: '300px'
        }
        //Sidebar Container Div
        this.sidebar.element = document.createElement('div'); //It's just a div with some special style
        this.sidebar.element.className = 'sidebar';
        //applyStyle(this.sidebar.element, this.style.sidebar.container);
        this.containerElement.appendChild(this.sidebar.element);

        //Close button
        var a = document.createElement('a');
        a.href = 'javascript:void(0)';  //Makes it so you don't reload the page when clicked
        a.innerHTML = '&times;';        // X char- renders as × in this font
        a.onclick = this.sidebar.onClose.bind(this);
        a.className = 'sidebarui-closebtn';
        this.sidebar.element.appendChild(a);   //Add it to container
        //applyStyle(a, this.style.closebutton); //Styling





        //EVENT LISTENER SETUP
        window.addEventListener("resize", this.resize.bind(this))
        this.containerElement.addEventListener('mousemove', this.mouseMove.bind(this))
        this.containerElement.addEventListener('mousedown', this.mouseClick.bind(this))
        //this.containerElement.addEventListener('input', this.getInput.bind(this))
    }
    resize() {
        //resize handler
        this.c.width = window.innerWidth;
        /*if (document.body.scrollHeight > window.innerHeight) {
            this.c.height = document.body.scrollHeight;
        } else {*/
            this.c.height = window.innerHeight;
        //};
        this.render();
    }
    render() {
        //Renders the screen

        //draw current working block
        this.ctx.clearRect(0, 0, this.c.width, this.c.height)
        if (this.state == 0) {
            //draw block
            var cwb = {
                width: this.mouse.x - this.cwb.x1,
                height: this.mouse.y - this.cwb.y1
            }
            this.ctx.fillStyle = this.style.blocks.blockColor
            this.ctx.fillRect(this.cwb.x1, this.cwb.y1, cwb.width, cwb.height)
            //draw block name
            this.ctx.fillStyle = this.style.blocks.textColor
            this.ctx.fillText(
                this.cwb.name,
                this.cwb.x1 + cwb.width / 2 - (this.ctx.measureText(this.cwb.name).width / 2),
                this.cwb.y1 + (cwb.height / 2)
            )
        }

        //draw all other blocks
        for (var i = 0; i < this.blocks.length; i++) {
            //draw the block
            this.ctx.fillStyle = this.style.blocks.blockColor
            this.ctx.fillRect(this.blocks[i].x1, this.blocks[i].y1, this.blocks[i].width, this.blocks[i].height)

            //draw the block's name
            this.ctx.fillStyle = this.style.blocks.textColor
            this.ctx.fillText(
                this.blocks[i].name,
                this.blocks[i].x1 + (this.blocks[i].width / 2) - (this.ctx.measureText(this.blocks[i].name).width / 2),
                //X-pos of block + offset to get the x of the text center - 1/2 of text's length to get the text centered
                this.blocks[i].y1 + (this.blocks[i].height / 2)
            )

            //draw connection labels (not implemented)
        }
        //draw connections (not implemented)

        if (this.state == 0) {
            requestAnimationFrame(this.render.bind(this))
        }
    }
    mouseMove(e) {
        //mouse move handler
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    mouseClick(e) {
        //mouse click handler
        var collisions = this.detectBlockCollision(this.mouse.x, this.mouse.y)

        console.log(e.button)
        if (e.button == 0) {
            
            //Left Click
            switch (this.state) {
                case 0: // Clicking while making a block cancels it
                    this.cwb = {};
                    this.state = 1;
                    break;
                case 1: // If you click on something, open the editor
                    if (collisions.length == 1) {
                        this.state = 2;
                        this.editingIndex = collisions[0];
                        this.sidebar.open();//this.blocks, this.setterCallback.bind(this));
                        this.render()
                    } else if (collisions.length == 0) {
                        //Clicked on background; sliding editor
                        //this.state = 1.5;
                    }
                    break;
                case 2:
                    if (collisions.length == 1) {
                        this.editingIndex = collisions[0]
                        this.sidebar.open();
                    }
                    break;
            }
        }else if (e.button == 1) {
            //Middle click; 

        } else if (e.button == 2) {
            
            //Right Click
            switch (this.state) {
                case 0: //If Making a block, finish it.
                    this.makeNewBlock(this.mouse.x, this.mouse.y);
                    break;
                case 1: //If not doing anything, start new block
                    if (collisions.length == 0) {
                        this.startNewBlock(this.mouse.x, this.mouse.y);
                    }
                    break;

                case 2: //If editing a block, close the editor and start the new block
                    this.sidebar.onClose();
                    this.startNewBlock(this.mouse.x, this.mouse.y);
                    break;
            }
        }
    }
    /*getInput(e) {
        if (this.state == 2) {
            var tagname = e.target.tagName.toLowerCase();
            if (tagname == 'textarea') {
                //Auto Expand
                e.target.rows = 1;
                if (e.target.scrollHeight / 12 > e.target.rows) {
                    e.target.rows = e.target.scrollHeight / 12
                }
                console.log(this.sidebar.isValid(e.target.value))
                this.blocks[this.sidebar.editingIndex][e.target.className] = e.target.value
                this.render();
                
            }
        }
    }*/
    detectBlockCollision(x, y) {
        //checks if a given point intersects with any block and returns a list of indexes of all the blocks it collides with.
        var outArray = []
        for (var i = 0; i < this.blocks.length; i++) {
            if (x > this.blocks[i].x1 && x < this.blocks[i].x2 && y > this.blocks[i].y1 && y < this.blocks[i].y2) {
                outArray.push(i)
            }
        }
        return outArray
    }
    startNewBlock(x, y) {
        this.state = 0;
        this.cwb = new Block(x, y, false, false, 0)
        this.render.bind(this)();
    }
    makeNewBlock(x, y) {
        if (this.detectBlockCollision(x, y).length == 0) {
            this.blocks.push(new Block(this.cwb.x1, this.cwb.y1, x, y))
            this.state = 1;
        } else {
            console.log(detectBlockCollision(x, y))
            console.warn("Cannot create blocks inside blocks.")
        }
    }
    setterCallback(property, value) {
        console.log('setting this.' + property + ' to ' + value + '.')
        this[property] = value
    }
}
function applyStyle(element, style) {
    for (var s in style) {
        element.style[s] = style[s]
    }
}
var t = new BlockDiagram(document.getElementById('blockDiagram'))

