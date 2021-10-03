function parseWhile(regex, inp) {
	var input = [...inp]
	var char = input.shift();
	var out = ""
	while (regex.test(char)) {
		console.log(char)
		out += char;
		char = input.shift();
	}
	input.unshift(char);
	return [out,input];
}

function parseLiteral(inp, char) {
	var input = [...inp]
	var x = input.shift();
	if (x == char) {
		return [true,input];
	} else {
		throw "Expected " + char
	}
}

function parseNum(input) {
	var res = parseWhile(/\d/, input)
	console.log(res)
	return [parseInt(res[0], 10), res[1]]
}

function parseVar(input) {
	return parseWhile(/\w/, input)
}

function parseFactor(input) {
	try {
		var r1 = parseLiteral(input, "(");
		var i = parseExpression(r1[1]);
		var r2 = parseLiteral(i[1], ")");
		return [i[0],r2[1]]; //Return the expression, and the leftovers after the parenthesis
	} catch {
		try {
			return parseNum(input);
		} catch {
			return parseVar(input);
		}
	}
}

function parseMulOp(input) {
	try {
		var res = parseLiteral(input,"*")
		return ["Mul",res[1]]
	} catch {
		var res = parseLiteral(input,"/")
		return ["Div",res[1]]
	}
}

function parseTerm(input) {
	console.log("parsing term",input)
	var factor1 = parseFactor(input);
	try {
		console.log("trying to parse mulOp",factor1[1])
		var mulOp = parseMulOp(factor1[1]);
		var factor2 = parseFactor(mulOp[1]);
		return [[mulOp[0], factor1[0], factor2[0]],factor2[1]] //The results of mulOp, f1 and f2, and what was left after factor2
	} catch {
		console.log("couldn't parse mulOp, returning factor")
		return factor1;
	}

}

function parseAddOp(input) {
	console.log("Parsing addOp from", input);
	try {
		var res = parseLiteral(input,"+")
		return ["Add",res[1]]
	} catch {
		var res = parseLiteral(input,"-")
		return ["Sub",res[1]]
	}
}

export function parseExpression(input) {
	console.log("parsing expression",input)
	var term1 = parseTerm(input);
	try {
		console.log("attempting to parse addOp",term[1])
		var op = parseAddOp(term[1]);
		var term2 = parseTerm(op[1]);
		return [[op[0], term1[0], term2[0]],term2[1]]
	} catch {
		return term1
	}
}