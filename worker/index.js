var fs = require("fs");
var path = require("path");
var workers = {};

fs.readdirSync(__dirname).forEach(function (file) {
  var name = path.basename(file, '.js');
  if (file !== 'index.js' && file !== '.DS_Store') {
    workers[name] = require(path.join(__dirname, file));
  }
});

module.exports = workers;
