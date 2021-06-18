const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');

const appName = "KStudio";

const scriptPath = path.join(__dirname, "src/js");
const isMac = (process.platform === 'darwin');
const menuTemplate = [ //Menu found at top of screen
    ...(isMac ? [{
        label: appName,
        submenu: [
            {role: 'about'},
            {role: 'seperator'},
            {role: 'services'},
            {role: 'seperator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {role: 'superator'},
            {role: 'quit'},
        ]
    }] : [])
]

function makeWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(scriptPath, 'preload.js')
        },
        backgroundColor: "#FFFFFF",
        parent: 'top',
        title: appName
    })

    win.loadFile("index.html")
}

app.whenReady().then(()=>{

    app.name = appName

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu)
    //app.applicationMenu = menu;

    makeWindow();

    console.log(app.dock)

    app.on('activate',function (){
        if (BrowserWindow.getAllWindows().length === 0) {
            makeWindow();
        }
    })
})

app.on('window-all-closed',function () {
    if (process.platform !== 'darwin') app.quit(); //MacOS keeps apps running even after all their window are closed
})