const http = require("http");
const port = 3000;

const routes = {
  "/": "Home",
  "/books": "Books",
  "/authors": "Authors",
  "/editors": "Editors",
  "/about": "About",
};

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(routes[req.url] || "404 - Not Found");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
