// Create and exports config variables

const devKeys = require("./dev");
const prodKeys = require("./prod");

const environments = {
  // default
  staging: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "staging",
    hashingSecret: devKeys.hashingSecret,
    maxChecks: 5,
    twilio: {
      accountSid: devKeys.accountSid,
      authToken: devKeys.authToken,
      fromPhone: devKeys.fromPhone
    },
    templateGlobals: {
      appName: "Uptime Checker",
      companyName: "NotARealCompany, Inc",
      yearCreated: "2018",
      baseUrl: "http://localhost:3000/"
    }
  },
  production: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "production",
    hashingSecret: prodKeys.hashingSecret,
    maxChecks: 5,
    twilio: {
      accountSid: prodKeys.accountSid,
      authToken: prodKeys.authToken,
      fromPhone: prodKeys.fromPhone
    },
    templateGlobals: {
      appName: "Uptime Checker",
      companyName: "NotARealCompany, Inc",
      yearCreated: "2018",
      baseUrl: "http://localhost:5000/"
    }
  }
};

// Determine which environment was passed as command line argument
const currentEnvironment = process.env.NODE_ENV
  ? process.env.NODE_ENV.toLowerCase()
  : "";

// Check that the current environment is available, if not use default staging
var environmentToExport = environments[currentEnvironment]
  ? environments[currentEnvironment]
  : environments["staging"];

module.exports = environmentToExport;
