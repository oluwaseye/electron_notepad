const { app, BrowserWindow, Menu, MenuItem, ipcMain, dialog } = require('electron')

const fs = require('fs');
let menuModule = require("./menu");
require('electron-reload')(__dirname);








let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })
mainWindow.webContents.openDevTools();
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  
     
    

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){

  createWindow()
  
  

const menu = Menu.buildFromTemplate(menuModule.appMenuTemplate)
 menu.items[0].submenu.append(new MenuItem({
   label: "New",
   click() {
     mainWindow.webContents.send('action', 'new'); 
   },
   accelerator: 'CmdOrCtrl+N' 
 }));
 
 menu.items[0].submenu.append(new MenuItem({
   label: "Open",
   click() {
     mainWindow.webContents.send('action', 'open');
   },
   accelerator: 'CmdOrCtrl+O' 
 }));
 
 menu.items[0].submenu.append(new MenuItem({
   label: "Save",
   click() {
     mainWindow.webContents.send('action', 'save'); 
   },
   accelerator: 'CmdOrCtrl+S' 
 }));
 
 menu.items[0].submenu.append(new MenuItem({
   type: 'separator'
 }));
 
 menu.items[0].submenu.append(new MenuItem({
   label: 'Exit',
   click(){
     app.quit()
   }
 }));

  Menu.setApplicationMenu(menu)
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
exports.mainWindow = mainWindow;
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.