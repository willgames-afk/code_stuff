class ViewJSON {
	constructor(parentNode, object, setCallback, propertyName) {
		console.log(parentNode);
		this.parentNode = parentNode;
		this.value = object;

		function onInput(e) {
			var elem = e.srcElement;
			if (elem.type == "checkbox") {
				this.value[elem.getAttribute("propertyname")] = elem.checked;
			} else if (elem.type == "object") {
				this.value[elem.propertyName] = elem.value;
			}else {
				this.resizeInput(elem)
				if (elem.type == "number") {
					this.value[elem.getAttribute("propertyname")] = parseFloat(elem.value)
				}  else {
					this.value[elem.getAttribute("propertyname")] = elem.value;
				}
			}
			if (setCallback) {
				setCallback({
					srcElement: {
						type: "object",
						propertyName: propertyName,
						value: this.value
					}
				});
			} else {
				console.log(this.value)
			}
		}
		if (Array.isArray(object)) {
			this.container = document.createElement("ul");
			this.container.start = 0;
			this.parentNode.appendChild(this.container);

			for (var i = 0; i < this.value.length; i++) {
				var li = document.createElement("li");
				li.appendChild(document.createTextNode(i + ': '))
				if (typeof this.value[i] == "number") {

					this.makeInput(li, "number", i, this.value[i], onInput.bind(this));

				} else if (typeof this.value[key] == "boolean") {

					this.makeInput(li, "checkbox", i, this.value[i], onInput.bind(this))

				} else if (typeof this.value[i] == "string") {

					this.makeInput(li, "text", i, this.value[i], onInput.bind(this))

				} else if (typeof this.value[i] == "object") {

					new ViewObject(li, this.value[i], onInput.bind(this), i)

				}
				this.container.appendChild(li);
			}
		} else {
			this.container = document.createElement("ul");
			this.parentNode.appendChild(this.container);
			for (var key in this.value) {
				var li = document.createElement("li");
				li.appendChild(document.createTextNode(key + ': '))
				if (typeof this.value[key] == "number") {

					this.makeInput(li, "number", key, this.value[key], onInput.bind(this));

				} else if (typeof this.value[key] == "boolean") {

					this.makeInput(li, "checkbox", key, this.value[key], onInput.bind(this))

				} else if (typeof this.value[key] == "string") {

					this.makeInput(li, "text", key, this.value[key], onInput.bind(this))

				} else if (typeof this.value[key] == "object") {

					new ViewJSON(li, this.value[key], onInput.bind(this), key)

				}
				this.container.appendChild(li);
			}
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
		if (input.value.length > 0) {
			input.size = input.value.length;
		}
		//input.style.width = input.value + 'em'
	}
}
window.addEventListener("load", (e) => {
	var test = new ViewJSON(document.getElementById("test"), {
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
})