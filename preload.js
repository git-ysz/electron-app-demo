const { ipcRenderer } = require('electron')

// ipcRenderer.send('ipc-view-message', '123')

// window.addEventListener('DOMContentLoaded', () => {
//   // 对页面进行操作
//   console.log(document.querySelector('#app').innerText);
// })
window.addEventListener('message', (event) => {
  ipcRenderer.send('ipc-view-message', event.data)
})
