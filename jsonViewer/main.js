import { JSONEditor,EditableObject } from "./jsonViewer.js";

var makeGiveCommand = {
	template: {
		name: "Test",
		connections: [
			"0"
		]
	}
}

window.addEventListener("load", (e) => {
	var mainBox = document.getElementsByClassName("mainbox")[0];

	window.test = new EditableObject(mainBox, {
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
	}, ()=>{console.log(window.test.value)})

	var deleteButton = document.createElement("button");
	deleteButton.addEventListener("click", function (e) {
		if (test) {
			test.remove();
			test = null;
		}
	}.bind(this))
	mainBox.appendChild(deleteButton);

	var testThing = JSONEditor.makeDropdown([
		"Nearest Player",
		"Random Player",
		"All Players",
		"Entity running the command",
		"A Player Name"
	], test.style.allInputs, true)

	mainBox.appendChild(testThing)


	var anotherTest = document.createElement("div");
	mainBox.appendChild(anotherTest);
	var editor = new JSONEditor(anotherTest, makeGiveCommand);


})