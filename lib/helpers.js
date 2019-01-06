// Helpers

const crypto = require("crypto");
const config = require("../config/config");
const https = require("https");
const querystring = require("querystring");

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

module.exports = helpers;
