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

	_onFileLoad(name, file) {
		this.loadedFiles[name] = file;
		delete this.filesToLoad[name];

		// Check if all files are loaded, and that there were no errors doing so.
		if (this.remaining == 0 && this.failed == false) {
			this.onload();
		}
	}

	_onFileError(name, errorMessage) {
		console.error(`Failed to load '${name}'`, errorMessage);

		this.failed = true;

		this.onerror();
	}



	_bindOnFileLoad(name) { // Binds a filename to onLoadFile
		return (file) => {
			this.onFileLoad(name, file)
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
			this.context.decodeAudioData(req.response, this.bindOnFileLoad(id), (e) => { // Once the arrayBuffer loads, we have to turn it into a proper audioBuffer
				console.log("Error decoding audio: " + e.message)
			})
		}); // Register event listeners
		req.addEventListener("error", () => {
			console.error("Error getting audio: ", req.status, req.statusText);
		})

		req.send();
	}

}

export class SpriteLoader extends Loader {
	constructor(spritesheet, sprites, context) {
		super(sprites);
		this.spritesheet = spritesheet;
	}
	_loadFile(id) {

	}
}

export class Sprite {
	constructor(spritesheet, ctx, options) {
		this.spritesheet = spritesheet;
		this.ctx = ctx;
		this.data = options.data;
		/*
		{
			fwidth: //Width of a single frame
			fheight: //Height of a single frame

			//options.animated must be enabled for the below:
			speed:   //framerate of the animation in frames per second- Will be overwritten by animation specific framerates and defaults to 30fps.
			animations: { //Animation frame sequences- 
				animationName: [ //Animation data
					{x: 0,y:0} //location of the top left corner of the frame on the spritesheet
					{p: 1} //You can also use 'p'- basically, it will turn the spritesheet into a grid of fwidth x fheight cells, and number them 
								the top left cell would be 0, the one to the right would be 1, so on for the rest of the line. Then it moves down and continues.
					{p: 4, x: 1, y: 3} //You can also provide an offset which shifts the p grid left and down by the corrosponding x and y amounts.

					//Repeat for every frame of the animation
				]

				//You can also store more specific instructions as an object
				otherAnimation: {
					speed: //You can set animation speeds individually
					mode: // 0 is play forwards once, 1 is play forwards looping, 2 is play backwards once, and 3 is play backwards looping;
					data: [
						//Insert data here
					]
				}
				//You can include as many as you want.
			}

			//If you only have a single animation, store it in the frames object
			//If options.animated is false, you'll have to switch manually
			frames: [
				//You can include individual sprite frames and switch between them, same xyp format as above
			]

			animation: //name of the current animation, if any
			frame: //The current frame
			play:  //Whether or not the animation should be playing (if any)
			playthroughmode: // Mode of animation playthrough- 0 is play once, 1 is play looping
		}


		*/
		this.animated = options.animated;
		if (this.animated) {
			this.currentAnimation = this.data.animation;
			if (this.data.animations && !Array.isArray(this.data.animations[currentAnimation])) {
				this.frameRate = this.data.animations[currentAnimation].speed;
				this.update = (dt) => { //Dt is the time that has passed since update was last called
					this._frameDT += dt;
					if (this._frameDT >= this._frameSpeed) {
						this.currentFrame++;
						if (this.currentFrame > this.data.animations[currentAnimation].length) {
							this.currentFrame = 0;
						}
						this._frameDT = 0;
					}
				}
				this.render = () => {
					var cfdata = this.data.animations[currentAnimation][currentFrame];
					
				}
			} else {
				this.frameRate = this.data.speed || 30;
				this.update = (dt) => { //Dt is the time that has passed since update was last called

					this._frameDT += dt;
					if (this._frameDT >= this._frameSpeed) {
						this.currentFrame++;
						if (this.currentFrame > this.frames) {
							this.currentFrame = 0;
						}
						this._frameDT = 0;
					}
	
				}
			}
		}
		this.currentFrame = options.data.frame || 0;

		this._frameDT = 0; //Time since last animation frame change
		this._frameSpeed = 1000 / this.frameRate; //Time in milliseconds that should pass between each frame

	}
	update(dt) {
		//Depends on whether or not the sprite is animated
	}

}

export class Audio {
	constructor(sounds, audioContext) {
		this.sounds = sounds;
		this.context = audioContext || new AudioContext();
	}
	destroy() {
		this.context.close();
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
		this.context.suspend();
	}
	resume() {
		this.context.resume();
	}
}