import {VERBOSE} from "./config.js"
export function aoptLog(module, ...data) {
	if (VERBOSE) {
		if (!data) {
			console.log("unknown: "+module);
		} else {
			console.log(module + ":", ...data);
		}
	}
}
export function alog(module, ...data) {
	if (!data) {
		console.log("unknown: "+module);
	} else {
		console.log(module + ": ", ...data)
	}
}
export function aerror(module, ...data) {
	console.error(module + ": ", ...data)
}
export function optLog
export function configureLogs(moduleName) {
	log = function(...data) {
		aLog(moduleName,...data);
	}
}