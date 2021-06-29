const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const  path  = require("path")

var startTime = Date.now();
setTimeout(()=>{
    new Notification({
        title: "Time To Get Off",
        body: "Your turn is UP!"
    })
},  3 * 1000)

setTimeout(()=>{ //5-minute warning
    new Notification({
        title: "5 Minute Warning",
        body: "Your turn is almost up!!"
    })
},  3300 * 1000)

ipcMain.on("time-sync",(e,arg)=>{
    e.returnValue = startTime;
})

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "main.js")
        }
    })

    win.loadFile('index.html')
}
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
