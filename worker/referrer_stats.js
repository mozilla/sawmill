var redis = require("redis");

module.exports = function(config) {
  var redis_client = redis.createClient(config.port, config.host);
  if (config.auth) {
    redis_client.auth(config.auth);
  }
  if (config.db) {
    redis_client.select(config.db);
  }

  return function(id, event, cb) {
    if (event.event_type !== "create_user") {
      return process.nextTick(cb);
    }

    var jsonblob = JSON.stringify({
      timestamp: event.timestamp,
      referrer: event.data.referrer
    });

    redis_client.sadd(["referrer_ids", jsonblob], cb);
  };
};
