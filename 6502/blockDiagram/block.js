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
        this.will_explode = false;
        this.number = 42;
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

        //Setting up Style info
        this.style = {
            container: {
                width: 0,
                position: 'fixed',
                zIndex: 1,
                top: 0,
                right: 0,
                backgroundColor: '#111',
                overflowX: 'hidden',
                transition: '0.5s',
                paddingTop: '60px',
            },
            closebutton: {
                float: 'right',
                fontSize: '36px',
                marginRight: '8px',
                padding: 0,
                color: '#818181',
            },
            orderedList: {
                margin: '0px 8px 0px 8px',
                padding: 0,
            },
            p: {
                margin: '0px 0px 0px 2px',
                textDecoration: 'none',
                color: '#818181',
                fontSize: '12px',
            },
            textarea: {
                margin: '0px',
                textDecoration: 'none',
                fontSize: '10px',
                outline: 'none',
                resize: 'none',
                color: '#818181',
                borderColor: '#505050',
            },
            checkbox: {
                backgroundColor: 'transparent',
                outline: 'none',
                borderWidth: '2px',
                borderStyle: "solid",
                borderColor: '#505050',
                borderRadius: '3px',
                padding: '7px 7px',
                margin: '0px'
            }
        }

        //Adding container DIV
        this.containerElement = document.createElement('div');
        this.containerElement.className = 'gui'
        SidebarUI.applyStyle(this.containerElement, this.style.container)

        //Create close button
        var a = document.createElement('a');
        a.href = 'javascript:void(0)'; //Makes it so you don't reload the page when clicked
        a.innerHTML = '&times;';       // X char- renders as × in this font
        a.onclick = this.close.bind(this); 
        a.className = 'sidebarui-closebtn';
        this.containerElement.appendChild(a); //Add it to container
        SidebarUI.applyStyle(a, this.style.closebutton); //Styling

        //Adding container element to document
        containerElement.appendChild(this.containerElement)

        //Assorted Vars
        this.elements = []; //DOM elements being displayed; makes for easy deletion
        this.editingIndex = null; //The index of the block currently being edited in the GUI

        //Property Setup
        this.supportedProperties = {
            state: 'closed',
            sidebarWidth: '300px',
            minTextareaRows: 1,
            maxTextareaRows: 20,
            blockProperties: {
                name: {type: 'string'}, 
                connections: {type: 'array',values: ['boolean']}, 
                will_explode: {type: 'boolean'},
                number: {type: 'number'}
            }
        }

        //Applying Properties
        for (var property in this.supportedProperties) {
            if (config[property]) {
                this[property] = config[property]
            } else {
                this[property] = this.supportedProperties[property]
            }
        }
    }
    open(blocks, setterCallback) {
        this.setterCallback = setterCallback;

        for (var value in this.blockProperties) {
            console.log()
            this.addInputElement(this.cleanProperty(value), blocks[this.editingIndex][value], this.containerElement)
        }

        this.containerElement.style.width = this.sidebarWidth;
        setterCallback('state', 2);
    }
    close() {
        this.containerElement.style.width = "0";
        setTimeout(this.finishClose.bind(this),500)
    }
    finishClose() {
        this.clearInputElements()

        this.state = 1
        this.setterCallback('state',1)
    }
    addInputElement(name = '', value, containerElement) {
        console.log(value)
        var nameElement = document.createElement('p');
        nameElement.appendChild(document.createTextNode(name));
        SidebarUI.applyStyle(nameElement,this.style.p)
        this.elements.push(nameElement) //Keep track of element to manipulate/delete

        if (!Array.isArray(value)) {
            value = [value]
        }
        var inputElement = document.createElement('ol');
        SidebarUI.applyStyle(inputElement, this.style.orderedList)
        var i = 0
        for (var thing in value) {
            var item = value[thing]
            i++
            var typeval = typeof item
            console.log(typeval)
            console.log(typeof item)
            if (typeval == 'boolean') {

                var inputlistitem = document.createElement('button');
                inputlistitem.addEventListener('click',function (e){
                    console.log(e.target.getAttribute('checkbox-true'))
                    if (e.target.getAttribute('checkbox-true') == '') {
                        e.target.style.backgroundColor = '#111'
                        e.target.removeAttribute('checkbox-true')
                        this.setterCallback(name,false)
                    } else {
                        e.target.style.backgroundColor = '#505050'
                        e.target.setAttribute('checkbox-true','')
                        this.setterCallback(name,true)
                    }
                }.bind(this))

                SidebarUI.applyStyle(inputlistitem,this.style.checkbox)

            } else if (typeval == 'number' || typeval == 'string') {

                var inputlistitem = document.createElement('textarea');

                inputlistitem.innerText = item;
                inputlistitem.addEventListener('input',function(e){
                    console.log(e.target)
                }.bind(this))

                inputlistitem.rows = 1;
                if (inputlistitem.scrollHeight / 12 > inputlistitem.rows) {
                    inputlistitem.rows = inputlistitem.scrollHeight / 12
                }

                SidebarUI.applyStyle(inputlistitem, this.style.textarea)

            } else if (Array.isArray(item)) {

                var inputlistitem = document.createElement('div')

                for (var value of item) {
                    this.addInputElement(value, blocks[this.editingIndex][value], inputlistitem)
                }

            }
            inputlistitem.className = name;
            inputlistitem.setAttribute('index', i.toString(10));
            inputElement.appendChild(inputlistitem)
        }

        this.elements.push(inputElement) //Keep track of element to manipulate/delete


        containerElement.appendChild(nameElement)
        containerElement.appendChild(inputElement)
    }
    clearInputElements() {
        for (var i = 0; i < this.elements.length; i++) {
            this.containerElement.removeChild(this.elements[i])
        }
        this.elements = [];
    }
    cleanProperty(property = '') {
        var result = []
        for (var i=0;i<property.length;i++) {
            if (property[i] == '_') {
                result[i] = ' '
            } else {
                result[i] = property[i]
            }
        }
        return result.join('')
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
                backgroundColor: 'transparent',
                zIndex: -1
            },
            blocks: {
                textColor: "rgb(200,200,200)",
                blockColor: "rgb(20,20,20)"
            }
        }

        //Canvas Config
        this.c = document.createElement('canvas')
        SidebarUI.applyStyle(this.c, this.style.canvas)                     //style
        this.c.addEventListener('contextmenu', e => { e.preventDefault() }) //Prevent right clicks from opening menu
        this.containerElement.appendChild(this.c)                           //adding it to the doc
        this.ctx = this.c.getContext('2d')
        this.resize();

        //Event Listener Setup
        this.containerElement.addEventListener('resize', this.resize.bind(this))
        this.containerElement.addEventListener('mousemove', this.mouseMove.bind(this))
        this.containerElement.addEventListener('mousedown', this.mouseClick.bind(this))
        //this.containerElement.addEventListener('input', this.getInput.bind(this))
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

            if (this.state == 2) { //Editing Existing Block
                if (collisions.length == 1) {
                    this.sidebar.clearInputElements()
                    this.sidebar.editingIndex = collisions[0]
                    this.sidebar.open(this.blocks, this.setterCallback.bind(this));
                }
            } else if (this.state == 0) { //Creating Block
                this.cwb = {};
                this.state = 1;
            } else {
                if (collisions.length == 1) {
                    this.state = 2;
                    this.sidebar.editingIndex = collisions[0];
                    this.sidebar.open(this.blocks, this.setterCallback.bind(this));
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
        console.log('setting this.'+property+' to '+value+'.')
        this[property] = value
    }
}
var t = new BlockDiagram(document.body)