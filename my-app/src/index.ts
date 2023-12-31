/* eslint-disable no-mixed-spaces-and-tabs */
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import IssueTrackController from '../../src/IssueTrackController'
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
let filePath = "";
let mainWindow: BrowserWindow;
let bisectWindow: BrowserWindow;
let controller: IssueTrackController;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
	height: 800,
	width: 800,
	webPreferences: {
	  preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
	  nodeIntegration: true,
	  contextIsolation: false,
	  devTools: false
	},
  });



  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

console.log(MAIN_WINDOW_WEBPACK_ENTRY)

const createBisectWindow = (): void => {
	bisectWindow = new BrowserWindow({
		parent: mainWindow,
		height: 500,
		width: 500,
		webPreferences: {
		  preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		  nodeIntegration: true,
		  contextIsolation: false,
		  devTools: false
		},
	  });
	bisectWindow.loadFile('./src/bisect.html');
	bisectWindow.webContents.openDevTools();


}


const getFilePathDialog= () : string => {
	return(dialog.showOpenDialogSync( {
		properties: ['openFile', 'openDirectory'],
		title: "Location of .git"}))[0]
}

ipcMain.on('gitlocbtn', (event,arg) => {
	filePath = getFilePathDialog()
	controller = new IssueTrackController(filePath)
	mainWindow.webContents.send("updatepath",filePath)
})

ipcMain.on('runbisect',  (event,arg) => {
	createBisectWindow()
	controller.runBisectionStep();
	const hash = controller.getCurrCommitHash();
	mainWindow.webContents.send("runbisectReturn",hash)
	bisectWindow.webContents.send("runbisectReturnc",hash)
	
	
})



ipcMain.on('closeBisectWindow', (event, arg) => {
	bisectWindow.close()
})

ipcMain.on('bisectSendResult', (event, arg) => {
	const status = controller.runBisection(arg)
	let message = "Uh oh, something is wrong, no message was set"
	if (status === 1) {
		message = `Start of Bad Commits Found! The bad commit is: ${controller.getCurrCommitHash()}`
	} else if (status === 2) {
		message = "Hmm, there might be an error as the last commit tested is not a bad commit"
	} else if (status === 0){
		message = "More commits to come"
	}
	mainWindow.webContents.send("bisectGetResult", [arg,message])
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	createWindow()
	controller = new IssueTrackController("")

	});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
	app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
	createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
