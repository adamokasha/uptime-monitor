// Helpers

const crypto = require("crypto");
const config = require("../config/config");
const https = require("https");
const querystring = require("querystring");
const path = require("path");
const fs = require("fs");

// Container for all the helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = str => {
  if (typeof str === "string" && str.length) {
    const hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

// Parse JSON string to object without throwing
helpers.parseJsonToObject = str => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a string of random alphanumeric chars of a given length

helpers.createRandomString = strLength => {
  strLength =
    typeof strLength === "number" && strLength > 0 ? strLength : false;

  if (strLength) {
    // define all posible charaters to go into string
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz123456789";

    let str = "";
    for (i = 0; i < strLength; i++) {
      // Get random chars from possibleCharacters string
      var randomChar = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      // append to str
      str += randomChar;
    }
    return str;
  } else {
    return false;
  }
};

// Send sms via twilio

helpers.sendTwilioSms = function(phone, msg, callback) {
  // validate params
  phone =
    typeof phone === "string" && phone.trim().length == 10
      ? phone.trim()
      : false;
  msg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (phone && msg) {
    // Config the request payload
    var payload = {
      From: config.twilio.fromPhone,
      To: "+1" + phone,
      Body: msg
    };

    // Stringify the payload
    const stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path:
        "/2010-04-01/Accounts/" + config.twilio.accountSid + "/Messages.json",
      auth: config.twilio.accountSid + ":" + config.twilio.authToken,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload) // Buffer available globally
      }
    };
    // Instantiate req object
    const req = https.request(requestDetails, res => {
      // grab status of the sent request
      const status = res.statusCode;
      // Callback success if req ok
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback("Status code returned was " + status);
      }
    });

    // Bind to error event so it doesnt get thrown
    req.on("error", e => {
      callback(e);
    });

    // Add payload to request
    req.write(stringPayload);

    // End req
    req.end(); // sends req
  } else {
    callback("Given parameters were missing or invalid");
  }
};

// Get the string content of a template, and use provided data for string interpolation
helpers.getTemplate = (templateName, data, callback) => {
  templateName =
    typeof templateName == "string" && templateName.length > 0
      ? templateName
      : false;
  data = typeof data == "object" && data !== null ? data : {};
  if (templateName) {
    var templatesDir = path.join(__dirname, "/../templates/");
    fs.readFile(templatesDir + templateName + ".html", "utf8", function(
      err,
      str
    ) {
      if (!err && str && str.length > 0) {
        // Do interpolation on the string
        var finalString = helpers.interpolate(str, data);
        callback(false, finalString);
      } else {
        callback("No template could be found");
      }
    });
  } else {
    callback("A valid template name was not specified");
  }
};

// Add the universal header and footer to a string and pass provided data obj to header and footer for interpolation
helpers.addUniversalTemplates = (str, data, callback) => {
  str = typeof str === "string" && str.length ? str : "";
  data = typeof data === "object" && data !== null ? data : {};

  // Get header
  helpers.getTemplate("_header", data, (err, headerString) => {
    if (!err && headerString) {
      helpers.getTemplate("_footer", data, (err, footerString) => {
        if (!err && footerString) {
          // Add them all together
          const fullString = headerString + str + footerString;
          callback(false, fullString);
        } else {
          callback("Could not find the footer template");
        }
      });
    } else {
      callback("Could not find the header template");
    }
  });
};

// Take a given string and a data object and find / replace all the keys within it
helpers.interpolate = (str, data) => {
  str = typeof str === "string" && str.length ? str : "";
  data = typeof data === "object" && data !== null ? data : {};

  // Add the templateGlobals to the data object, prepending their key name with "global."
  for (let keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data["global." + keyName] = config.templateGlobals[keyName];
    }
  }

  // For each key in the data object, insert its value into the string at the corresponding placeholder
  for (let key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] === "string") {
      const replace = data[key];
      const find = "{" + key + "}";
      str = str.replace(find, replace);
    }
  }

  return str;
};

// Get the contents of a static(public) asset
helpers.getStaticAsset = (fileName, callback) => {
  fileName = typeof fileName === "string" && fileName.length ? fileName : false;
  if (fileName) {
    const publicDir = path.join(__dirname, "/../public/");
    fs.readFile(publicDir + fileName, (err, data) => {
      if (!err && data) {
        callback(false, data);
      } else {
        callback("No file could be found");
      }
    });
  } else {
    callback("A valid filename was not specified");
  }
};

module.exports = helpers;
