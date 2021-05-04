export class EditableObject {
	static defaultStyle = {
		includeComma: true,
		allInputs: {
			backgroundColor: 'transparent',
			color: '#c89175',
			fontFamily: "Menlo, Monaco, 'Source Sans Pro', 'Courier New',monospace",
			border: '0px',
			fontSize: '11.5px'
		},
		labels: {
			fontFamily: "Menlo, Monaco, 'Source Sans Pro', 'Courier New',monospace",
			color: "#95C4E2",
			fontSize: "11.5px"
		},
		number: {
			color: 'palegreen',
		}
	}
	constructor(parentNode, object, setCallback = () => { }, style = EditableObject.defaultStyle, propertyName) {
		this.parentNode = parentNode;
		this.value = object;
		this.style = style;
		this.setCallback = setCallback;
		this.propertyName = propertyName;
		this.applyStyle = EditableObject.applyStyle

		if (this.value) {
			this.makeObj();
		}
	}
	makeObj() {
		//Create container for obj
		this.container = document.createElement("ul");
		if (this.propertyName) {
			this.container.setAttribute("propertyname", this.propertyName);
		}
		this.applyStyle(this.container, this.style.labels);

		//iterate and number array, loop with in for objs.
		if (Array.isArray(this.value)) {

			this.applyStyle(this.container, this.style.array);
			for (var i = 0; i < this.value.length; i++) {

				this.container.appendChild(this.make.bind(this)(i, this.value[i]));
			}
		} else {
			this.applyStyle(this.container, this.style.object);
			for (var key in this.value) {
				this.container.appendChild(this.make.bind(this)(key, this.value[key]));
			}
		}

		//Element editing for arrays and objs.

		var edit = document.createElement('div'); //Container
		edit.setAttribute("class", "editObj");
	
		var addElement = document.createElement("button"); //Add Element button
		addElement.innerHTML = "+";
		addElement.style.padding = "3px";
		addElement.style.fontSize = "11.5px";
		addElement.addEventListener("click", ((c, make, edit) => {
			return () => {
				this.container.insertBefore(make("idk", ""), edit)
			}
		})(this.container, this.make.bind(this), edit))
		edit.appendChild(addElement);

		this.container.appendChild(edit);

		this.parentNode.appendChild(this.container);
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

			li.appendChild(document.createTextNode(`"`));
			this.makeInput(li, "text", label, value, this.onInput.bind(this), [this.style.allInputs, this.style.string])
			li.appendChild(document.createTextNode(`"`));

		} else if (typeof value == "object") {

			//If Array or Object, add Show/Hide button
			var showhide = document.createElement('a'); //Show/Hide button; link so it looks clickable
			var placeHolder = document.createElement('div'); //Placeholder (...); 
			placeHolder.style.display = "none";
			placeHolder.innerHTML = "&#8230"


			showhide.href = "javascript:void(0);"      //Don't actually redirect
			showhide.innerText = "H";  //Start showing with option to hide

			showhide.setAttribute("class", "showhide");

			showhide.addEventListener("click", (e) => {
				console.log(e.target)
				if (e.target.innerText == "H") {
					e.target.parentElement.childNodes[3].style.display = 'inline';
					e.target.parentElement.childNodes[4].style.display = 'none';
					e.target.innerText = "S"
				} else {
					e.target.parentElement.childNodes[3].style.display = 'none';
					e.target.parentElement.childNodes[4].style.display = 'list-item';
					e.target.innerText = "H"
				}
			})

			li.appendChild(showhide);

			if (Array.isArray(value)) {
				//If array, surround in brackets
				li.appendChild(document.createTextNode('['))
				li.appendChild(placeHolder);
				new EditableObject(li, value, this.setValue.bind(this), this.style, label)
				li.appendChild(document.createTextNode(']'))
			} else {

				//Otherwise just a plain old object, surround in curly braces
				li.appendChild(document.createTextNode('{'))
				li.appendChild(placeHolder);
				new EditableObject(li, value, this.setValue.bind(this), this.style, label)
				li.appendChild(document.createTextNode('}'))
			}
		}
		//Add comma for decor
		if (this.style.includeComma) {
			li.appendChild(document.createTextNode(','));
		}
		return li;
	}
	onInput(e) { //Used for getting input from HTML input elements
		console.log(e)
		var elem = e.target;
		if (elem.type == "checkbox") {

			//If checkbox, the value is stored in checked property
			this.value[elem.getAttribute("propertyname")] = elem.checked;

		} else {

			//Otherwise it's a resizeable element
			this.resizeInput(elem);
			if (elem.type == "number") {

				//Number is stored as a string and must be parsed
				this.value[elem.getAttribute("propertyname")] = parseFloat(elem.value)
			} else {

				//Otherwise, treat as string.
				this.value[elem.getAttribute("propertyname")] = elem.value;
			}
		}
		if (this.setCallback) {

			//Means it's a child object
			this.setCallback(this.propertyName, this.value)

		}
	}
	setValue(propertyName, value) { //Used for passing updated values back to objects from subobjects.
		this.value[propertyName] = value;
		if (this.setCallback) {
			if (this.propertyName) {
				//Means it's a child object
				this.setCallback(this.propertyName, this.value)
			} else {
				this.setCallback(this.value)
			}
		}
	}
	makeInput(parentNode, type, propertyName, value, onInput, style, useParentnode = true) {
		//Creates an input element
		var input = document.createElement("input");
		input.type = type;
		if (input.type == "checkbox") { //Set up initial value
			input.checked = value;
		} else {
			input.value = value;
		}
		if (style) {

			this.applyStyle(input, style);

		}
		input.setAttribute("propertyname", propertyName)// The corrosponding property in the object
		input.addEventListener("input", onInput.bind(this)); //Callback for editing purposes
		if (useParentnode) { parentNode.appendChild(input) }; //Add the element
		this.resizeInput(input); //Resize if necessary
		return input
	}
	remove() {
		//Deletes the HTML of the object
		this.parentNode.removeChild(this.container);

	}
	static applyStyle(element, style) {
		console.log(style)
		if (Array.isArray(style)) {
			for (var i = 0; i < style.length; i++) {
				if (style[i]) {
					for (var s in style[i]) {
						if (style[i][s]) {
							element.style[s] = style[i][s];
						}
					}
				}
			}
		} else {
			for (var s in style) {
				if (style[s]) {
					element.style[s] = style[s];
				}
			}
		}
	}
	resizeInput(input) {
		if (input.value.length > 0) {
			input.size = input.value.length;
		}
	}
}
export class JSONEditor extends EditableObject {
	constructor(parentNode, format, setCallback = () => { }, style) {
		super(parentNode, {}, setCallback, style);
		console.log(this.style)
		this.format = format;

		this.container = document.createElement("ul");
		this.applyStyle(this.container, this.style.labels);

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
						this.container.appendChild(this.make(name, property.default));
					} else {
						if (!property.type) { //If no type, default to strings.

							this.container.appendChild(this.make(name, ""));

						} else if (property.type == "dropdown") { //Dropdowns are special, deal with them seperately.

							var li = document.createElement("li");
							//Make label
							li.appendChild(document.createTextNode(name + ': '));
							//Make dropdown
							li.appendChild(this.makeDropdown(property.options, [this.style.string, this.style.dropdown], false, false, 0));

							//If items have commas after, add them
							if (this.style.includeComma) {
								li.appendChild(document.createTextNode(","));
							}
							this.container.appendChild(li);
						} else if (property.type == "boolean") {
							this.container.appendChild(this.make(name, false));
						} else if (property.type == "number") {
							this.container.appendChild(this.make(name, 0));
						} else {
							this.container.appendChild(this.make(name, ""));
						}
					}
				}
			}
			console.log("Returning", o)
			return o;
		}.bind(this)(this.format.template);
		this.parentNode.appendChild(this.container);
	}
	static makeDropdown(options, style, includeOther = false, multiple = false, preselected = -1, propertyName, onEdit) {
		//Create selector element
		var a = document.createElement('select');
		if (style) {
			EditableObject.applyStyle(a, style);
		} else {
			const style = EditableObject.defaultStyle
			EditableObject.applyStyle(a, [style.allInputs, style.string])
		}

		//Allow multiple selections if available
		if (multiple === true) {
			ksf
			a.multiple = true;
		}

		//Iterate through options
		for (var i = 0; i < options.length; i++) {

			//Create option element
			var b = document.createElement('option');

			//Select it if necesary
			if (i == preselected) {
				b.selected = true;
			}

			//Strings should be surrounded by quotes
			if (typeof options[i] == 'string') {
				b.innerText = '"' + options[i] + '"';
			} else {
				b.innerText = options[i].displayText;
				if (options[i].type) {
					console.log(`${options[i].displayText} HAS TYPE`)
					a.addEventListener("input", function (i) {
						return function (e) {
							console.log("Selected Index: ", a.selectedIndex)
							console.log("Index: ", i)
							console.log(`"This: "`, this)
							if (a.selectedIndex == i) {
								a.insertAdjacentElement('afterEnd', this.makeInput(a.parentElement, this.lookup[options[i].type], propertyName, options[i].value, onEdit, [this.style.allInputs, this.style[options[i].type]], false));
							}
						}.bind(this);
					}.bind(this)(i))
				}
			}
			a.appendChild(b);
		}

		//If includeOther, then add "other" input box
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
	lookup = {
		"string": "text",
		"number": "number",
		"bool": "checkbox",
	}
}
/* FormatJSON-
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