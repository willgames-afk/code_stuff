import { log } from "./config.js";

const varTypes = [
	"int",
	"float",
	["String", "str"],
	"Array",
	"Object",
	"function",
]

const keywords = [
	"if",
	"elif",
	"else",
	"const",
	"class"
]
function isKeyword(stringToken) {
	if (stringToken.type == "alphanumeric") {
		for (var i = 0; i < keywords.length; i++) {
			if (stringToken.value === keywords[i]) {
				return true;
			}
		}
	}
	return false;
}

export function parse(tokens) {
	log("PARSING NOW...")

	var ast = {};
	var identifiers = {};

	var currentScope = [];
	function getVarsInScope(scopeList) {
		var out = identifiers;
		for (var i = 0; i < scopeList.length; i++) {
			if (!out[scopeList[i]]) {
				throw "ScopeError: Scope is not defined"
			}
			out = out[scopeList[i]];
		}
		return out;
	}

	function isDefinedIdentifier(stringToken) {
		var vars = Object.keys(getVarsInScope(currentScope));
		for (var i = 0; i < vars.length; i++) {
			if (vars[i] == stringToken.value) {
				return true;
			}
		}
		return false
	}

	var state = "line";
	const states = {
		"line": parseLine, //Despite at this stage there not being any line breaks (haha, sarcastic comments)
		"if": parseIf,
		"elif": parseElseIf,
		"else": parseElse
	}

	var i = 0;
	var token = {};
	function nextToken() {
		i++;
		token = tokens[i];
		return token;
	}
	for (i; i < tokens.length; i++) { //Loosely loop through tokens
		var token = tokens[i]

		log(token, 3)
		states[state](token);
	}

	function parseLine(token) {
		//All lines start with either:
		/*
			A keyword- like `if`
			Or a Declaration (Of a class, function, or variable).
			Declarations start with an optional type (Like `MyClass` or `[int]`)
		*/
		if (token.type == "ob") {
			//Open bracket is array type shortcut in this context, so it's a type
			parseType(token);
			nextToken();
			//I expect the next token after the type to be a currently-undefined var
			if (token.type == "alphanumeric" && !isKeyword(token.value) && !isDefinedIdentifier(token.value)) {
				Cannonononononooooooooooo;
			}
		}
	}
	function parseType() {

	}
	function parseIf(token) {

	}
	function parseElse(token) {

	}
	function parseElseIf(token) {

	}
}