const { ipcRenderer, remote } =  require('electron');
const { Menu, MenuItem, dialog } = remote;

var Quill = require('quill')
var options = {
  theme: 'snow'
};

var editor = new Quill('#editor', options);

let currentFile = null; 
let isSaved = true;     
let txtEditor = document.getElementById('editor'); 

document.title = "Notepad - Untitled"; 


const contextMenuTemplate=[
    { role: 'undo' },       
    { role: 'redo' },       
    { type: 'separator' },  
    { role: 'cut' },        
    { role: 'copy' },       
    { role: 'paste' },      
    { role: 'delete' },     
    { type: 'separator' }, 
    { role: 'selectall' }   
];
const contextMenu=Menu.buildFromTemplate(contextMenuTemplate);
txtEditor.children[0].addEventListener('contextmenu', (e) => {
    e.preventDefault();
    contextMenu.popup(remote.getCurrentWindow());
});


txtEditor.children[0].oninput = (e) => {
    if(isSaved) document.title += " *";
    isSaved=false;
};


ipcRenderer.on('action', (event, arg) => {
    switch(arg){        
    case 'new': 
        askSaveIfNeed();
        currentFile=null;
        txtEditor.children[0].innerHTML = '';
        document.title = "Notepad - Untitled";
        isSaved=true;
        break;
    case 'open': 
        askSaveIfNeed();
        const files = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            filters: [
                { name: "Text Files", extensions: ['txt', 'js', 'html', 'md'] }, 
                { name: 'All Files', extensions: ['*'] } ],
            properties: ['openFile']
        });
        if(files){
            currentFile=files[0];
            const txtRead=readText(currentFile);
            txtEditor.children[0].innerHTML = txtRead;
            document.title = "Notepad - " + currentFile;
            isSaved=true;
        }
        break;
    case 'save': 
        saveCurrentDoc();
        break;
    case 'exiting':
        askSaveIfNeed();
        ipcRenderer.sendSync('reqaction', 'exit');
        break;
    }
});


function readText(file){
    const fs = require('fs');
    return fs.readFileSync(file, 'utf8');
}

function saveText(text, file){
    const fs = require('fs');
    fs.writeFileSync(file, text, 'utf8', (err) => {
      if (err) { throw err };
      dialog.showMessageBox({
        message: "Note saved.",
        buttons: ["Okay!"]
      });
    });
}


function saveCurrentDoc(){
    if(!currentFile){
        const file = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
            filters: [
                { name: "Text Files", extensions: ['txt', 'js', 'html', 'md'] }, 
                { name: 'All Files', extensions: ['*'] } ]
        });
        if(file) currentFile=file;
    }
    if(currentFile){
        const txtSave = txtEditor.children[0].innerHTML;
        saveText(txtSave, currentFile);
        isSaved=true;
        document.title = "Notepad - " + currentFile;
    }
}


function askSaveIfNeed(){
    if(isSaved) return;
    const response= dialog.showMessageBox({
       message: 'Do you want to save the current document?',
         type: 'question',
         buttons: ['Yes', 'No']
     })
    if(response==0) saveCurrentDoc(); 
}