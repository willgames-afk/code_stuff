export const VERBOSE = true;
export function optLog(data) {
	if (VERBOSE) {
		console.log(data);
	}
}
export function log(data) {
	console.log(data)
}
export function error(data) {
	console.error(data)
}