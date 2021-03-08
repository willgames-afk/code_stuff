import {log, optLog, error} from "./logging.js";
import {isPowerOf2} from "./math.js"
export class ResourceManager {
	constructor(gl, gs,requiredResources) {
		this.gl = gl;
		this.gs = gs; //Game State
		this.requiredResources= requiredResources;
		if (!this.gs.textures) {
			this.gs.textures = {};
		}
		for (var i=0; i<requiredResources.length; i++) {
			this.loadResource(this.requiredResources[i] )
		}
	}
	loadResource(name) {
		//Loads a resource.

		var xhr = new XMLHttpRequest(); //Set up XML Http Request

		xhr.onreadystatechange = (e) => {

			if (xhr.readyState === XMLHttpRequest.DONE) { //If done

				if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) { //If successful

					var resObj = JSON.parse(xhr.responseText); //Parse describer json

					if (resObj.type == "texture") { 

						this.gs.textures[name] = {};
						
						for (var key in resObj.faceTextures) { //For each face texture

							this.gs.textures[name][key] = this.loadTexture(
								this.gl,
								resObj.textureSrcs[resObj.faceTextures[key].img],
								resObj.faceTextures[key]
							);
						}
						console.log(this.gs)
					}
				}
			}
		}
		xhr.open("GET","res/" + name+ ".json");
		xhr.send();
	}
	loadTexture(gl, url, options) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		//Images have to load, so put a single pixel so the texture can be used.
		//We'll replace it once the image loads.
		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1;
		const height = 1;
		const border = 0;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;
		const pixel = new Uint8Array([0,255,0,255]); //Opaque Green
		gl.texImage2D(
			gl.TEXTURE_2D, 
			level,
			internalFormat,
			width,
			height,
			border,
			srcFormat,
			srcType,
			pixel
		);

		//Load the actual texture
		const image = new Image();
		image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D,texture);
			gl.texImage2D(
				gl.TEXTURE_2D,
				level,
				internalFormat,
				srcFormat,
				srcType,
				image
			)

			//WebGL is wierd about power of 2 images; it needs mipmaps.
			if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
				gl.generateMipmap(gl.TEXTURE_2D);
			} else {
				//No mipmaps, clamp to edge and prevents wrapping (repeating)
				if (options.wrappingX) {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[options.wrappingX]);
				} else {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[options.wrapping]);
				}

				if (options.wrappingY) {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[options.wrappingY]);
				} else {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[options.wrapping]);
				}
				
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[options.filter]); 
		
				
			}
		};
		image.src = "res/"+url; //Start it loading

		return texture;
	}
	loadShader(vsURL, fsURL) {
		var vsSource = "";
		var fsSource = "";
		function checkIfBothLoaded() {
			if (vsSource.length > 0) {

			}
			if (vsSource != "" && fsSource != "") {
				//Continue
			}
		}
		this.requestFile(vsURL,function (file) {
			vsSource = file;
		}.bind(this), "text");
		this.requestFile(fsURL, function (file) {
			fsSource = file;
		}, "text");
	}
	requestFile(url, onload, type) {
		var xhr = new XMLHttpRequest();
		xhr.method = "GET";
		xhr.url = url;
		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 0 || (xhr.status >= 200 && xhr < 400)) {
					if (xhr.responseType !== type) {
						error("LoadError: File Type "+xhr.responseType+" does not equal paramter type: "+type)
					} else {
						onload(xhr.response);
					}
				} else {
					error("LoadError: XMLHttpRequest Failed to load resource, returned status code " + xhr.status + ".");
				}
			}
		}
		xhr.send();
	}
}