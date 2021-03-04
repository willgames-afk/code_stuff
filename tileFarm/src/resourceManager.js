import {log, optLog, error} from "./logging.js";
import {isPowerOf2} from "./math.js"
export class ResourceManager {
	constructor() {

	}
	loadTexture(gl, url, useNearest) {
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
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

				if (useNearest) {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //Linear smooths images, gl.NEAREST leaves them pixelated.
				} else {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); //Linear smooths images, gl.NEAREST leaves them pixelated.
				}
			}
		};
		image.src = "../res/"+url; //Start it loading

		return texture;
	}
}