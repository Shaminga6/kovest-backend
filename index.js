/**
 * Server entry file
 */

// modules
const DB = require('./database');
const app = require('./app');
const config = require('./config/config');

// verify db connection and start server
let server;
DB.authenticate().then(() => {
  console.info(`Connected to ${config.db.dialect} database.`);
  server = app.listen(config.port, () => {
    console.info(`Listening to port ${config.port}`);
  });
});

// exit handler func
function exitHandler() {
  if (server) {
    server.close(() => {
      console.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// unexpected handler func
function unexpectedErrorHandler(error) {
  console.error(error);
  exitHandler();
};

// node process runtime errors
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
  console.info('SIGTERM received');
  if (server) {
    server.close();
  }
});