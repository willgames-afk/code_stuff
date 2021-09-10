import { TextIO } from "../text-input-engine/main.js";
import { lex, parse } from "./modules/parser.js"

new TextIO(() => {
	//Get rid of loading box
	document.getElementById("loadingMessage").style.display = "none";
	return JSON.stringify(parse(lex(input.value))).replace(/},/g, '},\n')
}, { runAuto: true, defaultInputFile: "./testProgram.tgl"})