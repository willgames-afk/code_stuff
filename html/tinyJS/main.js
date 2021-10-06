import { TextIO } from "../../text-input-engine/main.js"
import { parse } from "./booleanExpressions.js"

//----------------Main Function ------------//
new TextIO(
	(input) => {
		var ast = parse(input)
		if (typeof ast == "string") {
			return ast; //It's an error message
		}
		return JSON.stringify(ast[0],null,"	") + "\n"  + interperet(ast[0]) + "\n"
	
	},{runAuto:true}
)