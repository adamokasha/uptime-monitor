// worker-related tasks

const path = require("path");
const fs = require("fs");
const _data = require("./data");
const https = require("https");
const http = require("http");
const helpers = require("./helpers");
const url = require("url");
const _logs = require("./logs");

// instantiate woker object
const workers = {};

// lookup all checks, get their data, send to validator
workers.gatherAllChecks = () => {
  // Get all the checks
  _data.list("checks", (err, checks) => {
    if (!err && checks && checks.length) {
      checks.forEach(check => {
        // Read in the check data
        _data.read("checks", check, (err, originalCheckData) => {
          if (!err && originalCheckData) {
            // Pass data to check validator, and let that function continue or log errors as needed
            workers.validateCheckData(originalCheckData);
          } else {
            console.log("Error reading one of the checks data");
          }
        });
      });
    } else {
      console.log("Error: Could not find any checks to process");
    }
  });
};

// Sanity-check the check data: need to check it has the required data
workers.validateCheckData = originalCheckData => {
  originalCheckData =
    typeof originalCheckData === "object" && originalCheckData !== null
      ? originalCheckData
      : {};
  originalCheckData.id =
    typeof originalCheckData.id === "string" &&
    originalCheckData.id.trim().length === 20
      ? originalCheckData.id.trim()
      : false;
  originalCheckData.userPhone =
    typeof originalCheckData.userPhone === "string" &&
    originalCheckData.userPhone.trim().length === 10
      ? originalCheckData.userPhone.trim()
      : false;
  originalCheckData.protocol =
    typeof originalCheckData.protocol === "string" &&
    ["http", "https"].indexOf(originalCheckData.protocol) > -1
      ? originalCheckData.protocol
      : false;
  originalCheckData.url =
    typeof originalCheckData.url === "string" &&
    originalCheckData.url.trim().length > 0
      ? originalCheckData.url.trim()
      : false;
  originalCheckData.method =
    typeof originalCheckData.method === "string" &&
    ["post", "get", "put", "delete"].indexOf(originalCheckData.method) > -1
      ? originalCheckData.method
      : false;
  originalCheckData.successCodes =
    typeof originalCheckData.successCodes === "object" &&
    originalCheckData.successCodes instanceof Array &&
    originalCheckData.successCodes.length > 0
      ? originalCheckData.successCodes
      : false;
  originalCheckData.timeoutSeconds =
    typeof originalCheckData.timeoutSeconds === "number" &&
    originalCheckData.timeoutSeconds % 1 === 0 &&
    originalCheckData.timeoutSeconds >= 1 &&
    originalCheckData.timeoutSeconds <= 5
      ? originalCheckData.timeoutSeconds
      : false;

  // Set the keys that may not be set (if the workers has never seen this check before)
  typeof originalCheckData.state === "string" &&
  ["up", "down"].indexOf(originalCheckData.state) > -1
    ? originalCheckData.state
    : "down"; // assume it is down
  originalCheckData.lastChecked =
    typeof originalCheckData.lastChecked === "number" &&
    originalCheckData.lastChecked > 0
      ? originalCheckData.lastChecked
      : false;

  // If all checks pass, pass the data along to the next step i nthe process
  if (
    originalCheckData.id &&
    originalCheckData.userPhone &&
    originalCheckData.url &&
    originalCheckData.method &&
    originalCheckData.successCodes &&
    originalCheckData.timeoutSeconds
  ) {
    workers.performCheck(originalCheckData);
  } else {
    console.log("Error: One of the checks is not properly formatted.");
  }
};

// Perform the check, send the originalCheck data and outcome of check process to next step in the process
workers.performCheck = originalCheckData => {
  // Prepare initial check outcome
  const checkOutcome = {
    error: false,
    responseCode: false
  };

  // Mark that outcome has not been sent yet
  let outcomeSent = false;

  // Parse the hostname and the path out of the original check data
  const parsedUrl = url.parse(
    originalCheckData.protocol + "://" + originalCheckData.url,
    true
  );
  const hostName = parsedUrl.hostname;
  const path = parsedUrl.path; // Using path (not pathname) because we want the query string

  const requestDetails = {
    protocol: originalCheckData.protocol + ":",
    hostname: hostName,
    method: originalCheckData.method.toUpperCase(),
    path,
    timeout: originalCheckData.timeoutSeconds * 1000 // we ask users how many seconds, so need to convert to ms
  };

  // instantiate the req object (using either http or https module)
  const _moduleToUse = originalCheckData.protocol === "http" ? http : https;
  const req = _moduleToUse.request(requestDetails, res => {
    // Grab the status of the sent request
    const status = res.statusCode;

    // Update the checkOutcome and pass the data along
    checkOutcome.responseCode = status;
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // Bind to erro event so it doesn't get thrown
  req.on("error", e => {
    // update the checkOutcome and pass the data along
    checkOutcome.error = {
      error: true,
      value: e
    };
    if (!outcomeSent) {
      workers.process.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // bind to the timeout event
  req.on("timeout", e => {
    // update the checkOutcome and pass the data along
    checkOutcome.error = {
      error: true,
      value: "timeout"
    };
    if (!outcomeSent) {
      workers.process.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // end the request
  req.end();
};

// Process the check out and update the check data as needed and trigger alert to use if needed
// special logic for accomodating a check that has never beeen tested before (don't alert on that one)

workers.processCheckOutcome = (originalCheckData, checkOutcome) => {
  // Decide if the check is considered up or down
  const state =
    !checkOutcome.error &&
    checkOutcome.responseCode &&
    originalCheckData.successCodes.indexOf(checkOutcome.responseCode > -1) // user provided valid response code is matched
      ? "up"
      : "down";

  // decide if alert is needed
  const alertWarranted =
    originalCheckData.lastChecked && originalCheckData.state !== state
      ? true
      : false;

  // Log the outcome
  const timeOfCheck = Date.now();
  workers.log(
    originalCheckData,
    checkOutcome,
    state,
    alertWarranted,
    timeOfCheck
  );

  // Update the check data
  const newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = timeOfCheck;

  // save the updates
  _data.update("checks", newCheckData.id, newCheckData, err => {
    if (!err) {
      // Send the new check data to the next phase in the process if needed
      if (alertWarranted) {
        workers.alertUserToStatusChange(newCheckData);
      } else {
        console.log("Check outcome has not changes, no alert needed");
      }
    } else {
      console.log("Error saving updates to one of the checks");
    }
  });
};

// Alert user as to a change in their check status
workers.alertUserToStatusChange = newCheckData => {
  const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol +
    "://" +
    newCheckData.url} is currently ${newCheckData.state}`;
  helpers.sendTwilioSms(newCheckData.userPhone, msg, err => {
    if (!err) {
      console.log(
        "Success: User was alerted to a status change in their check via sms",
        msg
      );
    } else {
      console.log(
        "Error: Could not send sms alert to user who had a state change in their check",
        err
      );
    }
  });
};

workers.log = (
  originalCheckData,
  checkOutcome,
  state,
  alertWarranted,
  timeOfCheck
) => {
  // Form the log data
  const logData = {
    check: originalCheckData,
    outcome: checkOutcome,
    state,
    alert: alertWarranted,
    time: timeOfCheck
  };

  // Convert data to string
  const logString = JSON.stringify(logData);

  // Determine the name of the log file
  const logFileName = originalCheckData.id;

  // Append the log string to the file
  _logs.append(logFileName, logString, err => {
    if (!err) {
      console.log("Logging to file succeeded");
    } else {
      console.log("Logging to gile failed");
    }
  });
};

// Timer to execute worker-process once per minute
workers.loop = () => {
  setInterval(() => {
    workers.gatherAllChecks();
  }, 1000 * 60);
};

// Rotate(compress) log files
workers.rotateLogs = () => {
  // list all the (non compressed) log files
  _logs.list(false, (err, logs) => {
    if (!err && logs && logs.length) {
      logs.forEach(logName => {
        // Compress the data to a different file
        const logId = logName.replace(".log", "");
        const newFileId = logId + "-" + Date.now();
        _logs.compress(logId, newFileId, err => {
          if (!err) {
            // Truncate the log (empty out original file and moving content to new compressed file)
            _logs.truncate(logId, err => {
              if (!err) {
                console.log("Successfully truncated log file");
              } else {
                console.log("Error truncating log file");
              }
            });
          } else {
            console.log("Error compressing one of the log files");
          }
        });
      });
    } else {
      console.log("Error: Could not find any logs to rotate");
    }
  });
};

// Timer to execute log rotation process once per day
workers.logRotationLoop = () => {
  setInterval(() => {
    workers.rotateLogs();
  }, 1000 * 60 * 60 * 24);
};

// Init script
workers.init = () => {
  // execute all checks immediately
  workers.gatherAllChecks();

  // call the loop so checks continue to execute on their own
  workers.loop();

  // Compress all the logs immediately
  workers.rotateLogs();

  // all the compression loop so logs will be compressed later on
  workers.logRotationLoop();
};

module.exports = workers;
