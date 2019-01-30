// var Quill = require('quill')
// var container = document.getElementById('editor');
// var options = {
//   theme: 'snow'
// };

// var editor = new Quill('#editor', options);

const dialog = require('electron').dialog
const fs = require('fs');

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

  //mainWindow.webContents.send('file-opened', { fileName, body, lastMod});
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
