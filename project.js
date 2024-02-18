const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

const rootDir = path.join(__dirname, 'C:/CS50 Final Project/public');
const filePath = path.join(rootDir, req.url);
fs.readFile(filePath, (err, data) => {
if (err) {
res.writeHead(404, { 'Content-Type': 'text/plain' });
res.end('404 Not Found');
} else {

  let contentType = 'text/html';  
  if (filePath.endsWith('.css')) {  
    contentType = 'text/css';  
  } else if (filePath.endsWith('.js')) {  
    contentType = 'application/javascript';  
  }  
  res.writeHead(200, { 'Content-Type': contentType });  
  res.end(data);  
}  
});
});

const port = 3000;
server.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});