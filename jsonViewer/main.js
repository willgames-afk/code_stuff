class EditableObject {
	constructor(parentNode, object, setCallback, propertyName) {
		console.log(parentNode);
		this.parentNode = parentNode;
		this.value = object;

		function onInput(e) {
			var elem = e.value;
			if (elem.type == "checkbox") {
				this.value[elem.getAttribute("propertyname")] = elem.checked;
			} else if (elem.type == "object") {
				this.value[elem.propertyName] = elem.value;
			} else {
				this.resizeInput(elem)
				if (elem.type == "number") {
					this.value[elem.getAttribute("propertyname")] = parseFloat(elem.value)
				} else {
					this.value[elem.getAttribute("propertyname")] = elem.value;
				}
			}
			if (setCallback) {
				setCallback({
					value: {
						type: "object",
						propertyName: propertyName,
						value: this.value
					}
				});
			} else {
				console.log(this.value)
			}
		}
		function makeElem(e) {

		}

		this.container = document.createElement("ul");
		if (Array.isArray(object)) {
			for (var i = 0; i < this.value.length; i++) {
				make.bind(this)(i, this.value);
			}
			this.parentNode.appendChild(this.container);
			var edit = document.createElement('div');

			this.parentNode.appendChild(edit);
		} else {
			for (var key in this.value) {
				make.bind(this)(key, this.value);
			}
			this.parentNode.appendChild(this.container);
			var edit = document.createElement('div');

			this.parentNode.appendChild(edit);
		}
		function make(label, value) {
			var li = document.createElement("li");
			li.appendChild(document.createTextNode(label + ': '))
			if (typeof value[label] == "number") {

				this.makeInput(li, "number", label, value[label], onInput.bind(this));

			} else if (typeof value[label] == "boolean") {

				this.makeInput(li, "checkbox", label, value[label], onInput.bind(this))

			} else if (typeof value[label] == "string") {
				li.appendChild(document.createTextNode('"'))
				this.makeInput(li, "text", label, value[label], onInput.bind(this))
				li.appendChild(document.createTextNode('"'))

			} else if (typeof value[label] == "object") {
				var showhide = document.createElement('a');
				showhide.href = 'javascript:void(0)';
				var internals = document.createElement('span');
				internals.innerText = "H"
				showhide.appendChild(internals);
				showhide.addEventListener("click", (e) => {
					console.dir(e.target.parentElement.parentElement.childNodes[4])
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
					li.appendChild(document.createTextNode('['))
					new EditableObject(li, value[label], onInput.bind(this), label)
					li.appendChild(document.createTextNode(']'))
				} else {
					li.appendChild(document.createTextNode('{'))
					new EditableObject(li, value[label], onInput.bind(this), label)
					li.appendChild(document.createTextNode('}'))
				}
			}
			li.appendChild(document.createTextNode(','))
			this.container.appendChild(li);
		}
	}
	makeInput(parentNode, type, propertyName, value, onInput) {
		var input = document.createElement("input");
		input.type = type;
		if (input.type == "checkbox") {
			input.checked = value;
		} else {
			input.value = value;
		}
		input.setAttribute("propertyname", propertyName)
		input.addEventListener("input", onInput);
		parentNode.appendChild(input);
		this.resizeInput(input);
	}
	resizeInput(input) {
		//input.style.width = '1em';
		console.dir(input)
		if (input.value.length > 0) {
			input.size = input.value.length;
		}
		//input.style.width = input.value + 'em'
	}
}
window.addEventListener("load", (e) => {
	var test = new EditableObject(document.getElementById("test"), {
		string: "This is a test string.",
		number: 9001,
		boolean: true,
		test: "This test was successful!",
		object: {
			string: "This is a test string inside a second object",
			number: 9002,
			boolean: true,
		},
		list: [
			"Feesh",
			"Cat Food",
			"Po. Ta. Toes.",
			"And thus concludes my list!"
		]
	})
	var testThing = makeDropdown([
		"Nearest Player",
		"Random Player",
		"All Players",
		"Entity running the command",
		"A Player Name"
	], true)

	document.body.appendChild(testThing)
})
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