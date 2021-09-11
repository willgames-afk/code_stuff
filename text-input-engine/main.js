//Includes the main class
import { Input, Output, DefaultControls } from "./dom.js"
import { requestFile } from "./files.js";


/** text-input-engine Main Class */
export class TextIO {
	/**
	 * @param {Function} f - The function textIO will feed input recieve output from.
	 * @param {Object} o - Options.
	  * @param {Boolean} [o.addToDom=true] - When true, interface is automatically appended to the DOM
	  * @param {Input} [o.input=new Input()] - Input object to use
	  * @param {String} [o.defaultInput] - Initial input value
	  * @param {String} [o.defaultInputFile] - A filepath to a file to be used as input
	  * @param {Boolean} [o.runAuto=false] - When true, provided function will be run as soon as interface loads
	  * @param {Controls} [o.controls] - Controls object to control the TextIO object
	  * @param {Output} [o.output=new Output()] - Output object to use
	 */

	constructor(f, o) {
		const options = Object.assign({ addToDom: true }, o)

		if (!f) {
			console.error("No function passed to compute.");
			return;
		}

		this.function = f;

		this.htmlContainer = options.containerElement || document.createElement("div")

		if (options.addToDom) {
			document.body.appendChild(this.htmlContainer);
		}

		this.input = options.input || new Input();

		if (options.defaultInput) {

			this.input.value = options.defaultInput;

		} else if (options.defaultInputFile) {

			requestFile(options.defaultInputFile, function (e) {
				this.input.value = e.target.responseText
				this.input.resize();
				if (options.runAuto) this.run();

			}.bind(this))

		}
		this.htmlContainer.appendChild(this.input);



		if (options.controls) {
			this.controls = options.controls || new DefaultControls();
			this.controls.onRun = this.run;
			this.htmlContainer.appendChild(this.controls);
		} else {
			this.input.addEventListener("oninput", this.run);
		}

		this.output = options.output || new Output();
		this.htmlContainer.appendChild(this.output);

		if (options.runAuto && !options.defaultInputFile) {
			this.run();
		}
	}
	run() {
		this.output.value = this.function(this.input.value);
	}
}