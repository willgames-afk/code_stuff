const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');

const appName = "KStudio";

const scriptPath = path.join(__dirname, "src/js");
const isMac = (process.platform === 'darwin');
const menuTemplate = [ //Menu found at top of screen
    ...(isMac ? [{
        label: "KStudio",
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services'},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'},
        ]
    }] : [])
]

const menu = Menu.buildFromTemplate(menuTemplate);
//Menu.setApplicationMenu(menu)

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

    /*const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu)
    //app.applicationMenu = menu;*/

    makeWindow();

    console.log(app.dock)

    app.on('activate',function (){
        if (BrowserWindow.getAllWindows().length === 0) {
            makeWindow();
        }
    })
})

app.on('window-all-closed',function () {
    app.quit(); //MacOS keeps apps running even after all their window are closed
})