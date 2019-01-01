// Lib for storing and editing data

const fs = require("fs");
const path = require("path");

// Base directory of the data folder

class DataLib {
  constructor() {
    this.baseDir = path.join(__dirname, "/../.data/");
  }
  create(dir, file, data, callback) {
    console.log(this.baseDir);
    // Open file for writing
    fs.open(
      this.baseDir + dir + "/" + file + ".json",
      "wx",
      (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
          // convert data to string
          const stringData = JSON.stringify(data);

          // Write to file and close it
          fs.writeFile(fileDescriptor, stringData, err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error closing new file.");
                }
              });
            } else {
              callback("Error writing to new file.");
            }
          });
        } else {
          callback("Error: Could not create file, it may already exist.");
        }
      }
    );
  }
  read(dir, file, callback) {
    fs.readFile(
      this.baseDir + dir + "/" + file + ".json",
      "utf8",
      (err, data) => {
        callback(err, data);
      }
    );
  }
  update(dir, file, data, callback) {
    // Open the file for writing
    fs.open(
      this.baseDir + dir + "/" + file + ".json",
      "r+",
      (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
          const stringData = JSON.stringify(data);

          // Truncate the file, before writing
          fs.ftruncate(fileDescriptor, err => {
            if (!err) {
              // Write to the file
              fs.writeFile(fileDescriptor, stringData, err => {
                if (!err) {
                  fs.close(fileDescriptor, err => {
                    if (!err) {
                      callback(false);
                    } else {
                      callback("Error closign the file");
                    }
                  });
                } else {
                  callback("Error writing back to the file");
                }
              });
            } else {
              callback("Error truncating the file");
            }
          });
        } else {
          callback("Could not open file for updating. It may not exist.");
        }
      }
    );
  }
  delete(dir, file, callback) {
    // Unlink the file
    fs.unlink(this.baseDir + dir + "/" + file + ".json", err => {
      if (!err) {
        callback(false);
      } else {
        callback("Error deleting file");
      }
    });
  }
}

module.exports = new DataLib();
