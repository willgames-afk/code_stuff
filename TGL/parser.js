function lex(text="") {
	var out = [];
	var buffer = '';
	var seperators = /[\(\) \n	"]/
	for (var i=0;i<text.length;i++) {
		var char = text[i];
		if (seperators.test(char)) {
			out.push(buffer);
			out.push(char);
			buffer = '';
		} else {
			buffer += char;
		}
	}
	return out
}
function parse(tokens = []) {
	var out = {};
	return out;
}