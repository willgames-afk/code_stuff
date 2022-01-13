class Game {
	constructor(o) {
		this.init = o.init;
		this.start = o.start;
		this.loop = o.loop;

		this.toLoad = 0;

		this.audioContext = new AudioContext();

		this.init({ load: this.load });
	}
	load(type, id, file) {
		switch (type) {
			case "spritesheet":
				this._loadSS(id, file);
				break;
			case "image":
				this._loadImg(id, file, this.onFileLoad);
				break;
			case "audio":
				this._loadAudio(id, file, this.onFileLoad);
				break;
			case "JSON":
				this._loadJSON(id, file, this.onFileLoad);
		}
		this.toLoad++;
	}
	onFileLoad(id, res) {
		if (res) {
			this.things[id] = res;
		}

		this.toLoad--;
		if (this.toLoad == 0) {
			this.start();
			this.requestAnimationFrame(this.outerLoop);
		}
	}
	_loadSS(id, file) {
		this._loadJSON(id, file, (obj) => {
			this.things[id] = {};
			this.things[id].rawdata = obj;

			this._loadImg("", obj.image, (img) => {
				this.things[id].img = img;

				for (var sprite of this.things[id].rawdata) {
					this.things[sprite] = this.things[id].rawdata[sprite];
					this.things[sprite].img = img;
				}

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
					cb();
				} else {
					this.onFileLoad(id, audio);
				}
			})
		}, () =>{
			console.log("Error loading audio!");
		}, "arraybuffer")
	}
	_loadJSON(id, file, cb) {
		this._requestFile(file, (res)=>{

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

export function load(type, id, file) {
	switch (type) {
		case "image":
			var img = new Image();
			img.onload = () => { //Wrapped onFileLoad
				this.onFileLoad(id, img);
			}
			img.src = this.filesToLoad[id];
			break;
	}
}


class Loader {
	constructor(files) {
		this.loadedFiles = {};     // Stores fully loaded files
		this.filesToLoad = files;  // Stores files to load in the form of identifier: url pairs
		this.failed = false;
	}
	get remaining() {
		return Object.keys(filesToLoad).length;
	}
	set remaining(v) {
		console.error("Property 'remaining' is read-only.")
	}

	load(extraFiles) {
		Object.assign(this.filesToLoad, extraFiles); // Combine all the to-load files into one object

		for (id of this.filesToLoad) {
			if (this.loadedFiles[id]) {
				delete this.filesToLoad[id]; //No need to load that file, we already loaded it.
				continue;
			}

			this._loadFile(id);
		}
	}
	_loadFile(id) {
		//Implementation Specific
	}

	_onFileLoad(id, file) {
		this.loadedFiles[id] = file;
		delete this.filesToLoad[id];

		// Check if all files are loaded, and that there were no errors doing so.
		if (this.remaining == 0 && this.failed == false) {
			this.onload();
		}
	}

	_onFileError(id, errorMessage) {
		console.error(`Failed to load '${this.filesToLoad[id]}'`, errorMessage);

		this.failed = true;

		this.onerror();
	}



	_bindOnFileLoad(id) { // Binds a filename to onLoadFile
		return (file) => {
			this.onFileLoad(id, file)
		}
	}

	_bindOnFileError(id, error) {
		return () => {
			this._onFileError(id, error);
		}
	}

	onerror() { }
	onload() { } //Registerable Event Listener
}

export class ImageLoader extends Loader {
	constructor(...params) {
		super(...params);
	}
	_loadFile(id) {
		var img = new Image();
		img.onload = () => { //Wrapped onFileLoad
			this.onFileLoad(id, img);
		}
		img.src = this.filesToLoad[id];
	}
}

export class AudioLoader extends Loader {
	constructor(files, audioContext) {
		super(files);
		this.context = audioContext || new AudioContext();
	}
	_loadFile(id) {
		var req = new XMLHttpRequest();         // Create request

		req.open("GET", this.filesToLoad[id]);  // Use GET method, get the requested file
		req.responseType = "arraybuffer";       // We want an arraybuffer, not XML

		req.addEventListener("loadend", () => {
			this.context.decodeAudioData(req.response, this.bindOnFileLoad(id), this._bindOnFileError(id, "Error decoding audio"))
		}); // Register event listeners
		req.addEventListener("error", this._bindOnFileError(id, "Error getting audio"));

		req.send();
	}

}

export class JSONLoader extends Loader {
	constructor(...names) {
		super(...names);
	}
	_loadFile(id) {
		var req = new XMLHttpRequest();

		req.open("GET", this.filesToLoad[id]);
		req.responseType = "json";

		req.addEventListener("loadend", () => {
			this._onFileLoad(id, JSON.parse(req.response));
		})
		req.addEventListener("error", this._bindOnFileError(id, "Error loading JSON"))
	}
}

export class SpriteSheetLoader extends Loader {
	constructor(sheets, imageloader, jsonloader) {
		super(sheets);
		this.sprites = sprites;
		this.imageloader = imageloader;
		this.jsonloader = jsonloader;
	}
	_loadFile(id) {
		if (!this.jsonloader) this.jsonloader = new JSONLoader();
		if (!this.imageloader) this.imageloader = new ImageLoader();

		var o = {}
		o[id] = this.filesToLoad[id];

		this.jsonloader.onload = () => {

		}

		this.jsonloader.load(o);


	}
}

export class Sprite {
	constructor(tex, x, y, xv = 0, yv = 0) {
		this.x = x;
		this.y = y;
		this.xv = xv;
		this.yv = yv;
		this.texture = tex;
	}
}

export class Audio {
	constructor(sounds, audioContext) {
		this.sounds = sounds;
		this.context = audioContext || new AudioContext();
	}
	destroy() {
		if (this.context) {
			this.context.close();
		}
	}
	play(songName, options = { speed: 1, gain: 1 }) {
		if (this.context) {
			var source = this.context.createBufferSource(); // Create sound source

			source.buffer = this.sounds[songName];          // Feed it the audio
			source.playbackRate.value = options.speed;      // Set Speed

			var gainNode = this.context.createGain();       // Create gain node
			gainNode.gain.value = options.gain;             // Set the volume

			source.connect(gainNode);                       // Source -> Gain -> Destination
			gainNode.connect(this.context.destination);

			source.start(0);                                // Start the sound
		}
	}
	pauseAll() {
		if (this.context) {
			this.context.suspend();
		}
	}
	resume() {
		if (this.context) {
			this.context.resume();
		}
	}
}