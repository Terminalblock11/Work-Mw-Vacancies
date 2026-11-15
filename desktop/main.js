const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

app.setAppUserModelId('com.workmw.vacancygenerator');

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  let win;
  app.on('second-instance', () => {
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
  });

  const external = (url) => { if (/^(https?|mailto):/i.test(url)) shell.openExternal(url); };

  function createWindow() {
    Menu.setApplicationMenu(null);
    win = new BrowserWindow({
      width: 1280,
      height: 860,
      minWidth: 900,
      minHeight: 600,
      backgroundColor: '#eef2f9',
      title: 'WorkMw Vacancies',
      icon: path.join(__dirname, 'build', 'icon.png'),
      autoHideMenuBar: true,
      webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false }
    });
    win.loadFile(path.join(__dirname, 'www', 'index.html'));
    // links, Gmail and mailto open in the normal browser / mail app
    win.webContents.setWindowOpenHandler(({ url }) => { external(url); return { action: 'deny' }; });
    win.webContents.on('will-navigate', (e, url) => {
      if (!url.startsWith('file:')) { e.preventDefault(); external(url); }
    });
  }

  app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });
  app.on('window-all-closed', () => { app.quit(); });
}
