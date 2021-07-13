const { ipcRenderer } = require("electron")

console.log(document.getElementById("playpause"))

window.addEventListener("load", () => {

	var state = ipcRenderer.sendSync("state");
	var startTime = ipcRenderer.sendSync('time-sync');
	const totalTime = ipcRenderer.sendSync('time-getLength');

	const bar =         document.getElementById("progress");
	const remaining =   document.getElementById("remainingTime");
	const pauseButton = document.getElementById("playpause");
	
	pauseButton.innerText = state == "paused" ? "unpause" : "pause";

	var paused = state == "paused" ? true : false;


	pauseButton.addEventListener("click", ()=>{
		paused = !paused;
		if (paused) {
			pauseButton.innerText = "unpause"
			ipcRenderer.sendSync("state-update", "pause");
		} else {
			pauseButton.innerText = "pause"
			startTime = ipcRenderer.sendSync("state-update", "restart"); //Restart timer returns new adjusted startTime
		}
	})

	//Init everything, in case of pause
	normalUpdate(totalTime-(Date.now()-startTime),totalTime - (Date.now() - startTime)/(totalTime + 1) * 100)

	render();


	function render() {
		const timeRemaining = totalTime - (Date.now() - startTime);
		const percentRemaining = (timeRemaining / (totalTime + 1)) * 100;

		if (paused) {
			requestAnimationFrame(render);
			return
		}

		if (timeRemaining > 0) {
			requestAnimationFrame(render);
			normalUpdate(timeRemaining, percentRemaining)
		} else {
			bar.style.display = "none";
			bar.parentElement.style.display = "none";
			pauseButton.style.display = "none";
			remaining.innerText = "TIME TO GET OFF!!!!"
			remaining.className = "flash"
			document.body.className = "flash"
		}
	};

	function normalUpdate(timeRemaining, percentRemaining) {
		bar.style.width = percentRemaining  + "%";
		remaining.innerText = toMins(timeRemaining / 1000) + " Remaining!"
	}

	function toMins(seconds) {
		var string = "";
		if (seconds >= 60) {
			string += pluralizeProperly("minute", Math.floor(seconds / 60))
			seconds = seconds % 60
		}
		if (seconds > 0) {
			if (string.length > 0) {
				string += " and "
			}
			string += " " + pluralizeProperly("second", Math.floor(seconds))
		}
		return string;
	}

	function pluralizeProperly(unit, value) {
		if (value == 1) {
			return `${value} ${unit}`
		}
		return `${value} ${unit}s`
	}
})