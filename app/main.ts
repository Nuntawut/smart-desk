import {app, BrowserWindow, ipcMain, Tray, Menu} from 'electron';
import { autoUpdater } from "electron-updater"
import * as path from 'path';
import * as fs from 'fs';
import log from 'electron-log';

require('update-electron-app')({
  repo: 'github-user/repo',
  updateInterval: '1 hour',
  logger: log
})

const serverPort = 5432; // Replace with the actual port number of your UDP server
const serverAddress = '203.158.7.77'; // Replace with the IP address of your UDP server
//const serverAddress = '127.0.0.1';

let mainWindow: BrowserWindow | null = null;
let secondaryWindow: BrowserWindow | null = null;
let appTray = null
let isQuitting = false;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

// Custom function to handle quitting from the system tray menu
function quitFromTray() {
  isQuitting = true;
  // Close the main window gracefully
  mainWindow?.close();
}

function createPopupWindow (task_description:string ,video_id:string) {
  
  secondaryWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minimizable: false,
    alwaysOnTop: true,
    movable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });

  secondaryWindow.loadFile(path.join(__dirname, 'popup.html'))

  secondaryWindow.setMenu(null);
  //secondaryWindow.setMenuBarVisibility(false);

  secondaryWindow.webContents.on('did-finish-load', () => {
    secondaryWindow?.webContents.send('data-from-main', { message: video_id });
  });

  // Listening for the message from the renderer process
  ipcMain.once('data-from-renderer', (event, data) => {

    console.log('Received data from renderer:', data);

    secondaryWindow?.close()

    mainWindow?.webContents.send('data-from-main', {
      task_description: task_description,
      status: data.status,
      totalDuration: data.totalDuration,
    })
  });

  secondaryWindow.on('closed', () => {
      secondaryWindow = null;
  });

  return secondaryWindow;
}
function createWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 800,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    mainWindow.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }
  
    const url = new URL(path.join('file:', __dirname, pathIndex));
    mainWindow.loadURL(url.href);

    //mainWindow.setMenu(null);
    //Hide the menu bar
    //mainWindow.setMenuBarVisibility(false);
  }
  // Hide the window instead of closing it
  mainWindow.on('close', (event) => {
     // Check if the window was closed via the system tray menu "Quit" option
     if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      //mainWindow?.hide();
    }, 2000);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

try {
  app.on('ready', () => {
    
    setTimeout(createWindow, 400)

    const iconPath = path.join(__dirname, 'images/eng-logo.png');

    appTray = new Tray(iconPath)
    
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => { mainWindow?.show()}},
        { label: 'Quit', click: () => { quitFromTray();}}
      ]);
  
    appTray.setToolTip('Electron App');

    // Call this again for Linux because we modified the context menu
    appTray.setContextMenu(contextMenu)

    ipcMain.on('angular-to-main', (event, data) => {
      console.log('Message:', data);
      const { task_description, video_id, mode } = JSON.parse(data);

      console.log('task_description:', task_description);
      console.log('Video_id:', video_id);
      console.log('mode:', mode);

      if (secondaryWindow === null) {
        createPopupWindow(task_description, video_id);
      }
      
    });

    appTray.on('click', () => {
      if (mainWindow?.isVisible()) {
        mainWindow?.hide();
      } else {
        mainWindow?.show();
      }
    });

  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  });

  app.setLoginItemSettings({
    openAtLogin: false,
  });

} catch (e) {
  // Catch Error
  // throw e;
}

