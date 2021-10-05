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