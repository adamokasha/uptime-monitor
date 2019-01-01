// Primary file for the API

const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");

// Instatiate the http server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start the server
httpServer.listen(config.httpPort, () => {
  console.log(`The server is listening on port ${config.httpPort}`);
});

// Instatiate https server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// Start the https server
httpsServer.listen(config.httpsPort, () => {
  console.log(`The server is listening on port ${config.httpsPort}`);
});

// All the server logic for both the http and https server
const unifiedServer = (req, res) => {
  // Get url and parse it
  const parsedUrl = url.parse(req.url, true); // 2nd arg tell url.parse to forward query to query lib

  // Get path from url
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

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
    const chosenHandler = router[trimmedPath]
      ? router[trimmedPath]
      : handlers.notFound;

    // construct data object to send to handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode = 200, payload = {}) => {
      // Convert payload to string
      const payloadString = JSON.stringify(payload);

      // Return response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      // Log req path
      console.log("Returning response: ", statusCode, payloadString);
    });
  });
};

// Define handlers
const handlers = {
  sample: (data, callback) => {
    // Callback a http status code and a playload object
    callback(406, { name: "sample handler" });
  },
  notFound: (data, callback) => {
    callback(404);
  }
};

// Define a request router
const router = {
  sample: handlers.sample
};
