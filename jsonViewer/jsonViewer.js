class EditableObject {
	constructor(parentNode, object, setCallback, style = {

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

	}, propertyName) {
		//console.log(parentNode);
		this.parentNode = parentNode;
		this.value = object;
		this.style = style;

		if (this.value) {
			this.makeObj();
		}
	}
	makeObj() {
		this.container = document.createElement("ul");
		if (Array.isArray(this.value)) { //Use "for (start, end, inc)" instead of "for(in)" for loops
			this.applyStyle(this.container, this.style.array)
			for (var i = 0; i < this.value.length; i++) {

				this.make.bind(this)(i, this.value[i]);
			}
			this.parentNode.appendChild(this.container);
			var edit = document.createElement('div');

			this.parentNode.appendChild(edit);
		} else {
			this.applyStyle(this.container, this.style.object)
			for (var key in this.value) {
				this.make.bind(this)(key, this.value[key]);
			}
			this.parentNode.appendChild(this.container);
			var edit = document.createElement('div');

			this.parentNode.appendChild(edit);
		}
	}
	make(label, value) {
		//Create list element to contain input element
		var li = document.createElement("li");

		//Add Label
		li.appendChild(document.createTextNode(label + ': '));
		if (typeof value == "number") {

			this.makeInput(li, "number", label, value, this.onInput.bind(this), [this.style.allInputs, this.style.number]);

		} else if (typeof value == "boolean") {
			//Use checkboxes for booleans
			this.makeInput(li, "checkbox", label, value, this.onInput.bind(this), [this.style.allInputs, this.style.bool])

		} else if (typeof value == "string") {

			//Surround strings with doublequotes
			li.appendChild(document.createTextNode('"'))
			this.makeInput(li, "text", label, value, this.onInput.bind(this), [this.style.allInputs, this.style.string])
			li.appendChild(document.createTextNode('"'))

		} else if (typeof value == "object") {
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

			if (Array.isArray(value)) {

				//If array, surround in brackets
				li.appendChild(document.createTextNode('['))
				new EditableObject(li, value, this.onInput.bind(this), this.style, label)
				li.appendChild(document.createTextNode(']'))
			} else {

				//Otherwise just a plain old object, surround in curly braces
				li.appendChild(document.createTextNode('{'))
				new EditableObject(li, value, this.onInput.bind(this), this.style, label)
				li.appendChild(document.createTextNode('}'))
			}
		}
		//Add comma for decor
		if (this.style.addComma) {
			li.appendChild(document.createTextNode(','));
		}
		this.container.appendChild(li);
	}

	onInput(e) {
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
				applyStyle(input, s);
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
class JSONEditor extends EditableObject {
	constructor(parentNode, format, setCallback, style) {

		super(parentNode, {}, setCallback, style);
		this.format = format;
		this.container = document.createElement("ul");
		var defaultObj = function check(t) {
			var o = {};
			for (var name in t) { //For every property
				var property = t[name];
				console.log(name, property)
				if (property.type == "object" || property.type == "array") {
					//Recursive dealing with arrays and objects
					o[name] = check.bind(this)(property.content)
				} else {
					if (property.default) {
						//If it has a default, make it
						this.make(name, property.default);
					} else {
						if (!property.type) { //If no type, default to strings.
							this.make(name, "");
						} else if (property.type == "dropdown") { //Dropdowns are special, deal with them seperately.
							var li = document.createElement("li");
							li.appendChild(document.createTextNode(name + ': '));
							li.appendChild(this.makeDropdown(property.options,true,false,0));
							if (this.style.includeComma) {
								li.appendChild(document.createTextNode(","));
							}
							this.container.appendChild(li);
						} else if (property.type == "boolean") {
							this.make(name, false);
						} else if (property.type == "number") {
							this.make(name, 0);
						} else {
							this.make(name, "");
						}
					}
				}
			}
			console.log("Returning", o)
			return o;
		}.bind(this)(this.format.template);
		this.parentNode.appendChild(this.container);
	}
	makeDropdown(options, includeOther = false, multiple = false, preselected = -1) {
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
				b.innerText = '"' + options[i].displayText + '"';
			} else {
				b.innerText = options[i].displayText;
			}
			a.appendChild(b);
		}
		if (includeOther === true) {
			console.dir(a)
			var b = document.createElement('option');
			b.innerText = 'Other';
			a.appendChild(b);
			a.addEventListener("input", function (a, index) {
				return (e) => {
					console.log(a.selectedIndex)
					console.log(index)
					if (a.selectedIndex == index) {
						var i = document.createElement("input");
						i.type = 'text'
						a.insertAdjacentElement('afterEnd', i);
					} else {
						if (a.nextElementSibling) {
							a.parentElement.removeChild(a.nextElementSibling)
						}
					}
				}
			}(a, a.length - 1))
		}
		return a;
	}
}
/*
FormatJSON-
{
	style: { Contains styling info

		includeComma- Boolean; whether to include a comma after each property or not
		allInputs- Object, contains style info applied to all inputs
		number- Object, applyies the contained style info to objects
		string- Same as above but for strings
		list- Same
		object- same
		boolean- same
	} 
	config: { Contains various config
		
	}
	template: {
		property: {
			type- String; boolean, number, string, array, object, or dropdown
			test- Function, should return true if the input is value and false otherwise.
			default- Any value, default property. If object or array, contains this same format!
			IF dropdown, should be an array index refering to the item in options you want 
			to have as a default- will default to first element.
			options: [
				for dropdowns only.
				{ //One object per option
					displayText- text to display on dropdown menu for element
					type- the type of input element to use, if you want.
					test- Function, should return true if the input is value and false otherwise.
					value- can be any value; what to store when the user selects this value.
					if type is defined , the value will be whatever the input element's value is, and 
					this will be the default.
				}
			]
		}
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
		a.addEventListener("input", function (a, index) {
			return (e) => {
				console.log(a.selectedIndex)
				console.log(index)
				if (a.selectedIndex == index) {
					var i = document.createElement("input");
					i.type = 'text'
					a.insertAdjacentElement('afterEnd', i);
				} else {
					a.parentElement.removeChild(a.nextElementSibling)
				}
			}
		}(a, a.length - 1))
	}
	return a;
}