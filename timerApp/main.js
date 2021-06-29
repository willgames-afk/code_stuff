const { ipcRenderer } = require("electron")

window.addEventListener("DOMContentLoaded", () => {
    var startTime = ipcRenderer.sendSync('time-sync');
    var bar = document.getElementById("progress").style;

    (function render() {
        requestAnimationFrame(render);

        var totalTime = 3600; //1 hour
        var timeElapsed = (Date.now() - startTime) / 1000; //In seconds, not milliseconds
        var timeRemaining = (totalTime - timeElapsed) / totalTime
        bar.width = timeRemaining * 100 + "%";
    })();
})

