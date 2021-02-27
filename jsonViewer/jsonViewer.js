class EditableObject {
	constructor(parentNode, object, setCallback, formatJSON={
		style: {
			includeComma: true,
			allInputs: {
				backgroundColor: 'transparent',
				color: '#c89175',
				fontFamily: "Menlo, Monaco, 'Source Sans Pro', 'Courier New',monospace",
				border: '0px',
				fontSize: '11.5px',
			},
			number: {
				color: 'palegreen',
			},
		}
	}, propertyName) {
		//console.log(parentNode);
		this.parentNode = parentNode;
		this.value = object;
		this.formatJSON = formatJSON;
		this.style = formatJSON.style;

		function onInput(e) {
			var elem = e.target;
			if (elem.type == "checkbox") {
				//If checkbox, the value is stored in checked property
				this.value[elem.getAttribute("propertyname")] = elem.checked;

			} else if (elem.type == "object") {
				//If array or object, it's from setCallback (another EditableObject); not from raw HTML
				this.value[elem.propertyName] = elem.value;
			} else {
				//Otherwise it's a resizeable element
				this.resizeInput(elem)
				if (elem.type == "number") {
					//Number is stored as a string and must be parsed
					this.value[elem.getAttribute("propertyname")] = parseFloat(elem.value)
				} else {
					//Otherwise, treat as string.
					this.value[elem.getAttribute("propertyname")] = elem.value;
				}
			}
			if (setCallback) {
				setCallback({ //This is a callback to a parent EditableObject or other code that runs on edit.
					target: {
						type: "object",
						propertyName: propertyName,
						value: this.value
					}
				});
			}
		}

		//Create element in which all properties will be enclosed.
		this.container = document.createElement("ul");

		if (Array.isArray(object)) { //Use "for (start, end, inc)" instead of "for(in)" for loops
			this.applyStyle(this.container,this.style.array)
			for (var i = 0; i < this.value.length; i++) {
				make.bind(this)(i, this.value);
			}
			this.parentNode.appendChild(this.container);
			var edit = document.createElement('div');

			this.parentNode.appendChild(edit);
		} else {
			this.applyStyle(this.container,this.style.object)
			for (var key in this.value) {
				make.bind(this)(key, this.value);
			}
			this.parentNode.appendChild(this.container);
			var edit = document.createElement('div');

			this.parentNode.appendChild(edit);
		}

		function make(label, value) {
			//Create list element to contain input element
			var li = document.createElement("li");

			//Add Label
			li.appendChild(document.createTextNode(label + ': '));

			if (typeof value[label] == "number") {

				this.makeInput(li, "number", label, value[label], onInput.bind(this), [this.style.allInputs,this.style.number]);

			} else if (typeof value[label] == "boolean") {
				//Use checkboxes for booleans
				this.makeInput(li, "checkbox", label, value[label], onInput.bind(this), [this.style.allInputs,this.style.bool])

			} else if (typeof value[label] == "string") {

				//Surround strings with doublequotes
				li.appendChild(document.createTextNode('"'))
				this.makeInput(li, "text", label, value[label], onInput.bind(this), [this.style.allInputs,this.style.string])
				li.appendChild(document.createTextNode('"'))

			} else if (typeof value[label] == "object") {
				//If Array or Object, add Show/Hide button
				var showhide = document.createElement('a');

				showhide.href = 'javascript:void(0)';
				var internals = document.createElement('span');
				internals.innerText = "H"
				showhide.appendChild(internals);

				showhide.addEventListener("click", (e) => {
					if (e.target.innerText == "H") {
						e.target.parentElement.parentElement.childNodes[3].style.display = 'none';
						e.target.innerText = "S"
					} else {
						e.target.parentElement.parentElement.childNodes[3].style.display = 'list-item';
						e.target.innerText = "H"
					}
				})

				li.appendChild(showhide);

				if (Array.isArray(value[label])) {

					//If array, surround in brackets
					li.appendChild(document.createTextNode('['))
					new EditableObject(li, value[label], onInput.bind(this), this.formatJSON, label)
					li.appendChild(document.createTextNode(']'))
				} else {

					//Otherwise just a plain old object, surround in curly braces
					li.appendChild(document.createTextNode('{'))
					new EditableObject(li, value[label], onInput.bind(this), this.formatJSON, label)
					li.appendChild(document.createTextNode('}'))
				}
			}
			//Add comma for decor
			if (this.style.addComma) {
				li.appendChild(document.createTextNode(','));
			}
			this.container.appendChild(li);
		}
	}
	makeInput(parentNode, type, propertyName, value, onInput, style) {
		function applyStyle(element, style) {
			for (var s in style) {
				element.style[s] = style[s];
			}
		}
		//Creates an input element
		var input = document.createElement("input");
		input.type = type;
		if (input.type == "checkbox") { //Set up initial value
			input.checked = value;
		} else {
			input.value = value;
		}
		if (style) {
			for (var s of style) {
				applyStyle(input,s);
			}
		}
		input.setAttribute("propertyname", propertyName)// The corrosponding property in the object
		input.addEventListener("input", onInput); //Callback for editing purposes
		parentNode.appendChild(input); //Add the element
		this.resizeInput(input); //Resize if necessary
	}
	resizeInput(input) {
		//input.style.width = '1em';
		//console.dir(input)
		if (input.value.length > 0) {
			input.size = input.value.length;
		}
		//input.style.width = input.value + 'em'
	}
	remove() {
		//Deletes the HTML of the object
		this.parentNode.removeChild(this.container);
		
	}
	applyStyle(element, style) {
        for (var s in style) {
            element.style[s] = style[s];
        }
    }
}
/*
FormatJSON-
{
	style: {

	} 
}


*/



function makeDropdown(options, includeOther = false, multiple = false, preselected = -1) {
	var a = document.createElement('select');
	if (multiple === true) {
		a.multiple = true;
	}
	for (i = 0; i < options.length; i++) {
		var b = document.createElement('option');
		if (i == preselected) {
			b.selected = true;
		}
		//b.value = options[i];
		if (typeof options[i] == 'string') {
			b.innerText = '"' + options[i] + '"';
		} else {
			b.innerText = options[i];
		}
		a.appendChild(b);
	}
	if (includeOther === true) {
		console.dir(a)
		var b = document.createElement('option');
		b.innerText = 'Other';
		a.appendChild(b);
		a.addEventListener("input", function (a,index) {
			return (e) => {
				console.log(a.selectedIndex)
				console.log(index)
				if (a.selectedIndex == index) {
					var i = document.createElement("input");
					i.type = 'text'
					a.insertAdjacentElement('afterEnd',i);
				} else {
					a.parentElement.removeChild(a.nextElementSibling)
				}
			}
		}(a,a.length-1))
	}
	return a;
}