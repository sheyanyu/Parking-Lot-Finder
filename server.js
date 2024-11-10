// const express = require('express');
// const path = require('path');
// const app = express();

// // 设置端口
// const PORT = 4000;

// // 设置前端静态文件目录
// // 这里需要确保路径和文件夹结构匹配，比如你想提供 'Front-End/main-page/index.html'
// app.use(express.static(path.join(__dirname, 'Front-End/main-page')));

// // 处理前端页面的默认入口请求
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'Front-End/main-page/index.html'));
// });

// // 启动服务器
// app.listen(PORT, () => {
//     console.log(`服务器正在 http://localhost:${PORT} 运行`);
// });
