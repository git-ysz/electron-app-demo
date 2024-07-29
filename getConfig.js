const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const { is } = require("electron-util");

function getSystem() {
	//这是mac系统
	if (process.platform == "darwin") {
		return 1;
	}
	//这是windows系统
	if (process.platform == "win32") {
		return 2;
	}
	//这是linux系统
	if (process.platform == "linux") {
		return 3;
	}
}

/**
 *
 * @returns 获取安装路径
 */
function getExePath() {
	if (is.development) {
		return ".";
	}
	return path.dirname(app.getPath("exe"));
}

/**
 *
 * @returns 获取配置文件路径
 */
function getConfigPath() {
	if (getSystem() === 1) {
		return getExePath() + "/config.json";
	} else {
		return getExePath() + "\\config.json";
	}
}

/**
 * 读取配置文件
 */
function getConfig() {
	return new Promise((res, rej) => {
		fs.readFile(getConfigPath(), "utf-8", (err, data) => {
			let config = {
				URL: "https://www.baidu.com/",
			};
			if (data) {
				config = JSON.parse(data);
			}
			res(config);
		});
	});
}

module.exports = { getSystem, getConfigPath, getConfig };
