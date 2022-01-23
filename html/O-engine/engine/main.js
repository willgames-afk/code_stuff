import {Assets, Loader} from "./loader.js"
import { Sprite } from "./sprite.js";

export class Game {
	constructor(o) {
		this.init = o.init;
		this.loop = o.loop;
		this.audioContext = new AudioContext();
		
		this.assets = new Assets();
		this.loader = new Loader(this.assets,this.audioContext,this.startloop);

		this.prevtime = null;
		this.sprites = {};
		this.tilemaps = {};

		this.init({
			load:this.loader.load
		});
		if (this.loader.toLoad > 0) {
			this.loader.loadAll();
		} else {
			this.startloop();
		}

	}
	startloop() {
		this.prevTime = Date.now()-16.66;
	}
	outerLoop(ct) {
		var dt = (ct-this.prevTime) * 16.66;
		
	}

	render() {
		
	}

	create(type, id, ...params) {
		switch (type) {
			case "sprite":
				this.sprites[id] = new Sprite(...params);
				break;
			case "tilemap":
				this.tilemaps[id] = new Tilemap(...params);
		}
	}
}