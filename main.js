// main

const { app, BrowserWindow, screen, ipcMain } = require('electron');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

const expressApp = express();
const server = http.createServer(expressApp);
const wss = new WebSocket.Server({ server });
expressApp.use(express.static(path.join(__dirname, 'public')));


app.whenReady().then(() => {
    
    // ★★★ 最终核心修改：智能判断数据存储路径 ★★★
    let dataPath;
    if (app.isPackaged) {
        // 如果是打包后的版本（免安装版），则将数据存储在.exe文件所在的目录
        dataPath = path.dirname(app.getPath('exe'));
        console.log(`程序已打包 (免安装版)，数据路径设置为: ${dataPath}`);
    } else {
        // 如果是在开发环境中（npm start），则依然保存在项目根目录
        dataPath = __dirname;
        console.log(`开发模式，数据路径设置为: ${dataPath}`);
    }
    const SIGNATURES_DIR = path.join(dataPath, 'signatures_history');
    
    
    // 后续所有逻辑都和之前一样，现在它们将在正确的路径下工作
    if (!fs.existsSync(SIGNATURES_DIR)) {
        fs.mkdirSync(SIGNATURES_DIR, { recursive: true });
    }

    let signatures = [];

    function loadSignatures() {
        try {
            const files = fs.readdirSync(SIGNATURES_DIR).filter(f => f.endsWith('.png')).sort();
            signatures = files.map(file => {
                const filePath = path.join(SIGNATURES_DIR, file);
                const dataURL = `data:image/png;base64,${fs.readFileSync(filePath, 'base64')}`;
                return { id: file, dataURL: dataURL };
            });
            console.log(`成功从路径 ${SIGNATURES_DIR} 加载了 ${signatures.length} 条历史签名。`);
        } catch (err) {
            console.error('加载历史签名文件夹失败:', err);
        }
    }

    loadSignatures();

    function broadcastUpdate(newSignatureId = null) {
        loadSignatures();
        const messagePayload = { allSignatures: signatures, newSignatureId: newSignatureId };
        const message = JSON.stringify({ type: 'update', payload: messagePayload });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) client.send(message);
        });
        console.log('已向所有客户端广播最新状态。');
    }

    wss.on('connection', (ws) => {
        const initialPayload = { allSignatures: signatures, newSignatureId: null };
        ws.send(JSON.stringify({ type: 'update', payload: initialPayload }));

        ws.on('message', (rawMessage) => {
            const message = JSON.parse(rawMessage);
            switch (message.type) {
                case 'add':
                    const dataURL = message.payload;
                    const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
                    const fileName = `${Date.now()}.png`;
                    fs.writeFileSync(path.join(SIGNATURES_DIR, fileName), base64Data, 'base64');
                    broadcastUpdate(fileName);
                    break;
                case 'delete':
                    const fileToDelete = message.payload;
                    const pathToDelete = path.join(SIGNATURES_DIR, fileToDelete);
                    if (fs.existsSync(pathToDelete)) fs.unlinkSync(pathToDelete);
                    broadcastUpdate();
                    break;
            }
        });
    });

    createWindow();
});


// 其他代码（ipcMain, createWindow, 启动逻辑等）保持不变
let galleryWindow = null;
const PORT = 3000;
server.listen(PORT, () => { console.log(`后台服务已启动，正在监听 ${PORT} 端口`); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() });

function createWindow() {
    const displays = screen.getAllDisplays();
    const externalDisplay = displays.find(d => d.bounds.x !== 0 || d.bounds.y !== 0);
    const signatureWindow = new BrowserWindow({
        // width: 1200,  // <-- 移除这两行
        // height: 800,
        fullscreen: true, // ★★★ 新增：让签名窗口也全屏 ★★★
        webPreferences: { preload: path.join(__dirname, 'preload.js') }
    });
    const displayWindow = new BrowserWindow({ fullscreen: true, x: externalDisplay ? externalDisplay.bounds.x : undefined, y: externalDisplay ? externalDisplay.bounds.y : undefined, webPreferences: { preload: path.join(__dirname, 'preload.js') } });
    signatureWindow.loadURL(`http://localhost:${PORT}/index.html`);
    displayWindow.loadURL(`http://localhost:${PORT}/display.html`);
}
ipcMain.on('open-gallery-window', () => {
    if (galleryWindow) { galleryWindow.focus(); return; }
    galleryWindow = new BrowserWindow({ width: 400, height: 600, title: '历史签名画廊', webPreferences: { preload: path.join(__dirname, 'preload.js') } });
    galleryWindow.loadURL(`http://localhost:${PORT}/gallery.html`);
    galleryWindow.on('closed', () => { galleryWindow = null; });
});