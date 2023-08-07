const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  sendToMain: (channel, data) => {
    console.log("sendToMain Sending", data)
    ipcRenderer.send(channel, data);
  },
  receiveFromMain: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
});