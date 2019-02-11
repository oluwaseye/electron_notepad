    const { app, dialog } = require('electron');
          const appMenuTemplate = [
            {
              label: 'File',
              submenu: [] 
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
                  label: 'About Notepad',
                  click() {
                    dialog.showMessageBox( {
                      message: 'Thanks for using the app ', 
                      type: 'info'
                    })
                  }
                }
              ]
            }
          ];

exports.appMenuTemplate = appMenuTemplate;