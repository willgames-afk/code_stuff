class Simulator {
    constructor(element) {
        //create canvas and rendering context; used to render LCD
        this.canvas = document.createElement('canvas');
        element.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");

        //Setting up reset button- this is crucial for audio
        this.startButton = document.createElement('button');
        this.startButton.innerHTML = 'Reset';
        element.appendChild(this.startButton);

        //Grab assets and finish setting up canvas
        this.assets = Simulator.assets;

        this.canvas.width = this.assets.background.width * 0.90;
        this.canvas.height = this.assets.background.height * 0.90;

        this.charset = this.assets.chartable;

        //Create LCD simulator
        this.display = Simulator.LCD(this.canvas, this.assets);
        console.log('Successful Simulator Start!')
        //Start the simulation!
        this.render();
    }
    render() {
        this.display.render.bind(this)();
    }
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
    static loadResources() {
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
        for (var i = 0; i < toLoad.imgs.length; i++) {
            var img = new Image();
            this.assets[toLoad.imgs[i].name] = img;
            img.src = "assets/" + toLoad.imgs[i].src
        }
        for (var i = 0; i < toLoad.json.length; i++) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', "assets/" + toLoad.json[i].src, true)
            xobj.onreadystatechange = (function (assets,toLoad,i) {
                return function () {
                    if (xobj.readyState == 4 && xobj.status == "200") {
                        assets[toLoad.json[i].name] = JSON.parse(xobj.responseText);
                    }
                }
            })(this.assets,toLoad,i)
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
        for (i=0;i<128;i++) {
            lcd.ddram[i] = 34;//Display Initializes to spaces
        }
        lcd.cgram = new Array(64);

        lcd.render = function () {
            var ps = 2, pd = 1, rows = 2, cols = 16, cwidth = 5, cheight = 8;
            lcd.ctx.drawImage(assets.background, 0, 0, lcd.canvas.width, lcd.canvas.height);
            lcd.ctx.fillStyle = "#000"
            var test = '';
            for (var cr = 0; cr < rows; cr++) {
                for (var cc = 0; cc < cols; cc++) {
                    for (var r = 0; r < cheight; r++) {
                        for (var c = 0; c < cwidth; c++) {
                            if (r < 8 && Simulator.pad(assets.chartable[34][r].toString(2),5,'0',false)[c] == '1') {
                                test += '█'
                                lcd.ctx.fillRect(50 + ((ps + pd) * 6) * cc + (ps + pd) * c, 60 + ((ps + pd) * 10) * cr + (ps + pd) * r, ps, ps)
                            } else {
                                test += ' '
                            }
                        }
                    }
                }
            }
        }.bind(this)
        return lcd
    }
}
Simulator.loadResources();
window.addEventListener("load", () => {
    widgets = document.getElementsByClassName('widget');
    for (widget of widgets) {
        Simulator.initSimulatorWidget(widget);
    }
});