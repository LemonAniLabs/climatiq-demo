const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// 指定靜態資源目錄
app.use(express.static('public'));

const server = app.listen(port, () => {
  console.log(`伺服器已啟動，監聽端口 ${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;