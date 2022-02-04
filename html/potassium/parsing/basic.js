/* Basic Parsing Functions! */


function tryparse
function parseall

/** Consumes whitespace */
export function getToToken(input) {
	return input.trimStart();
}

/** Parses a literal string */
export function parseLiteral(input, literal) {

	if (input.length < literal.length) {
		return [null, input, `Error: Expected ${literal}.`]
		//It can't match if there's not enough input
	}
	if (input.substring(0,literal.length) == literal) {
		return [literal, input.substring(literal.length)]
	}	else {
		return [null, input,`Error: Expected ${literal}.`];
	}
}
export function parseLiteralToken(input, literal) {
	return parseLiteral(getToToken(input),literal);
}

export function parseWhile(input, regex) {
    var out = ""
    for (var i=0;i<input.length;i++) {
        if (regex.test(input[i])) {
            out += input[i];
        } else {
			if (out.length == 0) break; //Break out of loop to fail
            return [out, input.substring(i)]
        }
    }
    return [null, input, `Error: Expected character matching regex ${regex.toString()}`]
}
export function parseWhileToken(input, regex) {
	return parseWhile(getToToken(input), regex);
}