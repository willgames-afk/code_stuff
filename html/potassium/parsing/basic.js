/* Basic Parsing Functions! */


/** Try to parse using each passed function in turn, returning result as soon as its successful */
export function parseone (input, ...functions){
	for (var i=0;i<functions.length;i++) {
		var [res,rem,err] = functions[i](input);
		if (!err) {
			return [res,rem];
		}
	}
	return [false, input, "`parseone` failed."]
}

/** Parse feeding rem into input of next passed function - Must pass all for it to succeed. Returns list of results */
/*export function parseall (input, ...functions) {
	var resps = [];
	for (var i=0;i<functions.length;i++) {
		var [res,rem,err] = functions[i](input);
		if (err) {
			return [false, rem,err];
		}
		input = rem;
		resps.push(res);
	}
	return [resps,rem];
}*/

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
/** parseLiteral but it consumes whitespace first */
export function parseLiteralToken(input, literal) {
	return parseLiteral(getToToken(input),literal);
}

/** Parses characters that match the regex until it finds one that doesn't.*/
export function parseWhile(input, regex) {
    var out = "", i=0;
    while (regex.test(input[i])) {
        out += input[i];
		i++;
	}
	if (out.length == 0) {
		return [null, input, "Error: Expected character matching regex " + regex];
	}
	return [out, input.substring(i)]
}


/** `parseWhile`, but it consumes whitespace first */
export function parseWhileToken(input, regex) {
	var tokenstart = getToToken(input);
	var [res, rem, err] = parseWhile(tokenstart, regex);
	if (err) {
		return [null, tokenstart, err];
	}
	return [res,rem];
}