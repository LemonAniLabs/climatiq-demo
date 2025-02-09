const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.type('html').send(html));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

// 指定靜態資源目錄 (例如 HTML, CSS, JavaScript, 圖片等)
app.use(express.static('public')); // 假設你的靜態檔案放在名為 "public" 的資料夾中

// 定義根路徑的路由，當用戶訪問根路徑 "/" 時，預設會尋找 public 資料夾下的 index.html
// 如果你的首頁 HTML 檔案不是 index.html，你可能需要明確指定檔案名，例如：
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/你的首頁檔案名.html');
// });

app.listen(port, () => {
  console.log(`伺服器已啟動，監聽端口 ${port}`);
});