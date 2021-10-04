import { TinyInterpereter } from "./interpereter.js"
import { log } from "./config.js"
import { lex } from "./lexer.js";
import { TextIO } from "../text-input-engine/main.js"
import { parse, interperet} from "./newParser.js"

//---------Setting up compiler -------------//
//var compiler = new TinyInterpereter(ui.input, 0, 0)

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