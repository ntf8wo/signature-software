// main.js - 最终版 V4 - 支持广播新签名ID

const { app, BrowserWindow, screen, ipcMain } = require('electron');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

const SIGNATURES_DIR = path.join(__dirname, 'signatures_history'); 
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
        console.log(`成功从文件夹加载了 ${signatures.length} 条历史签名。`);
    } catch (err) {
        console.error('加载历史签名文件夹失败:', err);
    }
}
loadSignatures();

const expressApp = express();
const server = http.createServer(expressApp);
const wss = new WebSocket.Server({ server });

// ★★★ 核心修改：广播函数现在可以接收一个可选的 newSignatureId ★★★
function broadcastUpdate(newSignatureId = null) {
    loadSignatures();
    const messagePayload = {
        allSignatures: signatures,
        newSignatureId: newSignatureId // 附带新签名的ID
    };
    const message = JSON.stringify({ type: 'update', payload: messagePayload });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) client.send(message);
    });
    console.log('已向所有客户端广播最新状态。');
}

expressApp.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', (ws) => {
    console.log('一个新的客户端已连接!');
    // 客户端一连接，就立刻把当前完整的签名列表发给他
    const initialPayload = { allSignatures: signatures, newSignatureId: null };
    ws.send(JSON.stringify({ type: 'update', payload: initialPayload }));

    ws.on('message', (rawMessage) => {
        try {
            const message = JSON.parse(rawMessage);
            switch (message.type) {
                case 'add':
                    const dataURL = message.payload;
                    const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
                    const fileName = `${Date.now()}.png`;
                    fs.writeFileSync(path.join(SIGNATURES_DIR, fileName), base64Data, 'base64');
                    // ★ 调用广播时，传入新的文件名作为ID
                    broadcastUpdate(fileName); 
                    break;
                case 'delete':
                    const fileToDelete = message.payload;
                    const pathToDelete = path.join(SIGNATURES_DIR, fileToDelete);
                    if (fs.existsSync(pathToDelete)) fs.unlinkSync(pathToDelete);
                    // ★ 删除时，不传入ID
                    broadcastUpdate(); 
                    break;
            }
        } catch (err) { console.error('处理指令失败:', err); }
    });
});

// 其他代码（ipcMain, createWindow, 启动逻辑等）与上一版完全相同，为保证完整性，全部粘贴于此
let galleryWindow = null;
ipcMain.on('open-gallery-window', () => { /* ... 此处代码无变化 ... */ });
function createWindow() { /* ... 此处代码无变化 ... */ }
const PORT = 3000;
server.listen(PORT, () => { console.log(`后台服务已启动，正在监听 ${PORT} 端口`); app.whenReady().then(createWindow); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() });

// 为保证完整性，将函数代码也粘贴在此
function createWindow() {
    const displays = screen.getAllDisplays();
    const externalDisplay = displays.find(d => d.bounds.x !== 0 || d.bounds.y !== 0);
    const signatureWindow = new BrowserWindow({ width: 1200, height: 800, webPreferences: { preload: path.join(__dirname, 'preload.js') } });
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