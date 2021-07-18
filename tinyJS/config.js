export let verbosity = 3;
/* 	0- No logs
	1- Progress Logs
	2- Debug output
	3- All info
*/

export function log(/*All args will be passed through to console.log EXCEPT the last one which is the verbosity*/) {

	//Logged text is sometimes logged with a verbosity value representing how high the verbosity value has to be in order to log it.
	if (arguments.length >= 2 && typeof arguments[arguments.length - 1] == "number") {
		let minVerb = arguments[arguments.length - 1];
		if (minVerb <= verbosity) {
			console.log(...Array.from(arguments).slice(0,-1)); //If it should be logged, log everything passed except verbosity itself.
		}
	} else {
		if (verbosity >= 1) {
			console.log(...arguments)
		}
	}
}

export function error(...args) {
	console.error(args); //If it should be logged, log everything passed except verbosity itself.
}