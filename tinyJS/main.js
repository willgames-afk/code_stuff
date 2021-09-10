import { TinyInterpereter } from "./interpereter.js"
import { parse } from "./parser.js";
import { log } from "./config.js"
import { lex } from "./lexer.js";
import { TextIO } from "../text-input-engine/main.js"

//---------Setting up compiler -------------//
var compiler = new TinyInterpereter(ui.input, 0, 0)

//----------------Main Function ------------//
new TextIO(
	() => {
		ui.output.innerHTML += compiler.run() + "\n";
		resizeTA(ui.output, 20);
	}
)