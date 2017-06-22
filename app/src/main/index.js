import { app, BrowserWindow, Tray, Menu, ipcMain, clipboard, nativeImage, shell } from 'electron';
import path from 'path';
import clipboardWatcher from 'electron-clipboard-watcher';
import Datastore from 'nedb';
import autoLauncher from './autolauncher';
import moment from 'moment';

const iconPath = path.join(__dirname, 'icon.png');

let mainWindow;
let tray;
let db;
let preferences;
let clipboardWatcherInstance;
let cleanupInterval;

const defaultUserPreferences = {
  _id: '1',
  autoStart: true,
  expirySeconds: -1,
};

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`;

/**
 * Opens urls in external browser by default as the app is single window only.
 * @param e  event
 * @param url url
 */
const handleRedirect = (e, url) => {
  if (url !== mainWindow.webContents.getURL()) {
    e.preventDefault();
    shell.openExternal(url);
  }
};

const toggleAutoStart = (autoStart) => {
  if (autoStart) {
    autoLauncher.enable();
  } else {
    autoLauncher.disable();
  }
};

const initDB = () => {
  const dbPath = path.join(app.getPath('userData'), 'history.json');
  db = new Datastore({ filename: dbPath, autoload: true });

  const preferencesPath = path.join(app.getPath('userData'), 'preferences.json');
  preferences = new Datastore({ filename: preferencesPath, autoload: true });
  preferences.count({}, (err, count) => {
    if (count === 0) {
      preferences.insert(defaultUserPreferences, (err, res) => {
        toggleAutoStart(res);
      });
    }
  });
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
        time: moment().toDate(),
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

const configureCleanupTask = (expirySeconds) => {
  expirySeconds = Number(expirySeconds);
  const isEnabled = expirySeconds !== -1;
  if (isEnabled) {
    const cleanupTask = () => {
      const now = moment();
      const oldestPossibleEntryDate = now.subtract(expirySeconds, 'seconds');
      db.remove({ time: { $lt: oldestPossibleEntryDate.toDate() } }, { multi: true }, () => {
        sendNewHistoryToUI();
      });
    };
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
    }
    cleanupInterval = setInterval(cleanupTask, 1000);
  } else {
    clearInterval(cleanupInterval);
  }
};

const init = () => {
  mainWindow = new BrowserWindow({
    height: 550,
    width: 400,
    frame: false,
    resizable: false,
    show: false,
    fullscreenable: false,
    skipTaskbar: true,
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

  mainWindow.webContents.on('will-navigate', handleRedirect);
  mainWindow.webContents.on('new-window', handleRedirect);
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

ipcMain.on('clipboard-history-created', () => sendNewHistoryToUI());

const copyItemToClipboard = (item) => {
  clipboardWatcherInstance.stop();
  clipboard.writeText(item.text);
  initClipboardWatcher();
};

ipcMain.on('item-copied', (event, item) => copyItemToClipboard(item));

ipcMain.on('preferences-changed', (event, prefs) => {
  preferences.update({ _id: '1' }, prefs);
  toggleAutoStart(prefs.autoStart);
  configureCleanupTask(prefs.expirySeconds);
});

ipcMain.on('toolbar-created', () => {
  preferences.findOne({ _id: '1' }, (err, doc) => {
    mainWindow.webContents.send('preferences-changed', doc);
  });
});

ipcMain.on('closed', toggleWindow);
