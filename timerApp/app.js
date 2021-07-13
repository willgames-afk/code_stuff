const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require("path");

//Set up app constants
var startTime = Date.now();
const turnLengthMS = 6000//60 * 60 * 1000;
const fiveMinutesMS = 5000//5 * 60 * 1000;
var pauseStart = null;
var paused = false;

var win = null; //Will store current window object once created

var timeouts = {
	fiveMins: null,
	noMins: null
}

function registerNotifications() { //Sets up time warning notifications
	timeouts.noMins = setTimeout(() => {
		//Time Up Notification

		if (BrowserWindow.getAllWindows().length === 0) { //Have to make sure window exists before focusing
			createWindow();
		}
		win.focus(); //Focus the window, to make sure user notices

		new Notification({
			title: "Time To Get Off",
			body: "Your turn is UP!"
		}).show();

	}, turnLengthMS - (Date.now() - startTime))

	timeouts.fiveMins = setTimeout(() => { //5-minute warning
		new Notification({
			title: "5 Minute Warning",
			body: "Your turn is almost up!!"
		}).show();

	},(turnLengthMS - fiveMinutesMS) - (Date.now()- startTime))
}


//Communication with render process
ipcMain.on("time-sync", (e, arg) => {
	console.log(`Time Sync!`)
	//Gets the app's startTime
	e.returnValue = startTime;
})
ipcMain.on("time-getLength", (e, arg) => {
	console.log(`GetLength!`)
	//Gets turn length
	e.returnValue = turnLengthMS;
})

ipcMain.on("state-update",(e,arg)=>{
	console.log(`State Update to ${arg}`)
	if (arg == "pause" && !paused) {
		pauseStart = Date.now();
		paused = true;
		clearTimeout(timeouts.fiveMins);
		clearTimeout(timeouts.noMins);
		e.returnValue = true;
	} else if (arg == "restart" && paused) {
		startTime += (Date.now()-pauseStart);
		paused = false;
		registerNotifications();
		e.returnValue = startTime;
	}
})
ipcMain.on("state",(e,arg)=>{
	console.log(`Get State!`)
	if (paused) {
		e.returnValue =  "paused";
	} else {
		e.returnValue =  "unpaused"
	}
})


function createWindow() { //Creates a window into the win variable
	win = new BrowserWindow({
		width: 400,
		height: 120,
		backgroundColor: "#17171700",
		webPreferences: {
			preload: path.join(__dirname, "main.js")
		}
	})
	win.loadFile('index.html');
}

app.whenReady().then(() => {
	app.dock.setIcon('./icon.png');
	createWindow();

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	})
}).then(registerNotifications);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})
