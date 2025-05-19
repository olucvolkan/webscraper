const jsonServer = require('json-server');
const middleware = require('./middleware');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors)
server.use(middlewares);

// Parse JSON request body
server.use(jsonServer.bodyParser);

// Use custom middleware
server.use(middleware);

// Simulate a 500ms delay on all requests
server.use((req, res, next) => {
  setTimeout(next, 500);
});

// Use router
server.use(router);

// Start server
const PORT = process.env.API_PORT || 8081;
server.listen(PORT, () => {
  console.log(`Mock API Server is running on http://localhost:${PORT}`);
  console.log(`Available routes:`);
  console.log(`  GET    /scrapes`);
  console.log(`  GET    /scrapes/:id`);
  console.log(`  POST   /scrape   (to initiate scraping)`);
}); 