const config = {
	bus: "A", //6522 port used for data bus comms
	control: "B",
	e: 0, //Pin used for E line
	rs: 1,
	rw: 2,

	graphics: {
		pixelSize: 2,
		offset: [3, 3],

	},

	charMap: '\0\t\n\r !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\134]^_`abcdefghijklmnopqrstuvwxyz{|}~�������������\215�\217\220������������\235��������������������������������������������������������������������������������������������������'
}

class LCDDisplay {
	/** Creats an LCDDisplay
	 * @param {HTMLElement} parentElement The DOM element the LCD Display interface will be added to
	 * @param {VIA} slowBus The slowBus 6522 IO chip used to communicate with the LCD
	 * @param {Loader} loader A Loader object used to load the background image and the font for the lcd
	 */
	constructor(parentElement, slowBus, loader) {
		loader.addLoadFile("lcd", "LCD.png", { type: "img" });
		loader.addLoadFile("lcdFont", "lcd_font.json", { type: "json" })
		this._canvas = document.createElement("canvas");
		parentElement.appendChild(this._canvas);

		this.loader = loader;

		this._ctx = this._canvas.getContext("2d");

		this.IOChip = slowBus;
		this._shift = 0; //Current shift

		this.cgram = new Uint8Array(64);
		this.ddram = new Uint8Array(80);
		
		for (var i=0;i<this.ddram.length;i++) {
			this.ddram[i] = 0x57; //Clears to space chars (0x20) normally, setting it to 9 for debugging purposes
		}

		this.regDL = 0;//Data length;  4 bits (0) or 8 bits (1)
		this.regN = 0; //              1 line (0) or 2 lines (1)
		this.regF = 0; //font;       5x8 dots (0) or 5x10 dots (1)
		this.regS = 0; // Don't shift display (0) or Shift display (1)
		this.regID = 0;//    Decrement cursor (0) or increment cursor (1)

		this.regOn = 0;//  Entire Display off (0) or on (1)
		this.regC = 0; //          Cursor off (0) or on (1)
		this.regB = 0; //    Cursor Blink off (0) or on (1)

		this.busy = 0;//Busy Flag
	}
	get regAC() {
		return this._regAC;
	}
	set regAC(v) {
		if (this.regMS) {
			this._regAC = v % 64 //CGRAM has 64 bytes, wraps around after that.
		} else {
			this._regAC = v % 80 //DDRAM has 80 chars in it; wraps around after that
		}
	}
	getData() {
		this.regAC++;
		if (this.regMS) {
			return this.cgram[this.regAC - 1];
		} else {
			return this.ddram[this.regAC - 1];
		}
	}
	writeData(v) {
		this.regAC++;
		if (this.regMS) {
			this.cgram[this.regAC - 1] = v
		} else {
			this.ddram[this.regAC - 1] = v
		}
		this.update();
	}
	reset() {
		this.regAC = 0;
		this.regMS = 0; //Mem Select-   DDRAM (0) or CGRAM (1)
	}
	_writeToBus(v) {
		this.IOChip[config.bus] = v
	}
	onEnable() {
		const rw = this.IOChip[config.control][config.rw];
		const rs = this.IOChip[config.control][config.rs];
		const bus = this.IOChip[config.bus];
		if (rs) {
			if (rw) {
				//Read from --RAM
				this._writeToBus(this.getData());
			} else {
				//Write to --RAM
				this.writeData(bus);
			}
		} else {
			if (rw) {
				//Read Busy flag and regAC
				this._writeToBus(this.busy << 7 | this.regAC);
			} else {
				//Send Instruction
				if (bus & 128) { //If DB7 is set
					//Set DDRAM address
					this.regMS = 0;
					this.regAC = bus & 0x7f

				} else if (bus & 64) {
					//Set CGRAM address
					this.regMS = 1;
					this.regAC = bus & 0x3F;

				} else if (bus & 32) {
					//Function set
					this.regDL = bus & 16;
					this.regN = bus & 8;
					this.regF = bus & 4

				} else if (bus & 16) {
					//Shift Display/Cursor
					this.regSC = bus & 8;
					this.regRL = bus & 4;

				} else if (bus & 8) {
					//Display on/off
					this.regOn = bus & 4;
					this.regC = bus & 2;
					this.regB = bus & 1;

				} else if (bus & 4) {
					//Cursor direction and display shift
					this.regID = bus & 2;
					this.regS = bus & 1;

				} else if (bus & 2) {
					//Return to Home
					this._shift = 0;
					this.regMS = 0;
					this.regAC = 0;
				} else if (bus & 1) {
					//Clear entire display and set ddram to 0;
					this.regAC = 0;
					this.regMS = 0;
				}
			}
		}
	}
	update() {
		let c = this._ctx;
		let pixelSize = config.graphics.pixelSize;
		let offset = config.graphics.offset;
		var font = this.font;
		let cgram = this.cgram;
		let position = this.regAC

		c.clearRect(0, 0, this._canvas.width, this._canvas.height);
		c.drawImage(this.img, 0, 0);
		c.fillStyle = "rgba(2,2,2,1)"

		function pxrow(x, y, num) {
			for (var i = 0; i < 5; i++) {
				if (num & (1 << i)) {
					c.fillRect(x + i * pixelSize, y + i * pixelSize, pixelSize, pixelSize);
				}
			}
		}

		function char(id, x, y, code) {
			console.log(code)
			console.log(font)
			if (code > 7) {
				for (var i = 0; i < 7; i++) {
					console.log(font[code][i])
					pxrow(x, y + i * pixelSize, font[code][i]);

				}
			} else {
				for (var i = 0; i < 8; i++) {

					pxrow(x, y + i * pixelSize, cgram[code + i * 8]);

				}
			}
			if (id == position) {
				pxrow(x, y + 8 * pixelSize, 31); //cursor is a solid line rendered underneath 5x7 font; overwrites 5x8 cgram chars
			}
		}

		function charRow(x, y, chars) {
			for (var i = 0; i < 16; i++) {
				char(i, x + i * 6 * pixelSize, y, chars[i]);
			}
		}

		console.log(this.ddram.slice(this._shift, this._shift + 16))
		charRow(offset[0], offset[1], this.ddram.slice(this._shift, this._shift + 16));
		charRow(offset[0], offset[1] + 9, this.ddram.slice(this._shift, this._shift + 16));
	}
	init() {
		let c = this._ctx;

		this.img = this.loader.assets.lcd;
		this.font = this.loader.assets.lcdFont;

		console.log("LCD Initializing...")
		this._canvas.width = this.img.width;
		this._canvas.height = this.img.height;
		c.drawImage(this.img, 0, 0);
	}
}

module.exports = { LCDDisplay }