import {app, BrowserWindow, ipcMain, Tray, Menu, dialog, screen} from 'electron';
import * as path from 'path';
import * as fs from 'fs';

import { autoUpdater } from "electron-updater"
const log = require('electron-log');

log.transports.file.level = 'debug'; // Set the log level

let mainWindow: BrowserWindow | null = null;
let secondaryWindow: BrowserWindow | null = null;
let appTray = null
let isQuitting = false;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function quitFromTray() {
  isQuitting = true;
  mainWindow?.close();
}

//------------------------PopupWindow-------------------------------
function createPopupWindow (task_description:string ,video_id:string) {

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  
  console.log(width,height)
  
  secondaryWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    minimizable: false,
    alwaysOnTop: true,
    movable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });

  secondaryWindow.loadFile(path.join(__dirname, 'popup.html'))

  secondaryWindow.setMenu(null);

  secondaryWindow.webContents.on('did-finish-load', () => {
    secondaryWindow?.webContents.send('data-from-main', { message: video_id, width: width, height: height-150});
  });

  ipcMain.once('data-from-renderer', (event, data) => {
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

//------------------------MainWindow-------------------------------
function createWindow(): BrowserWindow {

  mainWindow = new BrowserWindow({
    width: 520,
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

    mainWindow.setMenu(null);

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

  // Log update events using electron-log
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
  });

  autoUpdater.on('update-available', (info:any) => {
    log.info(`Update available: ${info.version}`);
  });

  autoUpdater.on('update-not-available', () => {
    log.info('No update available');
  });

  autoUpdater.on('error', (error:any) => {
    log.error('Error while checking for updates:', error);
  });

  autoUpdater.on('download-progress', (progressObj:any) => {
    log.info("\n\nDownload progres");
    log.info(progressObj);
  });

  autoUpdater.on('update-downloaded', (info:any) => {
    log.info('Update downloaded', info);
    // Prompt the user to install the update
    dialog.showMessageBox({
      type: 'info',
      title: 'รายการอัพเดทพร้อมติดตั้ง',
      message: 'รายการอัพเดทพร้อมติดตั้ง รีสตาร์ทเพื่อติดตั้ง',
      buttons: ['รีสตาร์ท', 'ภายหลัง']
    }).then((result) => {
      if (result.response === 0) {
        // User chose to restart and install the update
        autoUpdater.quitAndInstall();
      }
    });
  });

  app.on('ready', () => {
  
    setTimeout(createWindow, 400)

    // Configure autoUpdater
    autoUpdater.checkForUpdatesAndNotify()
    
    //Configure Try Icon
    const iconPath = path.join(__dirname, 'images/favicon.png');
    appTray = new Tray(iconPath)
    const contextMenu = Menu.buildFromTemplate([
        { label: 'เปิดโปรแกรม', click: () => { mainWindow?.show()}},
        { label: 'ออกจากโปรแกรม', click: () => { quitFromTray();}}
      ]);
    appTray.setToolTip('Desk Health');
    appTray.setContextMenu(contextMenu)
    appTray.on('click', () => {
      if (mainWindow?.isVisible()) {
        mainWindow?.hide();
      } else {
        mainWindow?.show();
      }
    });

    //Receive data from Angular
    ipcMain.on('angular-to-main', (event, data) => {

      const { task_description, video_id, mode } = JSON.parse(data);

      if (secondaryWindow === null && mode=="1") {
        createPopupWindow(task_description, video_id);
      }else{
        console.log('Popup:', mode);
      }
    });

    //Receive MessageBox from Angular
    ipcMain.on('showMessageBox', (event, arg) => {
      dialog.showMessageBox({
        type: 'info',
        title: arg.title || 'Message',
        message: arg.message || 'No message provided',
        buttons: arg.buttons || ['OK']
      }).then((result) => {
        if (result.response === 0 && arg.navigateToNextPage) {
            mainWindow?.webContents.send('resMessageBox', {
              message: "OK"
            })
        }
      });
    });

  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });

  app.setLoginItemSettings({
    openAtLogin: true,
  });

} catch (e) {
  app.quit();
}

