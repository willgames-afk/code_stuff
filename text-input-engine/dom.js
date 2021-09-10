//Contains most of the stuff involved for talking to the DOM and setting up all the input elements and such.

/**
 * Extends the DOM textarea to become a flexible input.
 * @class
 * @param {String} [value] - Initial value for the input.
 * @param {Object} [options]
 * @param {Boolean} [options.spellcheck=false] - When true, enables spellcheck. Defaults to false.
 * @param {Boolean} [options.resizeable=true] - When true, allows manual resizing of textarea.
 * @param {Boolean} [options.autoresize=true] - When true, enables automatic resizing of textarea
 * @returns HTMLTextAreaElement
 */
export function Input(value = "", options = { spellcheck: false, resizeable: true, autoresize=true }) {
	var self = document.createElement("textarea");
	self.readOnly = false;
	self.spellcheck = options.spellcheck;
	self.value = value;

	if (!options.resizeable) self.style.resize = "none";
	//When textarea value is changed, resize it with minimum height = original height
	if (options.autoresize) {
		self.addEventListener("input", resizeTACallback(self, JSON.parse(JSON.stringify(self.style.height))));
		if (self.value) resizeTA(self);
	}
	return self;
}
/**
 * Extends the DOM textarea to become a flexible output
 * @class
 * @param {String} [value] - Initial value for the output.
 * @param {Object} [options]
 * @param {Boolean} [options.spellcheck=false] - When true, enables spellcheck. Defaults to false.
 * @param {Boolean} [options.resizeable=true] - When true, allows manual resizing of textarea.
 * @param {Boolean} [options.autoresize=true] - When true, enables automatic resizing of textarea
 * @returns HTMLTextAreaElement
 */
export function Output(value = "", options = { spellcheck: false, resizeable: true, autoresize=true }) {
	var self = document.createElement("textarea");
	self.readOnly = true;
	self.spellcheck = options.spellcheck;
	self.value = value;
	if (!options.resizeable) self.style.resize = "none";
	if (options.autoresize) {
		self.addEventListener("input", resizeTACallback(self, JSON.parse(JSON.stringify(self.style.height))));
		if (self.value) resizeTA(self);
	}
	return self;
}
/**
 * Provides a default Controls class
 * @implements Controls
 */
export class DefaultControls extends Controls {
	constructor(options = { run: true }) {
		super(options)
		if (this.options.run) {
			this.buttons.run = document.createElement("button");
			this.buttons.run.value = "Run";
			this.buttons.run.addEventListener("click", this.onRun);
		}
		if (this.options.clearResult) {
			this.buttons.clearOut = document.createElement("button");
			this.buttons.clearOut.value = "Clear Output";
			this.buttons.clearOut.addEventListener("click", this.onClear());
		}
	}
}
/**
 * @interface
 */
export class Controls {
	/**
	  * @param {Object} [options] - Options
	  * @param {Boolean} [options.run=true] - When true, include a "Run" button in the controls
	  * @param {Boolean} [options.clearOut=false] - When true, include a "Clear Output" button.
	  * @param {Function} [options.onRun] - Callback that triggers when the run button is pressed
	  * @param {Function} [options.onClear] - Callback triggered when clear output button is pressed
	*/
	constructor(options = { run: true }) {
		this.options = options
		this.buttons = { run: {}, clearOut: {} };
	}
	/** Callback triggered when run button is pressed */
	onRun() { };
	/** Callback triggered when output is cleared */
	onClear() { };
}

/** 
 * Function to auto-resize textareas 
 * @param {HTMLTextAreaElement} textarea - The target textarea
 * @param {Number} [minHeight=0] - Minimum allowed height for the textarea
 */
export function resizeTA(textarea, minHeight = 0) {
	textarea.style.height = "0px";
	if (textarea.scrollHeight > minHeight) {
		textarea.style.height = textarea.scrollHeight + 'px';
	} else {
		textarea.style.height = minHeight + 'px';
	}
}

/** resizeTA in a callback wrapper */
export function resizeTACallback(textarea, minHeight) {
	return () => {
		resizeTA(textarea, minHeight);
	}
}