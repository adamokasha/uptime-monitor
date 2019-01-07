// Request handlers

const _data = require("./data");
const helpers = require("./helpers");
const config = require("../config/config");

// Define handlers
const handlers = {};

handlers.ping = (data, callback) => {
  callback(200);
};

handlers.notFound = (data, callback) => {
  callback(404);
};

/*
 *
 *
HTML HANDLERS 
 *
 *
 */

// Index handler
handlers.index = (data, callback) => {
  // Reject any request that is not 'get'
  if (data.method === "get") {
    // Prepare data for interpolation
    const templateData = {
      "head.title": "Uptime Monitoring - Made Simple",
      "head.description":
        "We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down, we'll send you a text to let you know!",
      "body.class": "index"
    };

    // Read in the index template as a string
    helpers.getTemplate("index", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer (this fn adds globals automatically)
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && str) {
            // Return page as html
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Account create
handlers.accountCreate = (data, callback) => {
  // Reject any request that is not 'get'
  if (data.method === "get") {
    // Prepare data for interpolation
    const templateData = {
      "head.title": "Create an Account",
      "head.description": "Signup is easy and only takes a few seconds",
      "body.class": "accountCreate"
    };

    // Read in the index template as a string
    helpers.getTemplate("accountCreate", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer (this fn adds globals automatically)
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && str) {
            // Return page as html
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Session deleted
handlers.sessionCreate = (data, callback) => {
  // Reject any request that is not 'get'
  if (data.method === "get") {
    // Prepare data for interpolation
    const templateData = {
      "head.title": "Login to your Account",
      "head.description":
        "Please enter your phone number and password to access your account",
      "body.class": "sessionCreate"
    };

    // Read in the index template as a string
    helpers.getTemplate("sessionCreate", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer (this fn adds globals automatically)
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && str) {
            // Return page as html
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Create New Session
handlers.sessionDeleted = (data, callback) => {
  // Reject any request that is not 'get'
  if (data.method === "get") {
    // Prepare data for interpolation
    const templateData = {
      "head.title": "Logged Out",
      "head.description": "You have been logged out of your account.",
      "body.class": "sessionDeleted"
    };

    // Read in the index template as a string
    helpers.getTemplate("sessionDeleted", templateData, (err, str) => {
      if (!err && str) {
        // Add the universal header and footer (this fn adds globals automatically)
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && str) {
            // Return page as html
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Account has been deleted
handlers.accountDeleted = function(data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    var templateData = {
      "head.title": "Account Deleted",
      "head.description": "Your account has been deleted.",
      "body.class": "accountDeleted"
    };
    // Read in a template as a string
    helpers.getTemplate("accountDeleted", templateData, function(err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Create a new check
handlers.checksCreate = function(data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    var templateData = {
      "head.title": "Create a New Check",
      "body.class": "checksCreate"
    };
    // Read in a template as a string
    helpers.getTemplate("checksCreate", templateData, function(err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Dashboard (view all checks)
handlers.checksList = function(data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    var templateData = {
      "head.title": "Dashboard",
      "body.class": "checksList"
    };
    // Read in a template as a string
    helpers.getTemplate("checksList", templateData, function(err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Edit a Check
handlers.checksEdit = function(data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    var templateData = {
      "head.title": "Check Details",
      "body.class": "checksEdit"
    };
    // Read in a template as a string
    helpers.getTemplate("checksEdit", templateData, function(err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Favicon
handlers.favicon = (data, callback) => {
  if (data.method === "get") {
    // Read in the favicon data
    helpers.getStaticAsset("favicon.ico", (err, data) => {
      if (!err && data) {
        // callback the data
        callback(200, data, "favicon");
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

// Public assets
handlers.public = (data, callback) => {
  if (data.method === "get") {
    // Get filename being requested
    const trimmedAssetName = data.trimmedPath.replace("public/", "").trim();
    if (trimmedAssetName.length) {
      // Readin in the assets data
      helpers.getStaticAsset(trimmedAssetName, (err, data) => {
        if (!err && data) {
          // Determine the content type (default to plain text)
          let contentType = "plain";

          if (trimmedAssetName.indexOf(".css") > -1) {
            contentType = "css";
          }

          if (trimmedAssetName.indexOf(".png") > -1) {
            contentType = "png";
          }

          if (trimmedAssetName.indexOf(".jpg") > -1) {
            contentType = "jpg";
          }

          if (trimmedAssetName.indexOf(".ico") > -1) {
            contentType = "favicon";
          }

          // Callback the data
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};

/*
 *
 *
  JSON API Handlers
 *
 *
 */

handlers.users = (data, callback) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// users submethods
handlers._users = {};

// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
  // Check that all required fields are filled out
  console.log(data);

  const firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;

  const lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;

  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  const tosAgreement =
    typeof data.payload.tosAgreement === "boolean" &&
    data.payload.tosAgreement === true
      ? true
      : false;

  console.log(firstName, lastName, phone, password, tosAgreement);
  if (firstName && lastName && phone && password && tosAgreement) {
    // Make sure that user doesnt already exist
    _data.read("users", phone, function(err, data) {
      if (err) {
        // Hash the password
        const hashedPassword = helpers.hash(password);

        // Create user object
        if (hashedPassword) {
          const userObject = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement
          };

          // Store user
          _data.create("users", phone, userObject, err => {
            if (!err) {
              callback(200);
            } else {
              callback(500, { Error: "Could not create new user" });
            }
          });
        } else {
          console.log(err);
          callback(500, { Error: "Could not hash user's password" });
        }
      } else {
        // User already exists
        callback(400, {
          Error: "A user with tht phone number already exists."
        });
      }
    });
  } else {
    callback(404, { Error: "Missing required fields." });
  }
};
// Required data: phone
handlers._users.get = (data, callback) => {
  // Check that the phone number is valid
  const phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;

  // Get the token from the headers
  const token =
    typeof data.headers.token === "string" ? data.headers.token : false;
  // Verify that given token is valid for the phone number
  handlers._tokens.verifyToken(token, phone, tokenIsValid => {
    if (tokenIsValid) {
      if (phone) {
        // Lookup the user
        _data.read("users", phone, (err, data) => {
          if (!err && data) {
            // Remove the hashed password from user object before returning to requester
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(400, { Error: "Missing required field." });
      }
    } else {
      callback(403, {
        Error: "Missing required token in header, or token is invalid"
      });
    }
  });
};
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
handlers._users.put = (data, callback) => {
  // Check for required field
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;

  // Check for optional fields
  const firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;

  const lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  // Error if phone is invalid in all cases
  if (phone) {
    const token =
      typeof data.headers.token === "string" ? data.headers.token : false;

    handlers._tokens.verifyToken(token, phone, tokenIsValid => {
      if (tokenIsValid) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
          _data.read("users", phone, (err, userData) => {
            if (!err && userData) {
              // Update the fields necessaru
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = firstName;
              }
              if (password) {
                userData.hashedPassword = helpers.hash(password);
              }
              // Store the new updates
              _data.update("users", phone, userData, () => {
                if (!err) {
                  callback(200);
                } else {
                  console.log(err);
                  callback(500, { Error: "Could not update the user" });
                }
              });
            } else {
              callback(400, { Error: "The specified user does not exist." });
            }
          });
        } else {
          callback(400, { Error: "Missing fields to update." });
        }
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid"
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field." });
  }
};

// Required field : phone
// @TODO cleanup any other data files associated with this user
handlers._users.delete = (data, callback) => {
  // Check that the phone number is valid
  const phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;

  console.log(phone);
  if (phone) {
    const token =
      typeof data.headers.token === "string" ? data.headers.token : false;

    handlers._tokens.verifyToken(token, phone, tokenIsValid => {
      if (tokenIsValid) {
        // Lookup the user
        _data.read("users", phone, (err, data) => {
          if (!err && data) {
            _data.delete("users", phone, err => {
              if (!err) {
                callback(200);
              } else {
                callback(500, {
                  Error: "Could not delete the specified user."
                });
              }
            });
          } else {
            callback(400, { Error: "Could not find the specified user" });
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid"
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field." });
  }
};

// Tokens
handlers.tokens = (data, callback) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

handlers._tokens = {};
// Required data: phone, password
handlers._tokens.post = (data, callback) => {
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;

  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone && password) {
    // Lookup user who matches that phone number
    _data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        // ash the sent password and comparei to the stored password
        const hashedPassword = helpers.hash(password);
        if (hashedPassword === userData.hashedPassword) {
          // If valid, create a new token with a random name. Set expiration date 1 hour in the future
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            phone,
            id: tokenId,
            expires
          };

          // Store the token
          _data.create("tokens", tokenId, tokenObject, err => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: "Could not create the new token" });
            }
          });
        } else {
          callback(400, {
            Error: "Password did not match the specified user's stored password"
          });
        }
      } else {
        callback(400, { Error: "Could not find the specified user" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field(s)." });
  }
};

// Required data: id
handlers._tokens.get = (data, callback) => {
  // Check that the id number is valid
  const id =
    typeof data.queryStringObject.id === "string" &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;

  console.log(id);
  if (id) {
    // Lookup the user
    _data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field." });
  }
};

// Required data: id, extend
handlers._tokens.put = (data, callback) => {
  // Check that the id number is valid
  const id =
    typeof data.payload.id === "string" && data.payload.id.trim().length === 20
      ? data.payload.id.trim()
      : false;

  // Check that the id number is valid
  const extend =
    typeof data.payload.extend === "boolean" && data.payload.extend === true
      ? true
      : false;

  console.log("EXTEND", id, extend);

  if (id && extend) {
    // Lookup token
    _data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        // Check to make sure the token isn't already expired
        if (tokenData.expires > Date.now()) {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          // Store the new updates
          _data.update("tokens", id, tokenData, err => {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                Error: "Could not update the token's expiration."
              });
            }
          });
        } else {
          callback(400, {
            Error: "The token has already expired and cannot be extended"
          });
        }
      } else {
        callback(400, { Error: "Specified token does not exist" });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field(s) or fields are invalid."
    });
  }
};

// Required data: id
handlers._tokens.delete = (data, callback) => {
  // Check that the id is valid
  const id =
    typeof data.queryStringObject.id === "string" &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;

  console.log(id);
  if (id) {
    // Lookup the token
    _data.read("tokens", id, (err, data) => {
      if (!err && data) {
        _data.delete("tokens", id, err => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Could not delete the specified token." });
          }
        });
      } else {
        callback(400, { Error: "Could not find the specified token" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field." });
  }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = (id, phone, callback) => {
  // Lookup the token
  _data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      // Check that the token is for the given user and has not expires
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    }
  });
};

// Tokens
handlers.checks = (data, callback) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the checks methods
handlers._checks = {};

// Checks post
// Required data: protocol, url, method, successCode, timeoutSeconds
handlers._checks.post = (data, callback) => {
  // validate inputs
  const protocol =
    typeof data.payload.protocol === "string" &&
    ["https", "http"].includes(data.payload.protocol)
      ? data.payload.protocol
      : false;

  const url =
    typeof data.payload.url == "string" && data.payload.url.trim().length > 0
      ? data.payload.url.trim()
      : false;

  const method =
    typeof data.payload.method == "string" &&
    ["post", "get", "put", "delete"].includes(data.payload.method)
      ? data.payload.method
      : false;

  const successCodes =
    typeof data.payload.successCodes == "object" &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;

  const timeoutSeconds =
    typeof data.payload.timeoutSeconds == "number" &&
    data.payload.timeoutSeconds % 1 === 0 &&
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  console.log(protocol, url, method, successCodes, timeoutSeconds);

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // Get the token from the headers
    const token =
      typeof data.headers.token === "string" ? data.headers.token : false;

    // Lookup the user by reading token
    _data.read("tokens", token, (err, tokenData) => {
      if (!err) {
        const userPhone = tokenData.phone;

        // Lookup the user data
        _data.read("users", userPhone, (err, userData) => {
          if (!err && userData) {
            const userChecks =
              typeof userData.checks === "object" &&
              userData.checks instanceof Array
                ? userData.checks
                : [];
            // Verify max checks not exceeded
            if (userChecks.length < config.maxChecks) {
              // Create a random id for the check
              const checkId = helpers.createRandomString(20);

              // Create the check object and include the user's phone
              const checkObject = {
                id: checkId,
                userPhone,
                protocol,
                url,
                method,
                successCodes,
                timeoutSeconds
              };

              // Save the object to disk
              _data.create("checks", checkId, checkObject, err => {
                if (!err) {
                  // Add the check if to the user's object
                  userData.checks = userChecks;
                  userData.checks.push(checkId);

                  // Save new user data
                  _data.update("users", userPhone, userData, err => {
                    if (!err) {
                      // Return the data about the new check
                      callback(200, checkObject);
                    } else {
                      callback(500, {
                        Error: "Could not update the user with the new check"
                      });
                    }
                  });
                } else {
                  callback(500, { Error: "Could not create the new check" });
                }
              });
            } else {
              callback(400, {
                Error:
                  "The user already has the maximum number of checks (" +
                  config.maxChecks +
                  ")"
              });
            }
          } else {
            callback(403, "2");
          }
        });
      } else {
        callback(403, err);
      }
    });
  } else {
    callback(400, { Error: "Missing required input or inputs invalid" });
  }
};

// checks - get
// required data: id
handlers._checks.get = function(data, callback) {
  // Check if id is valid
  const id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup check
    _data.read("checks", id, function(err, checkData) {
      if (!err && checkData) {
        // Get token that sent the request
        const token =
          typeof data.headers.token == "string" ? data.headers.token : false;
        // Verify that the given token is valid and belongs to the user who created the check
        console.log("This is check data", checkData);
        handlers._tokens.verifyToken(token, checkData.userPhone, function(
          tokenIsValid
        ) {
          if (tokenIsValid) {
            // Return check data
            callback(200, checkData);
          } else {
            callback(403);
          }
        });
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field, or field invalid" });
  }
};

// Checks - put
// Required data: id
// Optional data: protocol,url,method,successCodes,timeoutSeconds (one must be sent)
handlers._checks.put = function(data, callback) {
  // Check for required field
  const id =
    typeof data.payload.id == "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;

  // Check for optional fields
  const protocol =
    typeof data.payload.protocol == "string" &&
    ["https", "http"].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  const url =
    typeof data.payload.url == "string" && data.payload.url.trim().length > 0
      ? data.payload.url.trim()
      : false;
  const method =
    typeof data.payload.method == "string" &&
    ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;
  const successCodes =
    typeof data.payload.successCodes == "object" &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;
  const timeoutSeconds =
    typeof data.payload.timeoutSeconds == "number" &&
    data.payload.timeoutSeconds % 1 === 0 &&
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  // Error if id is invalid
  if (id) {
    // Error if nothing is sent to update
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // Lookup the check
      _data.read("checks", id, function(err, checkData) {
        if (!err && checkData) {
          // Get the token that sent the request
          const token =
            typeof data.headers.token == "string" ? data.headers.token : false;
          // Verify that the given token is valid and belongs to the user who created the check
          handlers._tokens.verifyToken(token, checkData.userPhone, function(
            tokenIsValid
          ) {
            if (tokenIsValid) {
              // Update check data where necessary
              if (protocol) {
                checkData.protocol = protocol;
              }
              if (url) {
                checkData.url = url;
              }
              if (method) {
                checkData.method = method;
              }
              if (successCodes) {
                checkData.successCodes = successCodes;
              }
              if (timeoutSeconds) {
                checkData.timeoutSeconds = timeoutSeconds;
              }

              // Store the new updates
              _data.update("checks", id, checkData, function(err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, { Error: "Could not update the check." });
                }
              });
            } else {
              callback(403);
            }
          });
        } else {
          callback(400, { Error: "Check ID did not exist." });
        }
      });
    } else {
      callback(400, { Error: "Missing fields to update." });
    }
  } else {
    callback(400, { Error: "Missing required field." });
  }
};

// Checks - delete
// Required data: id
// Optional data: none
handlers._checks.delete = function(data, callback) {
  // Check that id is valid
  const id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the check
    _data.read("checks", id, function(err, checkData) {
      if (!err && checkData) {
        // Get the token that sent the request
        const token =
          typeof data.headers.token == "string" ? data.headers.token : false;
        // Verify that the given token is valid and belongs to the user who created the check
        handlers._tokens.verifyToken(token, checkData.userPhone, function(
          tokenIsValid
        ) {
          if (tokenIsValid) {
            // Delete the check data
            _data.delete("checks", id, function(err) {
              if (!err) {
                // Lookup the user's object to get all their checks
                _data.read("users", checkData.userPhone, function(
                  err,
                  userData
                ) {
                  if (!err) {
                    const userChecks =
                      typeof userData.checks == "object" &&
                      userData.checks instanceof Array
                        ? userData.checks
                        : [];

                    // Remove the deleted check from their list of checks
                    const checkPosition = userChecks.indexOf(id);
                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1);
                      // Re-save the user's data
                      userData.checks = userChecks;
                      _data.update(
                        "users",
                        checkData.userPhone,
                        userData,
                        function(err) {
                          if (!err) {
                            callback(200);
                          } else {
                            callback(500, {
                              Error: "Could not update the user."
                            });
                          }
                        }
                      );
                    } else {
                      callback(500, {
                        Error:
                          "Could not find the check on the user's object, so could not remove it."
                      });
                    }
                  } else {
                    callback(500, {
                      Error:
                        "Could not find the user who created the check, so could not remove the check from the list of checks on their user object."
                    });
                  }
                });
              } else {
                callback(500, { Error: "Could not delete the check data." });
              }
            });
          } else {
            callback(403);
          }
        });
      } else {
        callback(400, { Error: "The check ID specified could not be found" });
      }
    });
  } else {
    callback(400, { Error: "Missing valid id" });
  }
};

module.exports = handlers;
