import {parseWhile, parseLiteral, parseLiteralToken} from "basic.js"


export function typeError(type,input) {
	return [null, input, "TypeError: Expected " + type];
}

function pdigits(input) {
	return parseWhile(input, /\d/);
}

export const types = {
	"float",
	"int",
	"number"
}


export function pfloat(input) {
    var [intpart,rem,err] = pdigits(getToToken(input));
    if (err) return typeError("Float",rem);
		
    var [_,rem2,err] = parseLiteral(rem, ".");
    if (err) return typeError("Float",rem);

    var [frac,rem3,err] = pdigits(rem2);
    if (err) return typeError("Float",rem);
	
    var val = parseFloat(intpart + "." + frac);
    if (isNaN(val)) {
        return typeError("Float",rem);
    }
    return [{ type: "float", val: val }, rem3]
}

export function phex(input) {
    
	[_,rem,err] = parseLiteralToken(input, "0x");
    if (err) return typeError("Hexadecimal Number",rem);

    var [hex, rem2,err] = parseWhile(rem, /[\da-fA-F]/);
	if (err) return typeError("Hexadecimal Number",rem);
	
    var val = parseInt("0x" + hex);
    if (isNaN(val)) {
        return typeError("Hexadecimal Number",rem);
    }
    return [{ type: "int", val: val }, rem2]
}

export function pint(input) {
    var [num, rem, err] = parseHex(input);
	if (err) {
		[num,rem,err] = pdigits(getToToken(input));
		if (err) return typeError("Integer",rem);
	}
	var val = parseInt(num);
    if (isNaN(val)) {
        return typeError("Integer",rem);
    }
	
    return [{ type: "int", val: val }, rem]
}

/** Parse any number */
export function pnum(input) {
	var [num, rem, err] = tryparse(input,pint,pfloat);
	if (err) return typeError("Number",rem);
    return [num,rem,err];
}