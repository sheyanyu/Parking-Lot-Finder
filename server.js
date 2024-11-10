const express = require('express');
const path = require('path');
const app = express();

// 设置端口
const PORT = 4000;

// 设置前端静态文件目录
// 使用 path.join() 跳转到上一级目录并指向 Front-End
app.use(express.static(path.join(__dirname, 'Parking-Lot-Finder')));

// 设置后端静态文件目录
app.use('/Back-End', express.static(path.join(__dirname, '../Back-End')));

// 处理前端页面的默认入口请求
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Front-End/main-page/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器正在 http://localhost:${PORT} 运行`);
});
