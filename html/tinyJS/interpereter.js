export function interperet(ast) {
    var variables = {};
    function _interperet(ast) {
        switch (ast.type) {
            case "int":
            case "float":
            case "bool":
                return ast;

            case "var":
                if (!variables[ast]) {
                    throw `Variable ${ast} is not defined!`
                }
                return variables[ast];

            case "assign":
                variables[ast.val[0]] = _interperet(ast.val[1]);
                break;

            case: "op":
                switch (ast.val[0]) {
                    case "Add":
                        return _interperet(ast.val[1]) + _interperet(ast.val[2])

                    case "Sub":
                        return _interperet(ast.val[1]) - _interperet(ast.val[2])

                    case "Mul":
                        return _interperet(ast.val[1]) * _interperet(ast.val[2])

                    case "Div":
                        return _interperet(ast.val[1]) / _interperet(ast.val[2])
                }
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