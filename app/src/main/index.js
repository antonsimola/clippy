import { app, BrowserWindow, Tray, Menu, ipcMain, clipboard, nativeImage } from 'electron';
import path from 'path';
import clipboardWatcher from 'electron-clipboard-watcher';
import Datastore from 'nedb';

let mainWindow;
let tray;
let db;
let clipboardWatcherInstance;
const iconPath = path.join(__dirname, 'icon.png');


const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`;

const initDB = () => {
  const dbPath = path.join(app.getPath('userData'), 'history.db');
  db = new Datastore({ filename: dbPath, autoload: true });
};

const sendNewHistoryToUI = () => {
  db.find({}).sort({ time: -1 }).exec((err, history) => {
    mainWindow.webContents.send('history-changed', history);
  });
};

const initClipboardWatcher = () => {
  clipboardWatcherInstance = clipboardWatcher({
    watchDelay: 500,
    onImageChange: () => console.log('changed'),
    onTextChange: (text) => {
      db.insert({
        text,
        time: new Date(),
      }, sendNewHistoryToUI);
    },
  });
};

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
  const y = Math.round(trayBounds.y - windowBounds.height) - 4;
  return { x, y };
};

const showWindow = () => {
  const pos = getWindowPosition();
  mainWindow.setPosition(pos.x, pos.y, false);
  mainWindow.show();
  mainWindow.focus();
};

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
};

const quit = () => {
  mainWindow = null;
  app.quit();
};

const init = () => {
  mainWindow = new BrowserWindow({
    height: 550,
    width: 400,
    frame: false,
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      backgroundThrottling: false,
    },
  });
  const trayImage = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayImage);
  tray.on('click', toggleWindow);

  tray.on('double-click', toggleWindow);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', click: quit },
  ]);

  tray.setContextMenu(contextMenu);

  mainWindow.loadURL(winURL);
  const pos = getWindowPosition();

  mainWindow.setPosition(pos.x, pos.y, false);
  initDB();
  initClipboardWatcher();
};

app.on('ready', init);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    init();
  }
});

ipcMain.on('created', () => sendNewHistoryToUI());

const copyItemToClipboard = (item) => {
  clipboardWatcherInstance.stop();
  clipboard.writeText(item.text);
  initClipboardWatcher();
};
ipcMain.on('item-copied', (event, item) => copyItemToClipboard(item));
