const { ipcRenderer } = require("electron")

window.addEventListener("DOMContentLoaded", () => {

    const startTime = ipcRenderer.sendSync('time-sync');
	const totalTime = ipcRenderer.sendSync('time-getLength');

    var bar = document.getElementById("progress");
	var remaining = document.getElementById("remainingTime");


    (function render() {
		var timeRemaining = totalTime - (Date.now() - startTime);
        var percentRemaining = timeRemaining / (totalTime + 1);

		if (timeRemaining > 0) {
			requestAnimationFrame(render);
			bar.style.width = (percentRemaining * 100) +"%";
			remaining.innerText = toMins(timeRemaining / 1000) + " remaining!";
		} else {
			bar.style.display = "none";
			bar.parentElement.style.display = "none";
			remaining.innerText = "TIME TO GET OFF!!!!"
			remaining.className = "flash"
			document.body.className = "flash"
		}
    })();

	function toMins(seconds) {
		var string = "";
		if (seconds >= 60) {
			string += pluralizeProperly("minute", Math.floor(seconds/60))
			seconds = seconds % 60
		}
		if (seconds > 0) {
			if (string.length > 0) {
				string += " and "
			}
			string += " "+ pluralizeProperly("second", Math.floor(seconds))
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