class Simulator {
    constructor(element) {
        this.canvas = document.createElement('canvas')
        element.appendChild(this.canvas)
        this.assets = Simulator.assets;
        this.canvas.width = this.assets.background.width * 0.90;
        this.canvas.height = this.assets.background.height * 0.90;
        this.ctx = this.canvas.getContext("2d");
        this.charset = this.assets.chartable
        console.log(this.charset)
        this.display = Simulator.LCD(this.canvas, this.assets);
        this.render();
    }
    render() {
        var ps = 2, pd = 1, rows = 2, cols = 16, cwidth = 5, cheight = 8;
        this.ctx.drawImage(this.assets.background, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#000"
        for (var cr = 0; cr < rows; cr++) {
            for (var cc = 0; cc < cols; cc++) {
                for (var r = 0; r < cheight; r++) {
                    for (var c = 0; c < cwidth; c++) {
                        this.ctx.fillRect(50 + ((ps + pd) * 6) * cc + (ps + pd) * c, 60 + ((ps + pd) * 10) * cr + (ps + pd) * r, ps, ps)
                    }
                }
            }
        }
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
            xobj.onreadystatechange = (function (assets,toLoad) {
                return function () {
                    if (xobj.readyState == 4 && xobj.status == "200") {
                        assets[toLoad.json[i].name] = JSON.parse(xobj.responseText);
                        console.log('I loaded!')
                    }
                }
            })(this.assets,toLoad)
            xobj.send()
        }
    }
    static LCD(canvas, assets) {
        var lcd = {};
        lcd.canvas = canvas
        lcd.ctx = canvas.getContext('2d');
        lcd.canvas.width = assets.background.width * 0.90;
        lcd.canvas.height = assets.background.height * 0.90;
        lcd.render = function () {
            var ps = 2, pd = 1, rows = 2, cols = 16, cwidth = 5, cheight = 8;
            this.ctx.drawImage(this.assets.background, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "#000"
            for (var cr = 0; cr < rows; cr++) {
                for (var cc = 0; cc < cols; cc++) {
                    for (var r = 0; r < cheight; r++) {
                        for (var c = 0; c < cwidth; c++) {
                            this.ctx.fillRect(50 + ((ps + pd) * 6) * cc + (ps + pd) * c, 60 + ((ps + pd) * 10) * cr + (ps + pd) * r, ps, ps)
                        }
                    }
                }
            }
        }
        return lcd
    }
}
Simulator.loadResources();

window.addEventListener("load", () => {
    widgets = document.getElementsByClassName('widget');
    for (widget of widgets) {
        console.log('Widget!')
        Simulator.initSimulatorWidget(widget);
    }
});
