import {Assets, Loader} from "./loader.js"
import { Sprite } from "./sprite.js";
import {load, save, remove} from "./save.js"

export class Game {
	constructor(o,) {
		this.init = o.init;
		this.loop = o.loop;

		this.canvas = document.createElementById("canvas");
		this.width = canvas.width;
		this.height = canvas.height;
		this.ctx = canvas.getContext("2d");

		this.audioContext = new AudioContext();
		
		this.assets = new Assets();
		this.loader = new Loader(this.assets,this.audioContext,this.startloop);

		this.prevtime = null;
		this.gameObjs = {};
		this.gameState = {};

		this.stop = false;

		this.init({
			load:this.loader.load,
			width: this.width,
			height: this.height
		});
		if (this.loader.toLoad > 0) {
			this.loader.loadAll();
		} else {
			this.startloop();
		}
	}
	startloop() {
		this.prevTime = Date.now()-16.66;
		requestAnimationFrame(this.outerLoop);
	}
	outerLoop(ct) {
		var dt = (ct-this.prevTime) * 16.66;
		var O = {
			draw: this.draw,
			make: this.make,
			stop: ()=>{
				this.stop = true;
			},
			state: this.gameState,
			save: save,
			load: load,
			removeSave: remove
		}
		this.loop(O);
		requestAnimationFrame(this.outerLoop);
	}

	draw(id,scale) {
		switch (this.gameObjs[id].type) {
			case "sprite":
				this._drawSprite(id,scale);
				break;
			case "tilemap":
				this._drawTilemap(id,scale);
				break;
		}
	}
	drawSprite(id, scalex=1,scaley=1) {
		var s = this.gameObjs[id];
		var sx = s.frames[s.frame].x;
		var sy = s.frames[s.frame].y
		this.ctx.drawImage(s.img, sx,sy, s.w, s.h, s.x,s.y, s.w*scalex,s.h*scaley);
	}
	drawTilemap(id,scale) {
		var t = this.gameObjs[id];

		var x1 = Math.floor(-t.x/t.tiles.width) * t.tiles.width;
		var x2 = Math.ceil((-t.x+this.width)/t.tiles.width) * t.tiles.width;

		var y1 = Math.floor(-t.y/t.tiles.height) * t.tiles.height;
		var y2 = Math.ceil((-t.y+this.height)/t.tiles.height) * t.tiles.height;
		
		for (var y=y1;y<y2 && y<t.length,y++) {
			for (var x=x1;x<x2 && x<t[y].length;x++) {
				t.drawTile(this.ctx,t[y][x],x*t.tiles.width,y*t.tiles.height);
			}
		}
	}

	make(id, tex,...params) {
		var texture = this.assets[tex]
		this.gameObjs[id] = new Sprite(texture.img,texture.data, ...params);
	}
}