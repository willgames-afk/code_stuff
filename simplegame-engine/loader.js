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