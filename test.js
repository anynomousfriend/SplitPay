const http = require('http');
http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.length > 0 ? "Server running" : "No data"));
}).on('error', err => console.log("Error:", err.message));
