"use strict";
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const WinState = require('electron-win-state').default
// const { autoUpdater } = require('electron-updater');
const { is } = require("electron-util");
const unhandled = require("electron-unhandled");
const debug = require("electron-debug");
const contextMenu = require("electron-context-menu");
// const config = require("./config.js");
// const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');
// const menu = require("./menu.js");

// 错误处理
unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId("com.company.ElectronAppDemo");

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow;
const winState = new WinState({})

// 创建主窗口
const createMainWindow = async () => {
	const window_ = new BrowserWindow({
		title: app.name,
		minWidth: 1366,
		minHeight: 768,
		show: false, // Use `ready-to-show` event to show window
		icon: path.join(__dirname, "static", "icon.png"),
		autoHideMenuBar: !is.development, // 隐藏导航栏
		webPreferences: {
			allowRunningInsecureContent: true, // 允许运行不安全的脚本
			nodeIntegration: true, // node集成
      nodeIntegrationInWorker: true,
			contextIsolation: false, // 修复Electron 12.0.0+报错
			webSecurity: false, // 禁用安全策略
			// enableRemoteModule: true, // 使用remote模块
			preload: path.join(__dirname, "preload.js"), // 预加载脚本
		},
    ...winState.winOptions
	});

	window_.on("ready-to-show", () => {
		window_.show();
	});

	window_.on("closed", () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	// await window_.loadFile(path.join(__dirname, "index.html"));
  await window_.loadURL("http://192.168.18.127:8080/");

  winState.manage(window_)

	return window_;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on("second-instance", () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on("window-all-closed", () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on("activate", async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

(async () => {
	await app.whenReady();
  // if (is.development) {
  //   try {
  //     // 安装Vue调试工具
  //     const name = await installExtension(VUEJS_DEVTOOLS, true);
  //     console.log(`Added Extension:  ${name}`)
  //   } catch (error) {
  //     console.log('An error occurred: ', error)
  //   }
  // }
  // 监听来自ipcRenderer的ipc-view-message自定义事件
  ipcMain.on('ipc-view-message', (evt, message) => {
    // 如果消息类型为vue
    if (message.type === 'vue') {
      // 打印消息
      console.log('ipc-view-message: ', message)
    }
  })
	// Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();

	// const webContents = mainWindow.webContents;

	// const favoriteAnimal = config.get("favoriteAnimal");
	// webContents.executeJavaScript(
	// 	`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`
	// );
})();