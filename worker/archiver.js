var pg = require("pg.js");
var query = "INSERT INTO user_events (id, event) " +
  "SELECT $1, $2 WHERE NOT EXISTS " +
  "(SELECT id FROM user_events WHERE id = $1);";

module.exports = function(config) {
  return function(id, data, cb) {
    pg.connect(config.connection_string, function(err, client, done) {
      if (err) {
        return cb(err);
      }

      client.query(query, [id, data], function(err, result) {
        done();
        cb(err);
      });
    });
  }
}
