# FileTransfer — 跨设备文件互传

iOS App ↔ Windows 浏览器 实时文件 & 文字互传。

## 架构概览

```
┌──────────────┐       WebSocket + HTTP       ┌──────────────┐
│   iOS App    │ ◄────────────────────────── ► │ Windows 浏览器 │
│              │         中继服务器              │  (聊天界面)    │
│  发送/接收    │                               │  发送/接收     │
│  文件 & 文字  │                               │  文件 & 文字   │
└──────────────┘                               └──────────────┘
```

- **房间码机制**：iOS App 创建房间 → 获得6位房间码 → 用户在 Windows 浏览器输入房间码 → 双方连通
- **实时通信**：Socket.IO WebSocket，文字消息即时送达
- **文件传输**：HTTP 上传（支持进度）+ Socket.IO 通知

## 快速开始

```bash
# 安装依赖
npm install

# 启动服务 (默认端口 3000)
npm start
```

服务启动后会打印局域网地址，iOS App 和浏览器需在同一网络下访问。

## iOS App 接入指南

### 1. 创建房间
```http
POST /api/rooms
→ { "roomId": "uuid", "code": "ABC123", "url": "/room/ABC123" }
```

### 2. 连接 Socket.IO
```javascript
// 使用 iOS Socket.IO 客户端库
socket.emit('room:join', { roomCode: 'ABC123', clientType: 'ios' });
```

### 3. 发送文字消息
```javascript
socket.emit('message:send', { content: 'Hello from iOS!' });
```

### 4. 接收文字消息
```javascript
socket.on('message:received', (msg) => {
  // msg: { id, content, type: 'text', from, timestamp }
});
```

### 5. 发送文件
```http
POST /api/upload/:roomId
Content-Type: multipart/form-data
file: <文件>

→ { id, name, size, storedName, roomId }
```
上传成功后通知对方：
```javascript
socket.emit('file:notify', fileInfo);
```

### 6. 接收文件
```javascript
socket.on('file:received', (fileInfo) => {
  // 通过以下地址下载文件:
  const downloadUrl = `/api/download/${fileInfo.roomId}/${fileInfo.storedName}`;
});
```

### 7. 下载文件到 iOS Files 文件夹
在 iOS App 中，收到 `file:received` 事件后，用 URLSession 下载文件并保存到 `FileManager.default.urls(for: .documentDirectory)` 对应的目录，iOS 的 Files App 即可访问。

## 项目结构

```
file-transfer-web/
├── server.js           # Node.js + Express + Socket.IO 后端
├── package.json
├── public/
│   ├── index.html      # SPA 聊天界面
│   ├── css/style.css   # 样式设计
│   └── js/app.js       # 前端逻辑
└── uploads/            # 文件临时存储（自动清理24h过期）
```

## API 参考

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/rooms` | 创建新房间 |
| GET | `/api/rooms/:code` | 查询房间状态 |
| POST | `/api/upload/:roomId` | 上传文件 |
| GET | `/api/download/:roomId/:storedName` | 下载文件 |
| GET | `/room/:code` | 浏览器聊天界面入口 |
