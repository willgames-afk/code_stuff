
/** Gobble up whitespace to get to the next token */
function getToken(input) {
	var res = parseWhile(input,/\s/);
	return res[1];
}

/** Parse a single character */
function parseLiteral(input, char) {
    console.log(`Attempting to parse '${char}' from '${input}'`)
    if (input.length > 0 && input[0] == char) {
        return [true, input.substr(1)];
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
        } else {
            break;
        }
    }
    return [out, input] //string];
}

/** Parse an integer */
function parseNum(input) {
    var res = parseWhile(getToken(input),/\d/);
	if (res[0].length == 0) {
		console.log(res)
		throw "Expected Number";
	}
    console.log(`Parsed number '${parseInt(res[0],10)}'`)
    return [parseInt(res[0],10),res[1]];
}

/** Parse a Factor (Number, Subexpression or Variable) */
function parseFactor(input) {
    try {
		console.log("Trying to parse subexpresion")
        var p = parseLiteral(getToken(input), "(")
        var exp = parseExpression(getToken(p[1]));
        var p2 = parseLiteral(getToken(exp[1]),")");
        return [exp[0], p2[1]]
    } catch {
		console.log("no subexpression, parsing num")
        var res = parseNum(input);
        return res;
    }
}

/** Parse a multiplication-level operator (* or /) */
function parseMulOp(input) {
    try {
        var res = parseLiteral(getToken(input), "*");
        return ["Mul",res[1]];
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
    } catch (e){
		if (e == "Expected Number") {
			throw e;
		}
        console.log("mulOp failed, returning factor")
        return factor1
    }
}

/** Parses some number of factor-MulOp pairs, see parseTerm */
function _parseTerm(factor1 ) {
    var mulOp = parseMulOp(factor1[1])
    var factor2 = parseFactor(mulOp[1])

    try {
        return _parseTerm([[mulOp[0],factor1[0],factor2[0]], factor2[1]])
    } catch (e){
		if (e == "Expected Number") {
			throw e;
		}
        return [[mulOp[0],factor1[0],factor2[0]], factor2[1]]
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
        var res = parseLiteral(getToken(input),"-");
        return ["Sub", res[1]];
    }
}

/** Parses a mathematical expression (A Term, possibly followed by some number of addOp-term pairs) */
function parseExpression(input) {
    var term1 = parseTerm(input);
    console.log("Parsed Term, trying to parse AddOp")
    try {
        return _parseExpression(term1)
    } catch (e) {
		if (e == "Expected Number") {
			throw e;
		}
        return [[term1[0]],term1[1]]
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

export function parse(string) {
	try {
		var res = parseExpression(string);
		return res;
	} catch (e) {
		console.error(e);
		return e;
	}
}

export function interperet(ast) {
	if (typeof ast == "number" || typeof ast[0] == "number") {
		return ast;
	}

	if (ast[0] == "Add") {
		return interperet(ast[1]) + interperet(ast[2])
	} else if (ast[0] == "Sub") {
		return inperperet(ast[1]) - interperet(ast[2])
	} else if (ast[0] == "Mul") {
		return interperet(ast[1]) * interperet(ast[2])
	} else if (ast[0] == "Div") {
		return interperet(ast[1]) / interperet(ast[2])
	}
}