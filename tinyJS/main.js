//-------------Setting up interface-------------------//

//Grabbing DOM Interface Elements
var ui = {
	input: document.getElementById('in'),
	output: document.getElementById('out'),
	runButton: document.getElementById('run')
}

ui.runButton.addEventListener('click', onRun);
ui.input.addEventListener('input', resizeTACallback(ui.input, 300));

//Function to auto-resize textareas
function resizeTA(ta, minH) {
	ta.style.height = "";
	ta.style.height = Math.min(ta.scrollHeight, minH) + 'px'
}
//resizeTA in a callback wrapper
function resizeTACallback(textarea, minHeight) {
	return (e) => {
		textarea.style.height = "";
		textarea.style.height = Math.min(textarea.scrollHeight, minHeight) + 'px';
	}
}

//---------Setting up compiler -------------//
var compiler = new TinyInterpereter(ui.input,0,0)



//----------------Main Function ------------//

function onRun() {

}
