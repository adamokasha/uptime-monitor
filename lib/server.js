// Server related tasks

const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("../config/config");
const fs = require("fs");
const handlers = require("./handlers");
const helpers = require("./helpers");
const path = require("path");
const util = require("util");
const debug = util.debuglog("server");

// Instantiate the server module object
const server = {};

// Instatiate the http server
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

// Instatiate https server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem"))
};

server.httpsServer = https.createServer(
  server.httpsServerOptions,
  (req, res) => {
    server.unifiedServer(req, res);
  }
);

// All the server logic for both the http and https server
server.unifiedServer = (req, res) => {
  // Get url and parse it
  const parsedUrl = url.parse(req.url, true); // 2nd arg tell url.parse to forward query to query lib

  // Get path from url
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, ""); // removes leading slash

  // Get the query string as object
  const queryStringObject = parsedUrl.query;

  // Get HTTP method
  const method = req.method.toLowerCase();

  // Get headers as object
  const headers = req.headers;

  // Get payload, if any
  var decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", data => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    // Choose handler this req should go to. If none found ,use notFound handler
    let chosenHandler = server.router[trimmedPath]
      ? server.router[trimmedPath]
      : handlers.notFound;

    // If request is within public directory, use public handler instead
    chosenHandler =
      trimmedPath.indexOf("public/") > -1 ? handlers.public : chosenHandler;

    // construct data object to send to handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer)
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode = 200, payload, contentType = "json") => {
      // Return response parts that are content-specific
      let payloadString;
      if (contentType === "json") {
        res.setHeader("Content-Type", "application/json");
        payload = typeof payload === "object" ? payload : {};
        payloadString = JSON.stringify(payload);
      }
      if (contentType === "html") {
        res.setHeader("Content-Type", "text/html");
        payloadString = typeof payload === "string" ? payload : "";
      }
      if (contentType === "favicon") {
        res.setHeader("Content-Type", "image/x-icon");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }
      if (contentType === "css") {
        res.setHeader("Content-Type", "text/css");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }
      if (contentType === "png") {
        res.setHeader("Content-Type", "image/png");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }
      if (contentType === "jpg") {
        res.setHeader("Content-Type", "image/jpeg");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }
      if (contentType === "plain") {
        res.setHeader("Content-Type", "text/plain");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      // Return the response parts that are common to all content types
      res.writeHead(statusCode);
      res.end(payloadString);

      // if res is 200, print green, otherwise print red
      if (statusCode == 200) {
        debug(
          "\x1b[32m%s\x1b[0m",
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      } else {
        debug(
          "\x1b[31m%s\x1b[0m",
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      }
    });
  });
};

// Define a request router
server.router = {
  "": handlers.index,
  "account/create": handlers.accountCreate,
  "account/edit": handlers.accountEdit,
  "account/deleted": handlers.accountDeleted,
  "session/create": handlers.sessionCreate,
  "session/deleted": handlers.sessionDeleted,
  "checks/all": handlers.checksList,
  "checks/create": handlers.checksCreate,
  "check/edit": handlers.checksEdit,
  ping: handlers.ping,
  "api/users": handlers.users,
  "api/tokens": handlers.tokens,
  "api/checks": handlers.checks,
  "favicon.ico": handlers.favIcon,
  public: handlers.public
};

// Init script
server.init = () => {
  // Start http server
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      "\x1b[36m%s\x1b[0m",
      "The HTTP server is running on port " + config.httpPort
    );
  });

  // Start the https server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log(
      "\x1b[35m%s\x1b[0m",
      "The HTTPS server is running on port " + config.httpsPort
    );
  });
};

// export the module
module.exports = server;
