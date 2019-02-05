const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const fs = require('fs');

require('electron-reload')(__dirname);




let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

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
  const template = [
  {
    label: 'File',
    submenu: [
      { label: 'New' },
      { label: 'Open...' },
      { label: "Save", accelerator: "CmdOrCtrl+S", selector: "save:", click: function() {
                      saveFile('hello');
                  } 
      },
      { label: 'Print' },
      { label: 'Exit', 
                click() { 
                    app.quit() 
                } 
       }
    ] 
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'Undo' },
      { role: 'Cut' },
      { role: 'Copy' },
      { role: 'Paste' }
    ]
  }, 
   {
    label: 'Format',
    submenu: [
      { label: 'Word Wrap' },
      { label: 'Font' }
    ]
  },
  {
    label: 'View',
    submenu: [
    { role: 'zoomIn' },
    { role: 'zoomOut' },
    { role: 'resetZoom' },
    { role: 'toggleFullScreen' },
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'About Electron Pad',
        click () { require('electron').shell.openExternal('https://electronjs.org') }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const openFile = () => {
  const selectedFile = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['md', 'markdown', 'txt', 'doc', 'html'] }
    ]
  });

  if (!selectedFile) { return; }

  const fileName = selectedFile[0];
  const body = fs.readFileSync(fileName).toString();
  const lastMod = getLastMod(fileName);
  app.addRecentDocument(fileName);

  mainWindow.webContents.send('file-opened', { fileName, body, lastMod});
};

const saveFile = (newBody) => {
  dialog.showSaveDialog(function (newName) {
    fs.writeFile(newName, newBody, 'utf8', (err) => {
      if (err) { throw err };
      dialog.showMessageBox({
        message: "Note saved.",
        buttons: ["Okay!"]
      });
    });
    mainWindow.webContents.send('file-saved', { newName, newBody });
  });
};

const getLastMod = (fileName) => {
  return fs.statSync(fileName).mtime;
};

exports.openFile = openFile;
exports.saveFile = saveFile;
exports.getLastMod = getLastMod;