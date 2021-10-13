
/** Gobble up whitespace to get to the next token */
function getToken(input) {
	var res = parseWhile(input, /\s/);
	return res[1];
}

/** Parse some chars */
function parseLiteral(input, char) {
	console.log(`Attempting to parse '${char}' from '${input}'`)
	if (input.length > 0) {
		for (var i = 0; i < char.length; i++) {
			if (char[i] != input[i]) {
				throw "Expected " + char
			}
		}
		return [true, input.substr(char.length)];
	} else {
		throw "Expected " + char
	}
}

/** Parse characters until you hit one that doesn't match the regex */
function parseWhile(input, regex) {
	//var string = input;
	var out = ""
	while (true) {
		var char = input[0]//string[0];
		if (regex.test(char)) {
			out += char;
			input = input.slice(1);
			if (input.length == 0) {
				break
			}
		} else {
			break;
		}
	}
	return [out, input] //string];
}

function parseMyFloat(input) {
	console.log("Attempting to parse float")
	var intPart = parseWhile(input, /\d/);
	if (intPart[0].length == 0) {
		throw "Expected Float"
	}
	var dot = parseLiteral(intPart[1], ".");
	//At this point, the only thing it could be is a float

	var fracPart = parseWhile(dot[1], /\d/);
	if (fracPart[0].length == 0) {
		throw "rExpected Float"
	}
	console.log(`Parsed Float ${intPart[0] + "." + fracPart[0]}`)
	var val = parseFloat(intPart[0] + "." + fracPart[0]);
	if (isNaN(val)) {
		throw "rExpected Float"
	}
	return [val, fracPart[1]]
}

function parseHex(input) {
	try {
		var res = parseLiteral(getToken(input), "0x");
	} catch {
		throw "Expected 0x Header"
	}
	console.log("parsed hex header")
	var num = parseWhile(res[1], /[\da-fA-F]/);
	if (num[0].length == 0) {
		throw "Expected Hexadecimal Number"
	}
	var val = parseInt("0x" + num[0])
	if (isNaN(val)) {
		throw "Expected Hexadecimal Number"
	}
	return [val, num[1]]
}

function parseMyInt(input) {
	console.log("Trying to parse Hexadecimal Number")
	try {
		return parseHex(input);
	} catch (e) {
		if (e != "Expected 0x Header") {
			throw e;
		}
		console.log("Failed to parse hex int, trying to parse normal int")
		var num = parseWhile(getToken(input), /\d/);
		var val = parseInt(num[0]);
		if (isNaN(val)) {
			throw "Expected Integer"
		}
		return [val, num[1]]
	}
}

/** Parse any number */
function parseNum(input) {
	var token = getToken(input);
	console.log("attempting to parse int")
	try {
		return parseMyFloat(token)
	} catch (e) {
		if (e == "rExpected Float") {
			throw "Expected Float"; //I could tell it was a float, it was just missing stuff
		}
		console.log("Failed to parse int, trying to parse float")
		try {
			return parseMyInt(token);
		} catch {
			throw "Expected Number"
		}
	}
}

function parseVar(input) {
	var token = getToken(input);
	var variable = parseWhile(token, /[a-zA-Z0-9_]/);
	if (variable[0].length == 0) {
		throw "Expected Variable"
	}
	return variable;
}

/** Parse a Factor (Number, Subexpression or Variable) */
function parseFactor(input) {
	//It might be negative- try that first


	try {
		console.log("Trying to parse subexpresion")
		var p = parseLiteral(getToken(input), "(")
		var exp = parseExpression(getToken(p[1]));
		var p2 = parseLiteral(getToken(exp[1]), ")");
		return [exp[0], p2[1]]
	} catch {
		console.log("no subexpression, parsing num")
		try {
			return parseNum(input);
		} catch {
			console.log("Couldn't parse number, trying var");
			return parseVar(input)
		}
	}
}

/** Parse a multiplication-level operator (* or /) */
function parseMulOp(input) {
	try {
		var res = parseLiteral(getToken(input), "*");
		return ["Mul", res[1]];
	} catch {
		var res = parseLiteral(getToken(input), "/")
		return ["Div", res[1]]
	}
}

/** Parse a term (Factor, possibly followed by some number of mulOp-factor pairs) */
function parseTerm(input) {
	var factor1 = parseFactor(input);
	console.log("Parsed Factor, trying to parse mulOp")
	try {
		return _parseTerm(factor1)
	} catch (e) {
		if (e == "Expected Number") {
			throw e;
		}
		console.log("mulOp failed, returning factor")
		return factor1
	}
}

/** Parses some number of factor-MulOp pairs, see parseTerm */
function _parseTerm(factor1) {
	var mulOp = parseMulOp(factor1[1])
	var factor2 = parseFactor(mulOp[1])

	try {
		return _parseTerm([[mulOp[0], factor1[0], factor2[0]], factor2[1]])
	} catch (e) {
		if (e == "Expected Number") {
			throw e;
		}
		return [[mulOp[0], factor1[0], factor2[0]], factor2[1]]
	}
}

/** Parses an addition-level operator (+ or -) */
function parseAddOp(input) {
	console.log("Trying to parse '+'")
	try {

		var res = parseLiteral(getToken(input), "+");
		return ["Add", res[1]];
	} catch {
		console.log("'+' failed, parsing '-'")
		var res = parseLiteral(getToken(input), "-");
		return ["Sub", res[1]];
	}
}

/** Parses a mathematical expression (A Term, possibly followed by some number of addOp-term pairs) */
function parseExpression(input) {
	if (input.length == 0) {
		throw "Expected Expression"
	}
	var term1 = parseTerm(input);
	console.log("Parsed Term, trying to parse AddOp")
	try {
		return _parseExpression(term1)
	} catch (e) {
		if (e == "Expected Number") {
			throw e;
		}
		return term1//[[term1[0]], term1[1]]
	}
}

/** Parses some number of addOp-Term pairs, see parseExpression */
function _parseExpression(term1) {
	var addOp = parseAddOp(term1[1]);
	var term2 = parseTerm(addOp[1]);

	try {
		return _parseExpression([[addOp[0], term1[0], term2[0]], term2[1]]);
	} catch (e) {
		if (e == "Expected Number") {
			throw e;
		}
		return [[addOp[0], term1[0], term2[0]], term2[1]]
	}

}

function parseAssignment(input) {
	var target = parseVar(getToken(input));
	var eq = parseLiteral(getToken(target[1]), "=");
	var value = parseExpression(getToken(eq[1]));
	return [["Assign", target[0], value[0]], value[1]]
}

export function parse(string) {
	var out = [];
	var currentinput = string;
	try {
		while (true) {
			var res = parseAssignment(currentinput);
			out.push(res[0]);

			try {
				currentinput = parseLiteral(res[1], "\n")[1];
			} catch {
				break;
			}
		}
	} catch (e) {
		console.error(e);
		return e;
	}
	return out
}