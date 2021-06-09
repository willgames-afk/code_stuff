import * as TGL from './classes.js'

export function* lexer(string) {
	function getType(char) {
		var lexime = leximes.find(e => e[0] == bufferType)
		if (lexime && lexime[1].test(char)) {
			//console.log(`Quickfound; ${lexime[0]}`)
			return bufferType;
		}
		for (const kv of leximes) {
			const key = kv[0];
			const value = kv[1];
			if (value.test(char)) {
				//onsole.log(`"${char}" is "${key}" (${value})`)
				return key;
			}
        }
        //If we've gotten to here, we have an invalid token on our hands
        return "error";
	}
	var leximes = [
		["quote", /'/], ["dbquote", /"/], ["backquote", /`/],
		["oc", /{/], ["cc", /}/],
		["ob", /\[/], ["cb", /\]/],
		["oPar", /\(/], ["cPar", /\)/],
		["colon", /:/], ["semicolon", /;/],
		["dot", /\./], //Will try to match things listed higher first; so it'll match 'dot' before 'number' alphanum
		["equals", /=/],
		["operator", /[*+\-/<=>]/],
		["number", /[\d.]/],
		["alphanumeric", /\w/], //It will also try to match the longest possible string on that type.
	]

	var splitters = /[ 	\n"'`{}()[\]:;.=+-/*]/ //note that this starts with space tab, not just 2 spaces
	//Splitters are characters that split a token.

	var buffer = '';
	var bufferType = '';
	var stringMode = false;
	var stringDelimiter = '';
	for (var i = 0; i < string.length; i++) {
		var char = string[i];
        var type = getType(char);
        
        if (type == "error") {
            throw "LexError: Invalid Token"
        }

		if (stringMode) {
			if (type == stringDelimiter) {
				yield {type: "string", value: buffer};
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

					yield { type: bufferType, value: buffer };
					buffer = '';
					bufferType = '';

				}
				continue; //Skip everything below and enter string mode
			}
			if (splitters.test(char)) {

				if (buffer.length > 0) {

					yield { type: bufferType, value: buffer };
					buffer = '';
					bufferType = '';

				}
				if (type != undefined) {
					yield { type: type };
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
		yield { type: bufferType, value: buffer }
		buffer = ''; //Clear it just for good measure
		bufferType = '';
	}
	yield { type: 'EOF' };
}

export function parse(lexer) {
	var AST = [];
	for (var token of lexer) {
		console.log(token)
		AST.push(token);
	}
	return AST
}