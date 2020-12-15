class Simulator {
    constructor(element) {

        //CREATE UI
        //create canvas and rendering context; used to render LCD
        this.canvas = document.createElement('canvas');
        element.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        element.appendChild(document.createElement('br'))

        //create input button for 6502 executable
        this.fileInput = document.createElement('input')
        this.fileInput.type = "file";
        this.fileInput.addEventListener("change",this.loadProg.bind(this))
        element.appendChild(this.fileInput);

        //Setting up reset button- this is crucial for audio
        this.startButton = document.createElement('button');
        this.startButton.innerHTML = 'Reset';
        element.appendChild(this.startButton);


        //Grab assets and finish setting up canvas
        this.assets = Simulator.assets;
        this.charset = this.assets.chartable;
        this.canvas.width = this.assets.background.width * 0.90;
        this.canvas.height = this.assets.background.height * 0.90;

        //Create LCD simulator
        this.display = Simulator.LCD(this.canvas, this.assets);
        console.log('Successful Simulator Start!')
        //Create Memory
        this.memory = Simulator.Memory()

        //Set up internal registers
        this.regA = 0;
        this.regX = 0;
        this.regY = 0;
        this.regP = 0;
        this.regPC = 0x600;
        this.regSP = 0xff;

        //Start the simulation!
        this.render();
    }
    render() {
        this.display.render.bind(this)();
    }
    execute() {
        //Executes one instruction
    }
    loadProg() {
        var fileObj = new BinFile();
        fileObj.setSourceBlob(this.fileInput.files[0])//Only takes the first file you submit; Ignores others
    }

//STATIC METHODS
    static pad(string, padlen, padchar = " ", padfromright = false) {
        if (string.length >= padlen) return string;
        out = string;
        if (padfromright) {
            while (out.length < padlen) {
                out = out + padchar
            }
        } else {
            while (out.length < padlen) {
                out = padchar + out;
            }
        }
        return out;
    }
    static initSimulatorWidget(node) {
        return new Simulator(node)
    }
    static loadResources(completeLoadCallback) {
        var total = 0
        var toLoad = {
            imgs: [
                { name: 'background', src: "LCD.png" }
            ],
            json: [
                { name: 'chartable', src: "chartable.json" }
            ]
        }
        this.assets = {}
        var obj = {
            count: 0,
            expectedCount: (toLoad.imgs.length + toLoad.json.length),
            loadFinished: completeLoadCallback
        }

        function loadCallback() {
            /*Whenever an asset loads, this callback fires. The total number of assets
            are stored, so when all the assets are loaded we call a main callback to 
            initialize all the modules.*/
            this.count++
            if (this.count == this.expectedCount) {
                console.log('Load Complete!')
                this.loadFinished();
            }
        }

        for (var i = 0; i < toLoad.imgs.length; i++) {
            var img = new Image();
            this.assets[toLoad.imgs[i].name] = img;
            img.onload = loadCallback.bind(obj)
            img.src = "assets/" + toLoad.imgs[i].src
        }
        for (var i = 0; i < toLoad.json.length; i++) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', "assets/" + toLoad.json[i].src, true)
            xobj.onreadystatechange = (function (assets, toLoad, i, callback) {
                return function () {
                    if (xobj.readyState == 4 && xobj.status == "200") {
                        assets[toLoad.json[i].name] = JSON.parse(xobj.responseText);
                        callback();
                    }
                }
            })(this.assets, toLoad, i, loadCallback.bind(obj))
            xobj.send()
        }
    }
    static LCD(canvas, assets) {
        var lcd = {};
        lcd.canvas = canvas
        lcd.ctx = canvas.getContext('2d');
        lcd.canvas.width = assets.background.width * 0.90;
        lcd.canvas.height = assets.background.height * 0.90;
        lcd.ddram = [];
        for (i = 0; i < 128; i++) {
            lcd.ddram[i] = (' '.charCodeAt(0) - 1);//Display Initializes to spaces
        }
        lcd.cgram = new Array(64);
        lcd.rs = undefined; //True selects DDRAM/CGRAM, False indicates a command
        lcd.rw = undefined; //True means read, false means write
        lcd.bus = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

        lcd.on = false;
        lcd.showCursor = false;
        lcd.IncCursorPos = true;;//true for Increase, false for Decrease
        lcd.cursorBlink = false;
        lcd.DDramSelected = true;//true for DDRAM, false for CGRAM
        lcd.fullBus = true; //True for 8-bit bus, False for 4-bit bus
        lcd.twoLines = false; //True for 2 line mode, false for 1 line mode.
        lcd.bigFont = false; //True for 5x10 font, false for 5x7

        lcd.render = function () {
            var ps = 2, pd = 1, rows = 2, cols = 16, cwidth = 5, cheight = 8;
            lcd.ctx.drawImage(assets.background, 0, 0, lcd.canvas.width, lcd.canvas.height);
            lcd.ctx.fillStyle = "#000"
            var test = '';
            for (var cr = 0; cr < rows; cr++) {
                for (var cc = 0; cc < cols; cc++) {
                    for (var r = 0; r < cheight; r++) {
                        for (var c = 0; c < cwidth; c++) {
                            if ((r < 7) && (Simulator.pad(assets.chartable[lcd.ddram[(cr * 40) + cc]][r].toString(2), 5, '0', false)[c] == '1')) {
                                lcd.ctx.fillRect(50 + ((ps + pd) * 6) * cc + (ps + pd) * c, 60 + ((ps + pd) * 10) * cr + (ps + pd) * r, ps, ps)
                            }
                        }
                    }
                }
            }
        }.bind(this);
        lcd.run = function () {
            console.log('E Went Low!');
            console.log('IDK what to do now!')
        }.bind(this)

        lcd._e = undefined;
        Object.defineProperty(lcd, 'e', {
            get() {
                return this._e
            },
            set(e) {
                if (e == this._e) { return }
                this._e = e;
                if (this._e == false) {
                    this.run();
                }
            }
        })
        return lcd
    }
    static Memory() {
        var memory = [];
        return memory
    }
}
Simulator.loadResources(() => {
    widgets = document.getElementsByClassName('widget');
    for (widget of widgets) {
        Simulator.initSimulatorWidget(widget);
    }
});