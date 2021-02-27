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
	var deleteButton = document.createElement("button");
	deleteButton.addEventListener("click", function (e){
		if (test) {
			test.remove();
			test = null;
		}
	}.bind(this))
	document.getElementById("test").appendChild(deleteButton)

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