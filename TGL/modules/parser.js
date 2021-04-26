export function* lexer(string) {
	function getType(char) {
		if (leximes[state] && leximes[state].test(char)) {
			return state;
		}
		for(const [key,value] of Object.entries(leximes).sort((a,b)=>{b[0].localeCompare(a[0])})) {
			if (value.test(char)) {
				return key;
			}
		}
	}

	var i = 0;
	var leximes = {
		quote: /'/, dbquote: /"/, backquote: /`/,
		oc: /{/, cc: /}/,
		ob: /\[/, cb: /\]/,
		oPar: /\(/, cPar: /\)/,
		colon: /:/, semicolon: /;/,
		dot: /\./, //Will try to match things listed higher first; so it'll match
		number: /[0-9.]/, //Dot before number which will match before alphnum.
		alphanumeric: /\w/, //It will also try to match the longest possible string.
	}
	var hasValue = [
		"alphanumeric",
		"number"
	]
	var splitters = /[ 	\n"'`{}()[\]]:;/ //note that this starts with space tab, not just 2 spaces
	var buffer = '';
	var state = 'normal'; //can be normal or string
	for (i=0;i<string.length;i++) {
		var char = string[i];
		var type = getType(char);
		switch (state) {
			case 'alphanumeric':
				if (type != 'alphanumeric') {
					yield {type: 'alphanumeric', value: buffer};
					buffer = '';
					if (hasValue.includes(type)) {
						state = type;
						buffer += char;
					} else {
						yield {type: type};
						state = 'normal'
					}
				} else {
					buffer += char;
				}
				break;
			case 'number':
				if (type != 'number') {
					yield {type: 'number', value: buffer};
					buffer = '';
					if (hasValue.includes(type)) {
						state = type;
						buffer += char
					} else {
						yield {type: type};
						state = 'normal'
					}
				} else {
					buffer += char;
				}
				break;
			default:
				if (hasValue.includes(type)) {
					state = type;
					buffer += char;
				} else if (type != undefined) {
					yield {type: type};
				}
				break;
		}
	}
}

export function parse(lexer) {
	for (var token of lexer) {
		console.log(token)
	}
}