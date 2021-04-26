export function requestFile(url, onload) {
	var req = new XMLHttpRequest();
	req.addEventListener("load", onload);
	req.addEventListener("error", (e) => { console.error(e) });
	req.open("GET", url, true);
	req.send();
}
/** Creates an HTML Textarea element from an object
 * @param {Object} obj
 * @param {string} obj.value - The textarea's actual text.
 * @param {boolean} [obj.readonly=false] - When true, textarea is not editable.
 * @param {boolean} [obj.resizable=true] - When true, allows the textarea to be editable.
 * @param {boolean} [obj.autoResize=true] - When true, the textarea will automatically resize to fit its text.
 * @param {number} [rows=2] - Number of horizontal rows
 * @param {number} [cols=20] - Number of vertical columns
 * @returns {HTMLTextAreaElement} - The final Textarea
 */
export function makeTextarea(obj = { value: '', readonly: false, resizable: true, autoResize: true, rows: 2, cols: 20 }) {
	var txtarea = document.createElement("textarea");
	if (obj.value) txtarea.value = obj.value;
	txtarea.readOnly = obj.readonly;
	txtarea.rows = obj.rows;
	txtarea.cols = obj.cols;
	if (!obj.resizable) {
		txtarea.style.resize = 'none';
	}
	if (obj.autoResize) {
		txtarea.addEventListener("input", resizeTxtarea)
		resizeTxtarea(txtarea);
	}
	return txtarea;
}
export function makeButton(text,onclick) {
	var button = document.createElement("button");
	button.innerText = text;
	if (onclick) {
		button.addEventListener("click",onclick);
	}
	return button
}


export function resizeTxtarea(txtarea) {
	if (txtarea instanceof HTMLTextAreaElement) {
		txtarea.style.height = '';
		txtarea.style.height = txtarea.scrollHeight + 'px';
	} else {
		this.style.height = '';
		this.style.height = this.scrollHeight + 'px'
	}
}
export function addTextarea(obj,addTo) {
	var txtarea = makeTextarea(obj);
	addToDoc(txtarea,addTo);
	if (obj.autoResize) {
		resizeTxtarea(txtarea)
	}
}
export function addButton(text,onclick,addTo) {
	addToDoc(makeButton(text, onclick),addTo);
}
export function addNewline(addTo) {
	addToDoc(document.createElement('br'),addTo)
}
export function addToDoc(element, addTo) {
	if (addTo) {
		if (typeof addTo == 'string') {
			document.getElementById(addTo).appendChild(element)
		} else {
			addTo.appendChild(element)
		}
	} else {
		document.body.appendChild(element)
	}
}