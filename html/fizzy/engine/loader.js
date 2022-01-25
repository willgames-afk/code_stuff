import {Tilemap} from "./tilemap.js"

export class Assets {
	constructor(assets) {
		for (var a of assets) {
			this[a] = assets[a];
		}
		this._unloaded = {};
	}
	add(id, content) {
		this[id] = content;
	};
}

export class Loader {
	constructor(assets, audioContext, onload) {
		this.assets = assets || new Assets();
		this.onload = onload;
		this.audioContext = audioContext || new AudioContext();
		this.data = [];
		this.toLoad = 0;
	}
	load(type, id, file) {
		this.data.push({type:type,id:id,file:file});
	}
	loadAll() {
		for (var a of this.data) {
			switch (a.type) {
				case "spritesheet":
					this._loadSS(a.id, a.file);
					break;
				case "tilemap":
					break;
				case "image":
					this._loadImg(a.id, a.file, this._onFileLoad);
					break;
				case "audio":
					this._loadAudio(a.id, a.file, this._onFileLoad);
					break;
				case "JSON":
					this._loadJSON(a.id, a.file, this._onFileLoad);
			}
			this.toLoad++;
		}
	}
	_onFileLoad(id, res) {
		if (res) {
			this.assets.add(id,res);
		}

		this.toLoad--;
		if (this.toLoad == 0) {
			this.onload(this.assets);
		}
	}
	_loadTilemap(id,file) {
		this._loadJSON(id,file,(obj)=>{
			this.assets.unloaded[id] = {};
			this.assets.unloaded[id].rawdata = obj;

			this._loadImg("",obj.tileset.image,(img)=>{
				this.assets.add(id, new Tilemap(img,this.assets.unloaded[id].rawdata));
				this.onFileLoad(id);
			})
		})
	}
	_loadSS(id, file) {
		this._loadJSON(id, file, (obj) => {
			this.assets.unloaded[id] = {};
			this.assets.unloaded[id].rawdata = obj;

			this._loadImg("", obj.image, (img) => {
				this.assets.unloaded[id].img = img;

				for (var sprite of this.assets.unloaded[id].rawdata) {
					var newSprite = this.assets.unloaded[id].rawdata[sprite];
					newSprite.img = img;
					this.assets.add(id, newSprite);
				}
				delete this.assets.unloaded[id];

				this.onFileLoad(id);
			})
		});
	}
	_loadImg(id, file, cb) {
		var img = new Image();
		img.onload = () => { //Wrapped onFileLoad
			if (cb) {
				cb(img);
			} else {
				this.onFileLoad(id, img);
			}
		}
		img.src = file;
	}
	_loadAudio(id, file, cb) {
		this._requestFile(file, (res)=>{
			this.audioContext.decodeAudioData(res, (audio)=>{
				if (cb) {
					cb(audio);
				} else {
					this.onFileLoad(id, audio);
				}
			})
		}, () =>{
			console.log(`Error loading audio (ID: ${id})`);
		}, "arraybuffer")
	}
	_loadJSON(id, file, cb) {
		this._requestFile(file, (res)=>{
			if (cb) {
				cb(JSON.parse(res))
			} else {
				this.onFileLoad(id, JSON.parse(res))
			}
		})
	}
	_requestFile(url, callback, error = () => { }, resType) {
		var req = new XMLHttpRequest();
		req.open("GET", url);
		req.responseType = resType;
		req.addEventListener("loadend", () => {
			callback(req.response);
		})
		req.addEventListener("error", error);
		req.send();
	}
}