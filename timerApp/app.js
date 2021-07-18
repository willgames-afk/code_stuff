//NOTE: This was designed on MacOS

const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require("path");

//UNCOMMENT IN DEV:
console.log = () => {};


//Set up vars:

var startTime = Date.now(); //Time the timer started.

const turnLengthMS = 60 * 60 * 1000; //Length of a computer turn.
const warningTimeMS = 5 * 60 * 1000; //Time from the end of a turn a warning alert should be triggered

var pauseStart = null; //Time of last app pause. Used to adjust startTime
var paused = false;    //Whether the app is paused or not.

var win = null; //Will store current window object once created

var timeouts = {
	warning: null, //Warning timeout
	warningTriggered: false, //Has the warning already been triggered?
	timer: null,
	timerTriggered: false
}

//Helper function defs:

function registerNotifications() { //Sets up time warning notifications

	if (!timeouts.timerTriggered) { //Don't alert twice

		timeouts.timer = setTimeout(() => {
			//Time Depleted Notification

			if (BrowserWindow.getAllWindows().length === 0) { //Have to make sure window exists before focusing
				createWindow();
			}
			win.focus(); //Focus the window, to make sure user notices

			new Notification({ //Create notification
				title: "Time To Get Off",
				body: "Your turn is UP!"
			}).show();

			timeouts.timerTriggered = true; //Prevent event from triggering again after pauses

		}, turnLengthMS - (Date.now() - startTime)); //Trigger it in 1 hour minus how long the timer has been going
	}

	if (!timeouts.warningTriggered) { //5-minute warning, very similar to above
		timeouts.warning = setTimeout(() => { 
			new Notification({
				title: "5 Minute Warning",
				body: "Your turn is almost up!!"
			}).show();

			timeouts.warningTriggered = true;
		}, (turnLengthMS - warningTimeMS) - (Date.now() - startTime))
	}
}

//Creates an app window into the global `win` variable
function createWindow() {

	win = new BrowserWindow({
	
		width: 400, height: 140,

		backgroundColor: "#17171700",

		webPreferences: {
			preload: path.join(__dirname, "main.js")
		}
	})
	win.loadFile('index.html');
}


//IPC setup:

//Sends the current startTime to the renderer process.
ipcMain.on("time-sync", (e) => {
	console.log(`Time Sync!`);

	if (paused) { //When paused, we have to recalculate startTime
		startTime += (Date.now() - pauseStart); //Shift imaginary "start time" forwards when paused
		pauseStart = Date.now(); //Update pauseStart because we changed startTime
	}

	e.returnValue = startTime; //Send it to the Renderer
})

//Sends the current turn length
ipcMain.on("time-getLength", (e) => {
	console.log(`GetLength!`)
	//Gets turn length
	e.returnValue = turnLengthMS;
})

//Sends the current app state (paused or not paused)
ipcMain.on("state", (e, arg) => {
	console.log(`Get State!`)
	if (paused) {
		e.returnValue = "paused";
	} else {
		e.returnValue = "unpaused"
	}
})

//Handles state update(s) from Renderer
ipcMain.on("state-update", (e, arg) => {
	console.log(`State Update (to ${arg})`)

	if (arg == "pause" && !paused) {

		pauseStart = Date.now();
		paused = true;

		//Remove timeouts, they are no longer set for the correct times
		clearTimeout(timeouts.warning);
		clearTimeout(timeouts.timer);

		e.returnValue = true;

	} else if (arg == "restart" && paused) {

		startTime += (Date.now() - pauseStart); //Jump startTime forwards to account for pause time
		paused = false;

		registerNotifications(); //Re-register notifications at current time

		e.returnValue = startTime;
	}
})

//App startup:

app.whenReady().then(() => {

	//Initialize app
	app.dock.setIcon('./icon.png');
	createWindow();

	//If user click on app again while running
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	})

}).then(registerNotifications);


app.on("window-all-closed",()=>{
	return; //Don't do anything- without this function it will close automatically
})
//App will stay running unless you explicitly close it- it needs to keep counting without showing a window.