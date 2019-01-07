// Primary file for the API

const server = require("./lib/server");
const workers = require("./lib/workers");

// Declare app
const app = {};

// Init fn
app.init = () => {
  // start the server
  server.init();
  // start the workers
  workers.init();
};

// exec
app.init();

module.exports = app;
