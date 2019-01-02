// Helpers

const crypto = require("crypto");
const config = require("../config/config");

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

module.exports = helpers;
