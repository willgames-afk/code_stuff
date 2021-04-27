export function* lexer(string) {
	function getType(char) {
		if (leximes[bufferType] && leximes[bufferType].test(char)) {
			return bufferType;
		}
		for (const [key, value] of leximes) {
			//console.log (`Testing against ${value}`)
			if (value.test(char)) {
				//console.log(`Found it; ${key}`)
				return key;
			}
		}
	}
	var leximes = [
		{quote: /'/}, {dbquote: /"/}, {backquote: /`/},
		{oc: /{/}, {cc: /}/},
		{ob: /\[/}, {cb: /\]/},
		{oPar: /\(/}, {cPar: /\)/},
		{colon: /:/}, {semicolon: /;/},
		{dot: /\./}, //Will try to match things listed higher first; so it'll match 'dot' before 'number' alphanum
		{equals: /=/},
		{operator: /[*+\-/<=>]/},
		{number: /[\d.]/},
		{alphanumeric: /\w/}, //It will also try to match the longest possible string on that type.
	]

	var splitters = /[ 	\n"'`{}()[\]:;.=+-/*]/ //note that this starts with space tab, not just 2 spaces
	//Splitters are characters that split a token.

	var buffer = '';
	var bufferType = ''; 
	for (var i = 0; i < string.length; i++) {
		var char = string[i];
		var type = getType(char);

		if (splitters.test(char)) {

			if (buffer.length > 0) {

				yield { type: bufferType, value: buffer };
				buffer = '';

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
	yield { type: 'EOF' };
}

export function parse(lexer) {
	for (var token of lexer) {
		console.log(token)
	}
}