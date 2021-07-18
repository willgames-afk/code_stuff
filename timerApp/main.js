const { ipcRenderer } = require("electron")

//UNCOMMENT IN DEV:
console.log = () => {};

//All of the code requires access to the DOM
window.addEventListener("load", () => {

	//Get info from main process
	var paused = ipcRenderer.sendSync("state") == "paused" ? true : false; //Format as boolean
	var startTime = ipcRenderer.sendSync('time-sync');
	const totalTime = ipcRenderer.sendSync('time-getLength');

	//Load DOM elements
	const bar =         document.getElementById("progress");
	const remaining =   document.getElementById("remainingTime");
	const pauseButton = document.getElementById("playpause");
	
	//Pause Button setup
	pauseButton.innerText = paused ? "Unpause" : "Pause"; //Make sure button will toggle correctly

	pauseButton.addEventListener("click", ()=>{
		paused = !paused;
		if (paused) {
			pauseButton.innerText = "Unpause"
			ipcRenderer.sendSync("state-update", "pause");
		} else {
			pauseButton.innerText = "Pause"
			startTime = ipcRenderer.sendSync("state-update", "restart"); //Restart timer returns new adjusted startTime
		}
	})

	//Initialize things, in case timer is already gone off or if it's paused.
	normalUpdate(totalTime - (Date.now() - startTime), totalTime)

	//Start render loop
	render();

	//Function Defs:

	function render() { //Standard main loop
		const timeRemaining = totalTime - (Date.now() - startTime);

		if (paused) { //Don't do anything if paused, just make sure to keep the render loop going
			requestAnimationFrame(render);
			return
		}

		if (timeRemaining > 0) {
			requestAnimationFrame(render);
			normalUpdate(timeRemaining, totalTime)
		} else {
			//Render loop ends after this because no call to requestAnimationFrame will be called

			//Hide bar and pause button
			bar.style.display = "none";
			bar.parentElement.style.display = "none";
			pauseButton.style.display = "none";

			//Make `remaining` into animated splash text (see css)
			remaining.innerText = "TIME TO GET OFF!!!!"
			remaining.className = "flash"

			//Make background flash
			document.body.className = "flash"
		}
	};

	//Applies time updates to the DOM
	function normalUpdate(timeRemaining, totalTime) {
		console.log(toMins)
		bar.style.width = (timeRemaining / (totalTime + 1)) * 100  + "%";
		remaining.innerText = toMins(timeRemaining / 1000) + " Remaining!"
	}

	//Converts a time from seconds into a formatted seconds/minutes string
	function toMins(seconds) {
		console.log(seconds)
		var string = "";
		if (seconds >= 60) {
			string += pluralizeProperly("Minute", Math.floor(seconds / 60))
			seconds = seconds % 60
		}
		if (seconds > 0) {
			if (string.length > 0) {
				string += " and "
			}
			string += " " + pluralizeProperly("Second", Math.floor(seconds))
		}
		return string;
	}

	//Correctly Pluralizes units based on values
	function pluralizeProperly(unit, value) {
		if (value == 1) { //If it's exactly equal to one, it shouldn't be pluralized
			return `${value} ${unit}`
		}
		return `${value} ${unit}s` //Everything else gets an S stuck on it.
	}
})