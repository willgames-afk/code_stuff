const fs = require("fs");
const path = require("path")
const { exit, hasUncaughtExceptionCaptureCallback } = require("process");

const lowercase = 'abcdefghijklmnopqrstuvwxyz'.split('');
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const digit     = '0123456789'.split('');

let prplPath = process.argv[2];
let inputPath = process.argv[3];

if (!prplPath || !inputPath) {
	console.error("Expeted path to PrPL file and path to input file!");
	exit(1);
}
prplPath = path.resolve(process.env.PWD, prplPath);
inputPath = path.resolve(process.env.PWD, inputPath);

let prpl;
let input;

const RFOPTS = {encoding: "utf-8"}
try {
	prpl = fs.readFileSync(prplPath, RFOPTS);
	input = fs.readFileSync(inputPath, RFOPTS);
} catch (err) {
	console.error("Error reading files");
	exit(1);
}

console.log("PrPL Program:", prplPath)
console.log("Input:       ",inputPath)

prpl = prpl.trim().split(/\r\n|\r|\n/g).filter(Boolean);
console.log("PrPL:", prpl)

let functs = [];
let serrs = [];
var funcs = [];
let sawError = false;
while(prpl.length > 0) {
	const func = pFunction(prpl, funcs);
	if (!func.err) {
		prpl = func.rem;
	} else {
		console.error(func.err);
		sawError = true;
		break;
	}
	if (func.softerrors.length == 0) {
		functs += func.res;	
	} else {
		for (var ind = 0;ind<func.softerrors.length;ind++) {
			console.error(func.softerrors[ind].err)
		}
		sawError = true;
	}
}
if (sawError) {
	console.log("Saw Error!")
	console.log(JSON.stringify(functs))
	exit(1);
}
console.log("Successsssss!")
console.log(JSON.stringify(functs,null,"\n\t"))


function pFunction(lines, funcs) {
	console.log("Attempting to parse function", lines)
	let softerrors = [];
	if (lines[0].trimStart() !== lines[0]) {
		return {err: "Unexpected Whitespace (Expexted function)", rem: lines}
	}
	const functionName = lines[0].trimEnd();
	funcs.push(functionName); //Allow recursion
	let ls = [];
	let i=1
	let terr = ""
	while (true) {
		const tokens = pMatch(lines.slice(i), funcs);
		softerrors.push(...tokens.softerrors);
		i++;
		if (tokens.err) {
			terr = tokens.err
			console.log("Failed to parse match!")
			break;
		} else {
			console.log("Parsed match!")
		}

		let tokenOptions = {};
		
		while (true) {
			const option = pTokenOption(lines.slice(i), tokens.res, funcs);
			softerrors.push(...option.softerrors);
			if (option.err) {
				terr = option.err;
				console.log("Failed to parse opts")
				break;
			}
			if (option.softerrors.length == 0) {
				console.log("opts found")
				tokenOptions[option.res.tokenId] = option.res.tokenOptions;
			} else {
				console.log("opts failed, but continuing anyway")
			}
			i++;
		}



		ls.push({token: tokens.res,opts: tokenOptions });
	}
	if (ls.length == 0) {
		return {err: terr, rem: lines.slice(i),softerrors}
	}

	let onErr = null;
	if (lines.slice(i-1).length > 0) {
		console.log("end func lines", lines[i-1], lines.slice(i))
		const res = pErrText([lines[i-1].trimStart(),...lines.slice(i)]);
		if (!res.err) {
			onErr = res.res;
			console.log("found error text!")
		} else {
			console.log("No error text")
		}
	}

	console.log("Function Succeeded?")
	return {res: {name: functionName, lines: ls, onErr}, rem: lines.slice(i), softerrors}
}

function pMatch(lines, funcs) {
	console.log("Attempting to parse match",lines)
	if (lines.length == 0) return {err: "No input text", rem: lines, softerrors: []}
	let softerrors = [];
	var indent = 0;
	while (lines[0][indent] == '\t') {
		indent++;
	};
	let line = lines[0].substring(indent) //+ '?' //Optional chaining operator at the end to get everything neatly into finalTokens
	if (indent < 1) return {err: "Expected indent for match!", rem: lines,softerrors};
	if (indent > 1) return {err: "Too much indent!", rem: lines,softerrors};
	//let finalTokens = [];
	let uppertokens = [];
	let tokens = [];
	//let shouldBeSticky = false;


	if (line.startsWith('soft') || line.startsWith('err')) {
		return {err: "Error: unexpected error clause", rem: lines, softerrors}
	}

	for (var i=0;i<line.length;i++) {
		console.log("char:", line[i])

		if (line[i] == '"') {
			let chars = "";
			i++;
			while(true) {
				if (line[i]) console.log("stringchar", line[i])
				if (line[i] == '"') break;
				chars += line[i];
				i++;
			}
			console.log("Succeeded!!!")
			//i++
			tokens.push({type: "lit", val: chars});
		} else if (line[i] == '[') {
			let opts = [];
			i++;
			while(line[i] !== ']' || (line[i-1] == '\\' && line[i-2] !=='\\')) {
				if (line[i] == '-') {
					let start = opts[opts.length-1];
					let end = line[i+1];
					let startindex, endindex;
					let set;
					if (lowercase.includes(start)) {
						set = lowercase;
					} else if (uppercase.includes(start)) {
						set = uppercase;
					} else if (digit.includes(start)) {
						set = digit;
					} else {
						softerrors.push({err: "Invalid range character", rem: lines.slice(1)})
						break;
					}

					if (set.includes(end)) {
						startindex = set.indexOf(start);
						endindex = set.indexOf(end);
					} else {
						softerrors.push({err: "range character mismatch", rem: lines.slice(1)})
						break;
					}
				
					if (startindex > endindex) {
						softerrors.push({err: "range start and end are reversed", rem: lines.slice(1)});
						break;
					}
					opts.push(...set.slice(startindex, endindex + 1));
				} else {
					opts.push(line[i]);
				}
				i++;
			}
			tokens.push({type: 'set', val: opts})
		} else if (line[i] == "+") {
			let lasttoken = tokens.pop();
			tokens.push({type: "oneormore", val: lasttoken});
		} else if (line[i].trim().length == 0) {
			//If whitespace, ignore
			continue;
		} /*else if (line[i] == '?') {
			if (tokens.length == 0) {
				softerrors.push({err:"Invalid Optional Operator (`?`)", rem: lines})
				continue;
			}
			if (finalTokens.length < 1) {
				finalTokens = JSON.parse(JSON.stringify(tokens));
				tokens = [];
			} else {
				finalTokens.push({type: "optionalMore", val: JSON.parse(JSON.stringify(tokens))});
				tokens = [];
			}
		}*/ /*else if (line[i] == "!") {
			if (tokens.length == 0) {
				softerrors.push({err: "Useless `!` opperator!", rem: lines});
			}
			shouldBeSticky = true;
		}*/ else if (line[i] == '(') {
			uppertokens.push(JSON.parse(JSON.stringify(tokens)));
			tokens = [];
		} else if (line[i] == ')') {
			if (uppertokens.length < 1) {
				softerrors.push({err: "Unexpected closing parenthesis", rem: lines.slice(1)});
				continue;
			}
			uppertokens[uppertokens.length].push({type: "subtokens", val: JSON.parse(JSON.stringify(tokens))});
			tokens = uppertokens[uppertokens.length];
		} else if (uppercase.includes(line[i]) || lowercase.includes(line[i])) {
			let name = line[i];
			i++;
			while(uppercase.includes(line[i]) || lowercase.includes(line[i])||digit.includes(line[i])) {
				name += line[i];
				i++;
			}
			if (!funcs.includes(name)) {
				softerrors.push({err: `Function \`${name}\` not yet defined.`, rem: lines.slice(1)});
				continue;
			}
			tokens.push({type: 'call', val: name});
		} else {
			softerrors.push({err: `Unexpected character '${line[i]}'`, rem: lines.slice(1)});
			continue;
		}
		/*if (shouldBeSticky) {
			tokens[tokens.length-1].sticky = true;
			shouldBeSticky = false;
		} else {
			tokens[tokens.length-1].sticky = false;
		}*/
	}
	if (uppertokens.length > 0) {
		softerrors.push({err: "Unclosed Parethesis", rem: lines.slice(1)});
	}
	console.log("Parsed Match!")
	return {res: tokens/*finalTokens*/, rem: lines.slice(1),softerrors}
}

function pTokenOption(lines, tokens, funcs) {
	console.log("attempting to parse token opts", lines)
	if (lines.length == 0) return {err: "No input text", rem: lines, softerrors: []}

	let softerrors = [];
	var indent = 0;
	while (lines[0][indent] == '\t') {
		indent++;
	};
	let line = lines[0].substring(indent)
	if (indent < 2) return {err: "Expected Indent (2 levels)", rem: lines, softerrors};
	if (indent > 2) return {err: "Too much indent (expected 2 levels)", rem: lines,softerrors};

	let i=0;
	if (line.startsWith("ret", i)) {
		i+= "ret".length;
		return {res: "TODO",softerrors}
	}

	let tokenId = '';
	while (line[i] !== ':') {
		tokenId += line[i];
		i++;
	}
	tokenId = parseInt(tokenId);
	if (isNaN(tokenId)) softerrors.push({err: "Expected token id, but got NaN",rem: lines});

	let tokensLength = tokens.length;
	let st = tokens;
	while (st[st.length-1].type == "optionalMore") {
		tokensLength += st.length - 1;
		st = st[st.length-1];
	}
	if (tokenId >= tokensLength) softerrors.push({err: `Invalid token id- token id is ${tokenId} but there are only ${tokensLength} tokens.`, rem: lines})
	let tokenOptions = {checkFunc: null, emsg: null, semsg: null};
	
	while(line[i].trim().length == 0) i++; //Skip whitespace, if any

	if (uppercase.includes(line[i]) || lowercase.includes(line[i]) || digit.includes(line[i])) {
		let name = line[i];
		while(uppercase.includes(line[i]) || lowercase.includes[line[i]]||digit.includes(line[i])) {
			name+= line[i];
			i++;
		}
		tokenOptions.checkFunc = name;
	}
	
	while(line[i].trim().length == 0) i++; //Skip whitespace, if any

	const res = pErrText([line.substring(i), ...lines.slice(1)])
	softerrors.push(...res.softerrors);
	if (!res.err) {
		tokenOptions.emsg = res.res.emsg;
		tokenOptions.semsg = res.res.semsg;	
	}

	return {res: {tokenOptions,tokenId}, softerrors};

}
function pErrText(lines) {
	console.log("parsing error text", lines)
	if (lines.length == 0) return {err: "Expected err text (got nothing)", rem: lines}
	let softerrors = [];
	let line = lines[0]
	let i=0;
	let semsg, emsg
	if (line.startsWith("soft")) {
		i+="soft".length
		while(line[i].trim().length == 0) i++; //Skip whitespace, if any
		if (!line[i] == '"') {
			softerrors.push({err:"Expected error string",rem: lines} )
		} else {
			let chars = "";
			i++;
			while(line[i] !== '"' || (line[i-1] == '\\' && line[i-2] !=='\\')) {
				chars += line[i];
				i++;
			}
			semsg = chars;
		}
	} else if (line.startsWith("err", i)) {
		i+= "err".length
		while(line[i].trim().length == 0) i++; //Skip whitespace, if any
		if (!line[i] == '"') {
			softerrors.push({err:"Expected error string",rem:lines} )
		} else {
			let chars = "";
			i++;
			while(line[i] !== '"' || (line[i-1] == '\\' && line[i-2] !=='\\')) {
				chars += line[i];
				i++;
			}
			emsg = chars;
		}
	} else {
		return {err: "Expected `soft` or `err`", rem:lines, softerrors};
	}
	return {res: {semsg,emsg}, rem: lines.slice(1), softerrors}
}

function parselit(input, literal) {
	if (input.length < literal.length) return {err: `Expected \`${literal}\``, rem: ""};
	for (var i=0;i<literal.length;i++) {
		if (input[i] !== literal[i]) {
			return {err: `Expected \`${literal}\``,rem: input.substring(i)};
		}
	}
	return {res: literal, rem: input.substring(i), softerrors};
}