var crypto = require("crypto");
var pg = require("pg.js");

var hash_string = function(string) {
  return crypto.createHash("sha256").update(string, "utf8").digest("hex");
};
var query = "INSERT INTO user_events (id, event) " +
  "SELECT $1, $2 WHERE NOT EXISTS " +
  "(SELECT id FROM user_events WHERE id = $1);";

module.exports = function(config) {
  return function(event, cb) {
    pg.connect(config.connection_string, function(err, client, done) {
      if (err) {
        err.from = "archiver:client.connect";
        return cb(err);
      }

      var hash = hash_string(JSON.stringify(event));

      client.query(query, [hash, event], function(err, result) {
        if (err) {
          err.from = "archiver:client.query";
        }
        done();
        cb(err);
      });
    });
  }
}
