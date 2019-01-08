// Primary file for the API

const server = require("./lib/server");
const workers = require("./lib/workers");
const cli = require("./lib/cli");

// Declare app
const app = {};

// Init fn
app.init = () => {
  // start the server
  server.init();
  // start the workers
  workers.init();
  // Start the CLI, but make sure it starts last
  setTimeout(() => {
    cli.init();
  }, 50);
};

// exec
app.init();

module.exports = app;
