import { log, optLog, error } from "./logging.js"
export class Display {
	constructor(parentElement, width, height, style) {
		this.canvas = document.createElement("canvas");
		this.canvas.width = width;
		this.canvas.height = height;
		optLog("Successful Display init!");
		optLog(this);
		parentElement.appendChild(this.canvas);
		this.renderingContext = this.canvas.getContext("webgl");
		if (this.renderingContext === null) {
			throw "WebGL Not Initialized; Cannot continue.";
		}
	}
	get width() {
		return this.canvas.width;
	}
	set width(v) {
		this.canvas.width = v;
		return this.canvas.width;
	}
	get height() {
		return this.canvas.height;
	}
	set height(v) {
		this.canvas.height = v;
		return this.canvas.height;
	}
}
class Shader {
	constructor(gl, vsSource, fsSource) {
		this.gl = gl;
		this.vsSource = vsSource;
		this.fsSource = fsSource;
		function loadShader(type, source) {
			const shader = this.gl.createShader(type);
			this.gl.shaderSource(shader, source);
			this.gl.compileShader(shader);
			//Handle errors
			if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
				error("LoadShader Errror: An error occured compiling the shader. Info: " + this.gl.getShaderInfoLog(shader));
				this.gl.deleteShader(shader);
				return null;
			}
			return shader
		}
		this.vertexShader = loadShader.bind(this)(this.gl.VERTEX_SHADER, this.vsSource);
		this.fragmentShader = loadShader.bind(this)(this.gl.FRAGMENT_SHADER, this.fsSource);
		this.shader = this.gl.createProgram();
		this.gl.attachShader(this.shader, this.vertexShader);
		this.gl.attachShader(this.shader, this.fragmentShader);
		this.gl.linkProgram(this.shader);
		if (!this.gl.getProgramParameter(this.shader, this.gl.LINK_STATUS)) {
			error('LoadShader Error: Unable to initialize the shader program. Info: ' + this.gl.getProgramInfoLog(shaderProgram));
			return null;
		}

		this.info = { program: this.shader };
	}
}

export class Rendererer {
	constructor(display) {
		this.display = display;
		this.gl = this.display.renderingContext;

		this.vsSource = `
			attribute vec4 aVertexPosition;
			attribute vec4 aVertexColor;

    		uniform mat4 uModelViewMatrix;
    		uniform mat4 uProjectionMatrix;

			varying lowp vec4 vColor;

    		void main() {
				gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
				vColor = aVertexColor;
    		}
		  `;
		this.fsSource = `
			varying lowp vec4 vColor;

    		void main() {
      			gl_FragColor = vColor;
    		}
		  `;
		this.initShaders();
		this.initBuffers();
	}
	initShaders() {
		this.shader = new Shader(this.gl, this.vsSource, this.fsSource);
		const shaderProgram = this.shader.shader
		this.shader.info.attribLocations = {
			vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			vertexColor: this.gl.getAttribLocation(shaderProgram,'aVertexColor')
		}
		this.shader.info.uniformLocations = {
			projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
		}
	}
	initBuffers() {
		const positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
		const positions = [
			-1.0, 1.0,
			1.0, 1.0,
			-1.0, -1.0,
			1.0, -1.0
		];
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(positions),
			this.gl.STATIC_DRAW
		);

		const colors = [
			1.0, 1.0, 1.0, 1.0,    // white
			1.0, 0.0, 0.0, 1.0,    // red
			0.0, 1.0, 0.0, 1.0,    // green
			0.0, 0.0, 1.0, 1.0,    // blue
		];
		const colorBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

		this.buffers = {
			position: positionBuffer,
			color: colorBuffer
		}
	}
	render() {
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0); //Clear to opaque black
		this.gl.clearDepth(1.0);               //Clear all
		this.gl.enable(this.gl.DEPTH_TEST);        //Enable depth testing
		this.gl.depthFunc(this.gl.LEQUAL);        //Near things block far things


		//Clear Canvas
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		//Create perspective matrix
		const fov = 45 * Math.PI / 180;                                      //Field of view (In Radians)
		const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight; //Aspect ration of canvas;
		const zNear = 0.1;   //Only display objects between .1 and 
		const zFar = 100.0;  //   100 units from the camera
		const projectionMatrix = mat4.create();
		mat4.perspective(
			projectionMatrix,
			fov,
			aspect,
			zNear,
			zFar
		);

		//set draw position to identity point (Center of scene)
		const modelViewMatrix = mat4.create();

		//Move the draw position a bit to where we want to draw the square
		mat4.translate(
			modelViewMatrix, //Destination
			modelViewMatrix, //Matrix to tranlate
			[0.0, 0.0, -6.0] //Amount to tranlate
		)

		//Tell webgl how to get the positions from the position buffer into the vertexPosition attribute	

		var componentCount = 2; //Pull 2 values per iteration
		var type = this.gl.FLOAT; //The buffer is in 32 bit floats
		var normalize = false; //don't normalize
		var stride = false;// how many bytes to get from one set of values to the next, 0=use type & componentCount above.
		var offset = 0;     //how many bytes inside the buffer to start from
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
		this.gl.vertexAttribPointer(
			this.shader.info.attribLocations.vertexPosition,
			componentCount,
			type,
			normalize,
			stride,
			offset
		)
		this.gl.enableVertexAttribArray(
			this.shader.info.attribLocations.vertexPosition
		);

		//How to get color from color buffer to vertexColor
		//A guide for webgl
		var componentCount = 4; //Pull 2 values per iteration
		var type = this.gl.FLOAT; //The buffer is in 32 bit floats
		var normalize = false; //don't normalize
		var stride = 0;// how many bytes to get from one set of values to the next, 0=use type & componentCount above.
		var offset = 0;     //how many bytes inside the buffer to start from
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
		this.gl.vertexAttribPointer(
			this.shader.info.attribLocations.vertexColor,
			componentCount,
			type,
			normalize,
			stride,
			offset
		)
		this.gl.enableVertexAttribArray(
			this.shader.info.attribLocations.vertexColor
		);

		

		//Tell webgl to use our shader program
		this.gl.useProgram(this.shader.shader);

		//Set shader uniforms
		this.gl.uniformMatrix4fv(
			this.shader.info.uniformLocations.projectionMatrix,
			false,
			projectionMatrix
		)
		this.gl.uniformMatrix4fv(
			this.shader.info.uniformLocations.modelViewMatrix,
			false,
			modelViewMatrix
		)

		var offset = 0;
		const vertexCount = 4;
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}
