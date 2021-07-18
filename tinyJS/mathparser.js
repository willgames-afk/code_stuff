function objectifyExpression(str) {
	//Turns a mathematecal string into an object represntation

	var output = [];   //Contains the expression in JSON
	var state = 0; //When true, grabbing a sub-equation (parentheses; Otherwise, Grabbing number)
	var buffer = "";   //Holds things before parse
	var mcOps = [
		"==", "+=", "-=", "++", "--", "*=", ">=", "<=",
	] //Multi-Character operators
	var unaryOps = [
		"!", "-"
	]

	function charType(c) {
		var nums = [
			"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
		]
		var ops = [
			"+", "-", "*", "/","=",">","<"
		]
		var vars = [
			"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
			"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
		]
		var whitespace = [
			" ",
			"\n",
		]
		if (nums.includes(c)) {
			return "digit";
		} else if (ops.includes(c)) {
			return "operator";
		}else if (vars.includes(c)) {
			return "variable"
		} else if (c == '(') {
			return "open";
		} else if (c == ')') {
			return "closed";
		} else if (whitespace.includes(c)) {
			return "space"
		}
		return false;
	}

	//Remove parentheses if the entire expression is inside
	if (str[0] == '(' && str[str.length - 1] == ')') {
		str = str.slice(1, str.length - 1);
	}

	//For every char in the string, run the algorythm
	for (var i = 0; i < str.length; i++) {

		var char = str[i]; //Current character
		var type = charType(char); //Type of character (number, operator, open/closed parenthesis)
		if (!type) {
			console.error("strToObject Error- Invalid Character \"" + char + "\" at Position " + (i + 1))
			return false;
		}

		if (state == 1) { //If grabbing Parentheses

			if (type == "closed") { //Done grabbing, make recursive call to deal with contents of parentheses
				state = 0;
				output.push(objectifyExpression(buffer));
				buffer = ")";
			} else {
				if (type == "open") {
					state = 1;
					if (buffer.length > 0) {
						output.push(parseInt(buffer, 10));
					}
					buffer = "";
				} else {
					buffer += char;
				}
			}

		} else if (state == 0) {

			if (type == "digit") { //If it's a number, add the digit to the buffer.
				if (!(buffer == "" || parseInt(buffer,10))) {
					console.error("objectifyExpression Error- Unexpected Digit \""+ char +"\" at position " + i + ".")
					return false;
				}
				buffer += char;

			} else if (type == "open") {

				state = 1; //If open parenthesis, go to grab mode and grab everything inside the parentheses
				if (buffer.length > 0) {
					output.push(parseInt(buffer, 10));
				}
				buffer = "";

			} else if (type == "operator") {
				console.log(buffer)

				if (!(buffer.length > 0 || charType(buffer) == "open" || char == "-")) {
					//Makes sure the operator has a value
					console.error("strToObject Error- Operator missing argument at " + i);
					return false;
				}
				if (!(buffer == ')' || (char == '-'))) { //Edge Cases
					if (parseInt(buffer)) {
						console.log('pushing number ' + parseInt(buffer, 10) + ', operator is ' + char)
						output.push(parseInt(buffer, 10));
					} else {
						console.log ('pushing variable '+buffer+', operator is '+char)
						output.push(buffer)
					}
				}

				buffer = ""; //Clear the buffer
				output.push(char) //Add the operator to the output object


			} else if (type == "variable") {
				if (!(buffer == "" || buffer != ')' || !parseInt(buffer,10))) {
					console.error("objectifyExpression Error- Unexpected Character \""+ char +"\" at position " + i + ".")
					return false;
				}
				buffer += char;
			} else if (type == "space") {
				if ((charType(str[i-1]) == "variable" && charType(str[i+1]) == "variable") || (charType(str[i-1]) == "digit" && charType(str[i+1]) == "digit")) {
					console.error("objectifyExpression Error- Unexpected char \""+str[i+1]+"\" at position "+i+1+'.');
					return false
				}
			}

		}
	}

	if (buffer.length > 0 && buffer != ')') {
		console.log('Pushing Final Buffer: '+buffer)
		if (parseInt(buffer)) {
			output.push(parseInt(buffer, 10));
		} else {
			output.push(buffer)
		}
	}

	
	return output
}