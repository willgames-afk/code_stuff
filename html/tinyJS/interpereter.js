export function interperet(ast) {
	var variables = {};
	function _interperet(ast) {
		if (typeof ast == "number") { //|| typeof ast[0] == "number") {
			return ast;
		} else if (typeof ast == "string") {
			if (!variables[ast]) {
				throw `Variable ${ast} is not defined!`;
			}
			return variables[ast];
		}

		switch (ast[0]) {
			case "Assign":
				variables[ast[1]] = _interperet(ast[2])

			case "Add":
				return _interperet(ast[1]) + _interperet(ast[2])

			case "Sub":
				return _interperet(ast[1]) - _interperet(ast[2])

			case "Mul":
				return _interperet(ast[1]) * _interperet(ast[2])

			case "Div":
				return _interperet(ast[1]) / _interperet(ast[2])
		}
	}
	try {
		for (var i = 0; i < ast.length; i++) {
			_interperet(ast[i]);
		}
		return variables;
	} catch (e) {
		console.error(e);
		return e;
	}
}