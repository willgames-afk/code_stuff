import { log } from "./config.js";

const varTypes = [
	"int",
	"float",
	["String", "str"],
	"Array",
	"Object"
]

export function parse(tokens) {
	log("PARSING NOW...")

	var identifiers = {};
	var state = "line";

	for (var i = 0; i < tokens.length; i++) { //Loosely loop through tokens
		function getNext() { i++; return tokens[i] };

		var t = getNext();
		log(t, 3)

		states[state]();
	}
}

const states = {
	"line": parseLine, //Despite at this stage there not being any line breaks (haha, sarcastic comments)
}

function parseLine() {
	//Statements all start with EITHER:
	/*
		A keyword- like typeof
		An Identifier- like myVar
		or a Type- like [Vector] or Array
	*/
}