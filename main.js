const { app, BrowserWindow, Menu } = require('electron')
// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

const template = [
  {
    label: 'File',
    submenu: [
      { label: 'New' },
      { label: 'Open...' },
      { label: 'Save' },
      { label: 'Save As...' },
      { label: 'Page Setup...' },
      { label: 'Print' },
      { label: 'Exit' }
    ] 
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'Undo' },
      { role: 'Cut' },
      { role: 'Copy' },
      { role: 'Paste' },
      { label: 'Delete' },
      { label: 'Find...' },
      { label: 'Find Next' },
      { label: 'Replace...' },
      { label: 'Go To...' },
      { label: 'Select All' },
      { label: 'Time/Date' }
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
      { label: 'Status Bar' }
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

let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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