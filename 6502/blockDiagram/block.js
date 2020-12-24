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
class SidebarUI {
    constructor(containerElement, config = {}) {
        this.containerElement = document.createElement('div');

        var a = document.createElement('a')
        a.href = 'javascript:void(0)'
        a.innerHTML = '&times;'
        a.onclick = this.close;
        a.className = 'sidebarui-closebtn'
        this.containerElement.appendChild(a)

        this.containerStyle = {
            width: 0,
            position: 'fixed',
            zIndex: 1,
            top: 0,
            right: 0,
            backgroundColor: '#111',
            overflowX: 'hidden',
            paddingTop: '60px',
            transition: '0.5s',
        }
        SidebarUI.applyStyle(this.containerElement, this.containerStyle)
        this.containerElement.className = 'gui'
        containerElement.appendChild(this.containerElement)

        this.supportedProperties = {
            state: 'closed',
            sidebarWidth: '300px',
            minTextareaRows: 1,
            maxTextareaRows: 20,
        }
        for (var property in this.supportedProperties) {
            if (config[property]) {
                this[property] = config[property]
            } else {
                this[property] = this.supportedProperties[property]
            }
        }
        this.editingIndex = null;
    }
    open() {
        this.addInputElement('name', blocks[this.editingIndex].name)
        this.htmlElement.style.width = this.maxWidth;
        document.getElementById('all').style.marginRight = this.maxWidth;
        state = 2
    }
    close() {
        this.clearInputElements();
        this.htmlElement.style.width = "0";
        document.getElementById('all').style.marginRight = '0';
        state = 1
    }
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
    }
    clearInputElements() {
        for (var i = 0; i < this.elements.length; i++) {
            this.htmlElement.removeChild(this.elements[i])
        }
        this.elements = [];
    }
    static applyStyle(element, style) {
        for (var s in style) {
            element.style[s] = style[s]
        }
    }
}
class BlockDiagram {
    constructor(element, config = {}) {
        //General Init
        this.containerElement = element;
        this.sidebar = new SidebarUI(this.containerElement)
        this.state = 1; //0 = creating block, 1 = stable, 2 = editing block, 3 = deleting block
        this.blocks = [];
        this.mouse = {
            x: 0,
            y: 0,
        }
        this.style = {
            canvas: {
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: 'gray',
                zIndex: -1
            },
            blocks: {
                textColor: "rgb(200,200,200)",
                blockColor: "rgb(20,20,20)"
            }
        }

        //Canvas Config
        this.c = document.createElement('canvas')
        SidebarUI.applyStyle(this.c, this.style.canvas)
        this.c.addEventListener('contextmenu', e => { e.preventDefault() })
        this.containerElement.appendChild(this.c)
        this.ctx = this.c.getContext('2d')
        this.resize();

        //Event Listener Setup
        this.containerElement.addEventListener('resize', this.resize.bind(this))
        this.containerElement.addEventListener('mousemove', this.mouseMove.bind(this))
        this.containerElement.addEventListener('mousedown', this.mouseClick.bind(this))
        this.containerElement.addEventListener('input', this.getInput.bind(this))
    }
    resize() {
        //resize handler
        this.c.width = window.innerWidth;
        if (document.body.scrollHeight > window.innerHeight) {
            this.c.height = document.body.scrollHeight;
        } else {
            this.c.height = window.innerHeight;
        };
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
        if (e.button == 0) {

            if (this.state == 2) {
                if (collisions.length == 1) {
                    this.sidebar.clearInputElements()
                    this.sidebar.editingIndex = collisions[0]
                    this.sidebar.open();
                }
            } else if (this.state == 0) {
                this.cwb = {};
                this.state = 1;
            } else {
                if (collisions.length == 1) {
                    this.state = 2;
                    this.sidebar.editingIndex = collisions[0];
                    this.sidebar.open();
                    this.render()
                }
            }

        } else if (e.button == 2) {
            if (this.state == 1) {
                if (collisions.length == 0) {
                    this.startNewBlock(this.mouse.x, this.mouse.y);
                }
            } else if (this.state == 0) {
                this.makeNewBlock(this.mouse.x, this.mouse.y);
            } else if (this.state == 2) {
                this.sidebar.close();
                this.startNewBlock(this.mouse.x, this.mouse.y);
            }
        }
    }
    getInput(e) {
        if (this.state == 2) {
            var tagname = e.target.tagName.toLowerCase();
            if (tagname == 'textarea') {
                //Auto Expand
                e.target.rows = 1;
                if (e.target.scrollHeight / 12 > e.target.rows) {
                    e.target.rows = e.target.scrollHeight / 12
                }
                blocks[ui.editingIndex][e.target.id] = e.target.value
                render();
            }
        }
    }
    detectBlockCollision(x, y) {
        //checks if a given point intersects with any block and returns a list of indexes of all the blocks it collides with.
        var outArray = []
        for (var i = 0; i < this.blocks.length; i++) {
            if (x > this.blocks[i].x1 && x < this.blocks[i].x2 && y > this.blocks[i].y1 && y < this.blocks[i].y2) {
                outArray.push(i)
                console.log('collision')
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
}
var t = new BlockDiagram(document.body)