var makeGiveCommand = {
	template: {
		"Target Selectors": {
			type: "object",
			content: {
				Target: {
					type: "dropdown",
					options: [
						{
							displayText: "Nearest Player",
							value: "@p"
						},
						{
							displayText: "Random Player",
							value: "@r"
						},
						{
							displayText: "All Players",
							value: "@a"
						},
						{
							displayText: "Current Entity",
							value: "@s"
						},
						{
							displayText: "Player Name",
							type: "number",
							value: 0,
						},
					]
				},
				Limit: {
					type: "number"
				},
				Sort: {
					type: "dropdown",
					default: 0,
					options: [
						{
							displayText: "unset",
							value: " "
						},
						{
							displayText: "nearest",
							value: "[sort=nearest] "
						},
						{
							displayText: "furthest",
							value: "[sort=furthest] "
						},
						{
							displayText: "random",
							value: "[sort=random] "
						},
						{
							displayText: "arbitrary",
							value: "[sort=arbitrary] "
						}
					]
				},
				X: {
					type: "number"
				},
				Y: {
					type: "number"
				},
				Z: {
					type: "number"
				},

			}
		},
		"GiveItem": {
			type: "object",
			content: {
				Item: {
					type: "dropdown",
					options: [
						{
							displayText: "Cobblestone",
							value: "cobblestone"
						},
						{
							displayText: "Iron Ore",
							value: "iron_ore"
						},
						{
							displayText: "Iron Block",
							value: "iron_block"
						},
					]
				},
				Name: {
					type: "string",
				}
			}
		}
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
	var deleteButton = document.createElement("button");
	deleteButton.addEventListener("click", function (e) {
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


	var anotherTest = document.createElement("div");
	document.body.appendChild(anotherTest);
	var editor = new JSONEditor(anotherTest, makeGiveCommand);
	console.log(editor)
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
		
			b.innerText = options[i];
		
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