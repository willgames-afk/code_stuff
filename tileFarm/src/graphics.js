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
class Camera {
	constructor(gl, position, pointingTo) {
		this.gl = gl;
		this.position = position;
		this.target = pointingTo;
		this.direction = vec3.create();
		this.right = vec3.create();
		this.up = vec3.create();
		console.log(this)
		vec3.normalize(this.direction, vec3.subtract(vec3.create(), this.position, this.target));
		vec3.normalize(this.right, vec3.cross(vec3.create(), vec3.fromValues(0,1,0),this.direction));
		vec3.cross(this.up, this.direction, this.right);
		console.log(this)
	}
}
export class Rendererer {
	constructor(display, gameState) {
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
		this.gameState = gameState;
		console.log(this)
		this.camera = new Camera(this.gl, this.gameState.player.pos, this.gameState.player.direction)
	}
	initShaders() {
		this.shader = new Shader(this.gl, this.vsSource, this.fsSource);
		const shaderProgram = this.shader.shader
		this.shader.info.attribLocations = {
			vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor')
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
			// Front face
			-1.0, -1.0, 1.0,
			1.0, -1.0, 1.0,
			1.0, 1.0, 1.0,
			-1.0, 1.0, 1.0,

			// Back face
			-1.0, -1.0, -1.0,
			-1.0, 1.0, -1.0,
			1.0, 1.0, -1.0,
			1.0, -1.0, -1.0,

			// Top face
			-1.0, 1.0, -1.0,
			-1.0, 1.0, 1.0,
			1.0, 1.0, 1.0,
			1.0, 1.0, -1.0,

			// Bottom face
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0, 1.0,
			-1.0, -1.0, 1.0,

			// Right face
			1.0, -1.0, -1.0,
			1.0, 1.0, -1.0,
			1.0, 1.0, 1.0,
			1.0, -1.0, 1.0,

			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0, 1.0,
			-1.0, 1.0, 1.0,
			-1.0, 1.0, -1.0,
		];
		//We need different vertexes per face because they're colored by vertex (So )

		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(positions),
			this.gl.STATIC_DRAW
		);

		/*const colors = [
			1.0, 1.0, 1.0, 1.0,    // white
			1.0, 0.0, 0.0, 1.0,    // red
			0.0, 1.0, 0.0, 1.0,    // green
			0.0, 0.0, 1.0, 1.0,    // blue
		];*/
		const faceColors = [
			[1.0, 1.0, 1.0, 1.0],    // Front face: white
			[1.0, 0.0, 0.0, 1.0],    // Back face: red
			[0.0, 1.0, 0.0, 1.0],    // Top face: green
			[0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
			[1.0, 1.0, 0.0, 1.0],    // Right face: yellow
			[1.0, 0.0, 1.0, 1.0],    // Left face: purple
		];
		var colors = [];
		for (var j = 0; j < faceColors.length; j++) {
			const c = faceColors[j];

			//Repeat each color 4 times (WebGL colors by vertex and each face has 4 vertexes)
			colors = colors.concat(c, c, c, c);
		}


		const colorBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

		const indexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		//Define each face of the cube as 2 triangles
		const indices = [
			0, 1, 2, 0, 2, 3, //Front Face
			4, 5, 6, 4, 6, 7, //Back Face
			8, 9, 10, 8, 10, 11, //Top Face
			12, 13, 14, 12, 14, 15, //Bottom
			16, 17, 18, 16, 18, 19, //Right
			20, 21, 22, 20, 22, 23, //Left
		]
		this.gl.bufferData(
			this.gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(indices),
			this.gl.STATIC_DRAW
		)

		this.buffers = {
			position: positionBuffer,
			color: colorBuffer,
			indices: indexBuffer,
		}
	}
	render() {

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0); //Clear to opaque black
		this.gl.clearDepth(1.0);               //Clear all
		this.gl.enable(this.gl.DEPTH_TEST);        //Enable depth testing
		this.gl.depthFunc(this.gl.LEQUAL);        //Near things block far things


		//Clear Canvas
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		var testMatrix = mat4.create();
		mat4.targetTo(
			testMatrix,//Matrix to operate on
			this.gameState.player.pos,
			vec3.add(vec3.create(), this.gameState.player.pos, vec3.fromValues(0,0,-1)),
			vec3.fromValues(0,1,0)
		)

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
		//const modelViewMatrix = mat4.create();
		const modelViewMatrix = testMatrix;

		//Move the draw position a bit to where we want to draw the square
		mat4.translate(
			modelViewMatrix, //Destination
			modelViewMatrix, //Matrix to tranlate
			[0.0, 0.0, -6.0] //Amount to tranlate
		)
		mat4.rotate(
			modelViewMatrix,
			modelViewMatrix,
			this.gameState.rotation,
			[0,0,1]
		)
		mat4.rotate( //Rotate cube around x axis too
			modelViewMatrix,
			modelViewMatrix,
			this.gameState.rotation * 0.7,
			[0, 1, 0] //Only x axis
		);

		//Tell webgl how to get the positions from the position buffer into the vertexPosition attribute	
		{
			const componentCount = 3; //Pull 3 values per iteration (x y and z)
			const type = this.gl.FLOAT; //The buffer is in 32 bit floats
			const normalize = false; //don't normalize
			const stride = false;// how many bytes to get from one set of values to the next, 0=use type & componentCount above.
			const offset = 0;     //how many bytes inside the buffer to start from
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
		}

		//How to get color from color buffer to vertexColor
		//A guide for webgl
		{
			const componentCount = 4; //Pull 4 values per iteration (rgba)
			const type = this.gl.FLOAT; //The buffer is in 32 bit floats
			const normalize = false; //don't normalize
			const stride = 0;// how many bytes to get from one set of values to the next, 0=use type & componentCount above.
			const offset = 0;     //how many bytes inside the buffer to start from
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
		}
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);



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
		{ //Special code block so constants don't interfere
			const vertexCount = 36;
			const type = this.gl.UNSIGNED_SHORT;
			const offset = 0;
			this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
		}
	}
}
