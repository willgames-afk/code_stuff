

const { app, BrowserWindow } = require('electron')
function createWindow() {
    const win = new BrowserWindow({
        width: 640 + 515,
        height: 480,
        backgroundColor: "white"
    });
    win.loadFile('index.html');
    console.dir(win);
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
   /* if (process.platform !== 'darwin')*/ app.quit() //Not quitting on window close is annoying during dev
})