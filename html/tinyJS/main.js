import { TextIO } from "../../text-input-engine/main.js"
import { parse } from "./booleanExpressions.js"
import { interperet} from "./interpereter.js"

//----------------Main Function ------------//
new TextIO(
	(input) => {
		var ast = parse(input);
		console.log(ast)
		if (typeof ast == "string") {
			return ast; //It's an error message
		}
		return `${JSON.stringify(ast,null,"	")}\n${JSON.stringify(interperet(ast),null,"	")}\n`
	
	},{runAuto:true}
)