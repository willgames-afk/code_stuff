import {requestFile, addButton, addNewline, makeTextarea, addToDoc, resizeTxtarea} from "./modules/helpers.js";
import {lexer,parse} from "./modules/parser.js"
var input,output
requestFile("./testProgram.tgl", endLoad);

function endLoad(e) {
	//Get rid of loading box
	document.getElementById("loadingMessage").style.display = "none";
	console.log(e.target.responseText);

	input = makeTextarea({
		value: e.target.responseText,
		autoResize: true
	});
	addToDoc(input, 'mainbox');
	resizeTxtarea(input);

	addNewline('mainbox');

	addButton("Compile",run,'mainbox');

	addNewline('mainbox');

	output = makeTextarea({
		autoResize:true,
		readonly:true
	})
	addToDoc(output, 'mainbox');
	resizeTxtarea(output);
}

function run() {
	output.value = JSON.stringify(parse(lexer(input.value)), null,'\n	');
	resizeTxtarea(output);
	noms.resize();
}