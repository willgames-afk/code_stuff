import { log } from "./config.js";

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
	["alphanumeric", /\w/], //It will also try to match the longest possible string on that type.
];

//Splitters are characters that split a token
const splitters = /[ 	\n"'`{}()[\]:;.=+-/*]/ //note that this starts with space tab, not just 2 spaces

/** Figures out what k */
function getType(char) {
	var lexime = leximes.find(e => e[0] == bufferType)
	if (lexime && lexime[1].test(char)) {
		log(`Quickfound; ${lexime[0]}`, 3)
		return bufferType;
	}
	for (const kv of leximes) {
		const key = kv[0];
		const value = kv[1];
		if (value.test(char)) {
			log(`"${char}" is "${key}" (${value})`, 3)
			return key;
		}
	}
	//If we've gotten to here, it doesn't fit into any of our categories and therefore is illegal
	return "error";
}

export function lexer(string) {
	log("Lex Started...");

	let out = [];

	let buffer = '';     // Chars are assembled into tokens here
	let bufferType = ''; // Type of token in buffer

	var stringMode = false;  //Whether we're in a string or not
	var stringDelimiter = '';// ` " or '; whatever ends this string

	for (var i = 0; i < string.length; i++) {

		//Get character
		var char = string[i];
        var type = getType(char);
        
        if (type == "error") {
            throw "LexError: Invalid Token"
        }

		if (stringMode) {
			if (type == stringDelimiter) {
				out.push( {type: "string", value: buffer});
				buffer = '';
				stringDelimiter = '';
				stringMode = false;
			} else {
				buffer += char;
			}
		} else {
			if (type == "quote" || type== "dbquote" || type == "backquote") {
				stringMode = true;
				stringDelimiter = type;
				if (buffer.length > 0) {

					out.push( { type: bufferType, value: buffer });
					buffer = '';
					bufferType = '';

				}
				continue; //Skip everything below and enter string mode
			}
			if (splitters.test(char)) {

				if (buffer.length > 0) {

					out.push( { type: bufferType, value: buffer });
					buffer = '';
					bufferType = '';

				}
				if (type != undefined) {
					out.push( { type: type });
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
		out.push( { type: bufferType, value: buffer })
		buffer = ''; //Clear it just for good measure
		bufferType = '';
	}
	out.push({ type: 'EOF' });

	console.log("Lex Complete!")

	return out;
}