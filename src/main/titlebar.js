import {
  BrowserWindow,
  ipcMain,
} from 'electron'

ipcMain.on('tb:maximize', async (event, options) => {
  BrowserWindow.fromWebContents(event.sender).maximize();
});

ipcMain.on('tb:minimize', async (event, options) => {
  BrowserWindow.fromWebContents(event.sender).minimize();
});

ipcMain.on('tb:unmaximize', async (event, options) => {
  BrowserWindow.fromWebContents(event.sender).unmaximize();
});

ipcMain.on('tb:fullscreen', async (event, options) => {
  BrowserWindow.fromWebContents(event.sender).setFullScreen(true);
});

ipcMain.on('tb:unfullscreen', async (event, options) => {
  BrowserWindow.fromWebContents(event.sender).setFullScreen(false);
});

ipcMain.on('tb:close', async (event, options) => {
  BrowserWindow.fromWebContents(event.sender).close();
});


ipcMain.handle('tb:ismaximized', async (event, options) => {
  return BrowserWindow.fromWebContents(event.sender).isMaximized();
});

ipcMain.handle('tb:isfullscreened', async (event, options) => {
  return BrowserWindow.fromWebContents(event.sender).isFullScreen();
});

ipcMain.handle('tb:gettitle', async (event, options) => {
  try {
    return BrowserWindow.fromWebContents(event.sender).getTitle();
  } catch (error) {
    return BrowserWindow.fromWebContents(event.sender.getTitle());
  }
});

ipcMain.on('tb:hook', async (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  win.on("maximize", () => {
    event.sender.send("tb:maximized");
  });

  win.on("unmaximize", () => {
    event.sender.send("tb:unmaximized");
  });

  win.on("enter-full-screen", () => {
    event.sender.send("tb:fullscreened");
  });

  win.on("leave-full-screen", () => {
    event.sender.send("tb:unfullscreened");
  });

  win.on("page-title-updated", (e) => {
    event.sender.send("tb:titleupdated");
  })
})