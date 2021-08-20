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
function Input(input, oninput = () => { }) { //DOM wierdness prevents this from being a proper constructor
	input.addEventListener('input', (e) => {
		if (e.target.checked === undefined) {
			e.target.style.width == e.target.value.length + "ch";
			oninput(this.value);
		} else {
			oninput(e.target.checked);
		}
	})
	return input;
}

class NumberInput extends Input {
	constructor(value, label, oninput) {
		var ie = document.createElement("input");
		ie.type = "number";
		ie.value = value;
		ie.size =  ie.value.length + 3;
		ie.className = "number"
		ie.addEventListener("input", ()=>{
			console.log(ie.size)
			ie.size =  ie.value.length;
		}); 
		super(ie, label, oninput);
	}
}
class StringInput extends Input {
	constructor(value, label, oninput) {
		var ie = document.createElement("input");
		ie.type = "text";
		ie.value = value;
		ie.size =  ie.value.length;
		ie.className = "string"
		ie.addEventListener("input", ()=>{
			console.log(ie.size)
			ie.size =  ie.value.length;
		}); 
		super(ie, label, oninput);
	}
}
class BooleanInput extends Input {
	constructor(value, label, oninput) {
		var ie = document.createElement("input");
		ie.type = "checkbox";
		ie.checked = value;
		ie.className = "bool"
		super(ie, label, oninput);
	}
}
function EditableObjectArray(object, onEdit = () => { }) {
	var html = document.createElement("ul");
	html.className = "list";

	var sh = document.createElement("a");
	sh.href = "javascript:void(0);";
	sh.className = "showhide";
	sh.innerText = "H"

	html.appendChild(sh)
	if (Array.isArray(object)) {
		html.appendChild(document.createTextNode("["))
	} else {
		html.appendChild(document.createTextNode("{"))
	}

	var hidden = document.createElement("div");
	hidden.innerText = "...";
	hidden.hidden = true;
	hidden.className = "hidden"
	html.appendChild(hidden);

	var content = document.createElement("ul");
	html.appendChild(content);

	function bindEditCallback(index) {
		return function (value) {
			object[index] = value;
			onEdit(object);
		}.bind(object);
	}
	var ne;
	for (var i in object) { //Create all required content inputs
		if (ne) {
			ne.appendChild(document.createTextNode(",")); //Adding comma to previous element, if any
		}

		ne = document.createElement("li");

		ne.appendChild(document.createTextNode(i + ":"))


		if (typeof object[i] == "number") {
			ne.appendChild(new NumberInput(object[i], bindEditCallback(i))) //Create ne (new element)

		} else if (typeof object[i] == "string") {
			var str = document.createElement("span");
			str.className = "stringContainer"
			str.appendChild(document.createTextNode(' "'));
			str.appendChild(new StringInput(object[i], bindEditCallback(i)))
			str.appendChild(document.createTextNode('"'));
			ne.appendChild(str);

		} else if (typeof object[i] == "boolean") {
			ne.appendChild(new BooleanInput(object[i], bindEditCallback(i)))

		} else if (typeof object[i] == "object") {
			ne.appendChild(new EditableObjectArray(object[i], bindEditCallback(i)))
		}

		content.appendChild(ne) //Add new element to DOM
	}

	sh.addEventListener("click", ((hidden, content, sh) => { //Show/hide 
		console.log(content)
		return function () {
			if (hidden.hidden) {
				hidden.hidden = false;
				content.hidden = true;
				sh.innerText = "S"
			} else {
				hidden.hidden = true;
				content.hidden = false;
				sh.innerText = "H"
			}
		}
	})(hidden, content, sh))

	if (Array.isArray(object)) {
		html.appendChild(document.createTextNode("]"))
	} else {
		html.appendChild(document.createTextNode("}"))
	}

	return html
}

class JSONViewer {
	constructor(thing, options={onEdit:()=>{}}) {
		this.value = thing;

		this.html = document.createElement("div");
		this.html.className = "JSONViewer"



		this.html.appendChild(EditableObjectArray(thing, options.onEdit));
	}
}

document.body.appendChild(new JSONViewer([1, "hi", false, [3.14159, "Pi is the best number", true], { key: "value", "Pairs and things": "good" }]).html)