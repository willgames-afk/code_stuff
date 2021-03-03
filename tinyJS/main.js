//-------------Setting up interface-------------------//

//Grabbing DOM Interface Elements
var ui = {
	input: document.getElementById('in'),
	output: document.getElementById('out'),
	runButton: document.getElementById('run')
}

ui.runButton.addEventListener('click', onRun);
ui.input.addEventListener('input', resizeTACallback(ui.input, 30));

//Function to auto-resize textareas
function resizeTA(textarea, minHeight) {
	textarea.style.height = "0px";
	if (textarea.scrollHeight > minHeight) {
		textarea.style.height = textarea.scrollHeight + 'px';
	} else {
		textarea.style.height = minHeight + 'px';
	}
}
//resizeTA in a callback wrapper
function resizeTACallback(textarea, minHeight) {
	return (e) => {
		textarea.style.height = "0px";
		if (textarea.scrollHeight > minHeight) {
			textarea.style.height = textarea.scrollHeight + 'px';
		} else {
			textarea.style.height = minHeight + 'px';
		}
	}
}

//---------Setting up compiler -------------//
var compiler = new TinyInterpereter(ui.input, 0, 0)



//----------------Main Function ------------//

function onRun() {
	ui.output.innerHTML += compiler.run() + "\n";
	resizeTA(ui.output, 20);
}
