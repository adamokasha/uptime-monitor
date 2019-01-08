// CLI-related tasks

const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");
class _events extends events {}
const e = new _events();

// Instantiate CLI module object
const cli = {};

// Responders object
cli.responders = {};

// Input handlers
e.on("man", str => {
  cli.responders.help();
});

e.on("help", str => {
  cli.responders.help();
});

e.on("exit", str => {
  cli.responders.exit();
});

e.on("stats", str => {
  cli.responders.stats();
});

e.on("list users", str => {
  cli.responders.listUsers();
});

e.on("more user info", str => {
  cli.responders.moreUserInfo(str);
});

e.on("list checks", str => {
  cli.responders.listChecks(str);
});

e.on("more check info", str => {
  cli.responders.moreCheckInfo(str);
});

e.on("list logs", str => {
  cli.responders.listLogs();
});

e.on("more log info", str => {
  cli.responders.moreLogInfo(str);
});

// Exit
cli.responders.exit = () => {
  console.log("You asked for exit");
};

// Help / Man
cli.responders.help = () => {
  console.log("You asked for help");
};

// Exit
cli.responders.exit = () => {
  console.log("You asked to exit");
};

// Stats
cli.responders.stats = () => {
  console.log("You asked for stats");
};

// List Users
cli.responders.listUsers = () => {
  console.log("You asked to list users");
};

// More user info
cli.responders.moreUserInfo = str => {
  console.log("You asked for more user info", str);
};

// List Checks
cli.responders.listChecks = () => {
  console.log("You asked to list checks");
};

// More check info
cli.responders.moreCheckInfo = str => {
  console.log("You asked for more check info", str);
};

// List Logs
cli.responders.listLogs = () => {
  console.log("You asked to list logs");
};

// More logs info
cli.responders.moreLogInfo = str => {
  console.log("You asked for more log info", str);
};

// Input processor
cli.processInput = str => {
  str = typeof str === "string" ? str.trim() : false;
  // Only process the input if user actually wrote something, otherwise ignore
  if (str) {
    // Codify the unique strings that identify the unique questions allowed to be asked
    const uniqueInputs = [
      "man",
      "help",
      "exit",
      "stats",
      "list users",
      "more user info",
      "list checks",
      "more check info",
      "list logs",
      "more log info"
    ];

    // Go through the possible inputs, emit and event when a match is found
    let matchFound = false;
    let counter = 0;
    uniqueInputs.some(input => {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        // Emit an event matching the unique input, and include the full string given by user
        e.emit(input, str);
        return true;
      }
    });

    // If no match found tell user to try again
    if (!matchFound) {
      console.log("Sorry, try again");
    }
  }
};

// INIT script
cli.init = () => {
  // Send the start message to the console
  console.log("\x1b[34m%s\x1b[0m", "The CLI is running");

  // Start the interface
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ">"
  });

  // Create an initial prompt
  _interface.prompt();

  // handle each line of input seperately
  _interface.on("line", str => {
    // Send to the input processor
    cli.processInput(str);
  });

  // Reinitialize the prompt afterward
  _interface.prompt();

  // If user stops the CLI, kill associated process
  _interface.on("close", () => {
    process.exit(0); // 0, status code
  });
};

module.exports = cli;
