const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require("path");

//Set up app constants
const startTime = Date.now();
const turnLengthMS = 6000//60 * 60 * 1000;
const fiveMinutesMS = 5000//5 * 60 * 1000;

var win = null; //Will store current window object once created

function registerNotifications() { //Sets up time warning notifications
	setTimeout(() => {
		//Time Up Notification

		if (BrowserWindow.getAllWindows().length === 0) { //Have to make sure window exists before focusing
			createWindow();
		}
		win.focus(); //Focus the window, to make sure user notices

		new Notification({
			title: "Time To Get Off",
			body: "Your turn is UP!"
		}).show();

	}, turnLengthMS)

	setTimeout(() => { //5-minute warning
		new Notification({
			title: "5 Minute Warning",
			body: "Your turn is almost up!!"
		}).show();

	}, turnLengthMS - fiveMinutesMS)
}


//Communication with render process
ipcMain.on("time-sync", (e, arg) => {
	//Gets the app's startTime
	e.returnValue = startTime;
})
ipcMain.on("time-getLength", (e, arg) => {
	//Gets turn length
	e.returnValue = turnLengthMS;
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
