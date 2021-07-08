const { ipcRenderer, TouchBarSegmentedControl } = require("electron")

window.addEventListener("DOMContentLoaded", () => {
    var startTime = ipcRenderer.sendSync('time-sync');
    var bar = document.getElementById("progress").style;
	var remaining = document.getElementById("remainingTime");

    (function render() {
        requestAnimationFrame(render);

        var totalTime = 360; //1 hour
        var timeElapsed = (Date.now() - startTime) / 1000; //In seconds, not milliseconds
		var timeRemaining = totalTime - timeElapsed
        var percentRemaining = timeRemaining / totalTime
        bar.width = percentRemaining * 100 + "%";


		remaining.innerText = toMins(timeRemaining) + " remaining!";
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