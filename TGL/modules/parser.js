import * as TGL from './classes.js'

//Splitters are characters that split a token
const splitters = /[ 	\n"'`{}()[\]:;.=+-/*]/ //note that this starts with space tab, not just 2 spaces

//Possible character leximes- see getType
const leximes = [
	["quote", /'/], ["dbquote", /"/], ["backquote", /`/],
	["oc", /{/], ["cc", /}/],
	["ob", /\[/], ["cb", /\]/],
	["oPar", /\(/], ["cPar", /\)/],
	["colon", /:/], ["semicolon", /;/],
	["dot", /\./],          //Will try to match things listed higher first; so it'll match 'dot' before 'number' alphanum
	["equals", /=/],
	["operator", /[*+\-/<=>]/],
	["number", /[\d.]/],
	["alphanumeric", /[\w@]/], //It will also try to match the longest possible string on that type.
	["whitespace", /[ 	\n]/]
];


/** Figures out what k */
function getType(char, bufferType) {
	var lexime = leximes.find(e => e[0] == bufferType)
	if (lexime && lexime[1].test(char)) {
	//	console.log(`Quickfound; ${lexime[0]}`, 3)
		return bufferType;
	}
	for (const kv of leximes) {
		const key = kv[0];
		const value = kv[1];
		if (value.test(char)) {
		//	console.log(`"${char}" is "${key}" (${value})`, 3)
			return key;
		}
	}
	/*if (splitters.test(char)) {
		return; //Return nothing, it's just a splitter
	}*/

	//If we've gotten to here, it doesn't fit into any of our categories and therefore is illegal
	return "error";
}

export function lex(string) {
	console.log("Lex Started...");

	let out = [];

	let buffer = '';     // Chars are assembled into tokens here
	let bufferType = ''; // Type of token in buffer

	var stringMode = false;  //Whether we're in a string or not
	var stringDelimiter = '';// ` " or '; whatever ends this string

	for (var i = 0; i < string.length; i++) {

		//Get character
		var char = string[i];
		var type = getType(char, bufferType);

		if (stringMode) {
			if (type == stringDelimiter) {
				out.push({ type: "string", value: buffer });
				buffer = '';
				stringDelimiter = '';
				stringMode = false;
			} else {
				buffer += char;
			}
		} else {
			if (type == "error") {
				throw `LexError: Invalid Token at ${i}: \`${char}\``
			}

			if (type == "quote" || type == "dbquote" || type == "backquote") {
				//console.log("StringMode!")
				stringMode = true;
				stringDelimiter = type;
				if (buffer.length > 0) {

					out.push({ type: bufferType, value: buffer });
					buffer = '';
					bufferType = '';

				}
				continue; //Skip everything below and enter string mode
			}
			if (splitters.test(char)) {
				if (buffer.length > 0) {

					out.push({ type: bufferType, value: buffer });
					buffer = '';
					bufferType = '';

				}
				if (type != "whitespace") {
					out.push({ type: type });
				}
			} else {
				if (buffer.length == 0) {
					bufferType = type;
				}
				buffer += char;
			}
		}
	}
	if (buffer.length > 0) {
		out.push({ type: bufferType, value: buffer })
		buffer = ''; //Clear it just for good measure
		bufferType = '';
	}
	out.push({ type: 'EOF' });

	console.log("Lex Complete!")

	return out;
}

const constructors = {
	"text": [
		"p",
		"h1",
		"h2",
		"h2",
		"h4",
		"h5",
		"h6"
	],
	"button": {},
	"container": {}
}

function hasProperty(object, property) {
	if (Array.isArray(object)) {
		if (object.includes(property)) {
			return true;
		}
	} else {
		if (object[property] !== undefined) {
			return true;
		}
	}
	return false;
}

function validTreePath(path, tree) {
	console.log(path)
	var o = tree;
	for (var i = 0; i < path.length; i++) {
		if (!hasProperty(o, path[i])) {
			return false;
		}
		o = o[path[i]];
	}
	return true;
}

function resolveTreePath(path, tree) {
	var o = tree;
	for(var i=0;i<path.length;i++) {
		o = o[path[i]];
	}
	return o;
}

function assert(condition, failmessage) {
	if (condition) {
		return true;
	}
	throw failmessage;
}

function isSubTGL() {
	//Implement this
}

export function parse(tokens) {
	var AST = [];
	var i = -1;
	var token = {};

	const isValid = {
		text: ()=>{return token.type == "string"},
		button: ()=>{return token.type == "string" || isSubTGL()},
		container: ()=>{return isSubTGL();}
	}

	function validateElementContent(path) {
		var va = isValid;
		var i = 0;
		while (true) {
			if (va[path[i]]) {
				va = va[path[i]];
				i++;
			} else {
				break;
			}
		}
		assert(va());
		console.log("valid element content")
		return true;
	}

	function nextToken() {
		i++;
		token = tokens[i];
		console.log(token)
		return token;
	}

	function prevToken() {
		i--;
		token = tokens[i];
		console.log("Reversed to " + JSON.stringify(token))
		return token;
	}

	function tokenIsConstructor() {
		assert(token.type == "alphanumeric", "SyntaxError: Expected element constructor.");
		var expected = "alphanumeric";
		var treepath = [];
		while (token.type == expected) {
			console.log(token.type, expected)
			if (expected == "alphanumeric") {
				treepath.push(token.value);
				expected = "dot";
				nextToken();
			} else if (expected == "dot") {
				expected = "alphanumeric";
				nextToken();
			}
			console.log(token.type, expected)
		}
		assert(validTreePath(treepath, constructors),"Invalid element.")
		console.log("valid element constructor name");
		//nextToken();
		assert(token.type == "oPar", "SyntaxError: Expected open parenthesis.");
		nextToken();
		assert(validateElementContent(treepath));
		nextToken();
		assert(token.type == "cPar", "SyntaxError: Expected closing parenthesis.")
		nextToken();
		if (token.type == "oc") {
			//Validate style/property information
			console.log("valid element style");
		} 

		console.log("valid element!")
		return true;
	}

	nextToken();
	for (i; i < tokens.length;) { //Loosely loop through tokens
		assert(tokenIsConstructor());
		nextToken();
	}
	return AST
}