const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(...args) {
      return ipcRenderer.send(...args);
    },
    sendTo(...args) {
      return ipcRenderer.sendTo(...args);
    },
    sendSync(...args) {
      return ipcRenderer.sendSync(...args);
    },
    invoke(...args) {
      return ipcRenderer.invoke(...args);
    },
    on(...args) {
      return ipcRenderer.on(...args);
    },
    once(...args) {
      return ipcRenderer.once(...args);
    },
    removeListener(...args) {
      return ipcRenderer.removeListener(...args);
    },
    removeAllListeners(...args) {
      return ipcRenderer.removeAllListeners(...args);
    }
  }
});


// Make the renderer able to transfer post messages
window.addEventListener('message', (e) => {
  if (e.origin !== location.origin) {
    return
  }
  if (e.data.ipcPostMessagePassthrough) {
    const {channel, data} = e.data.ipcPostMessagePassthrough;
    ipcRenderer.postMessage(channel, data, e.ports);
  }
});

contextBridge.exposeInMainWorld('TWD', {
  extensions: {
    loadExtension: (url) => new Promise((resolve, reject) => {
      const editorId = +new URLSearchParams(location.search).get('editor_id');

      const cleanup = () => {
        ipcRenderer.removeListener('load-extension/done', handleDone);
        ipcRenderer.removeListener('load-extension/error', handleError);
      }
      const handleDone = () => {
        cleanup();
        resolve();
      };
      const handleError = (event, error) => {
        cleanup();
        reject(error);
      };
      ipcRenderer.on('load-extension/done', handleDone);
      ipcRenderer.on('load-extension/error', handleError);

      ipcRenderer.sendTo(editorId, 'load-extension/start', url);
    }),
  },
});