var redis = require("redis");

var Bucheron = require("bucheron");

var CONTRIBUTION_EVENTS = [
  "create_event"
];

module.exports = function(config) {
  var redis_client = redis.createClient(config.port, config.host);
  if (config.auth) {
    redis_client.auth(config.auth);
  }
  if (config.db) {
    redis_client.select(config.db);
  }

  return function(id, event, cb) {
    // Try to retrieve a record for a given userID
    redis_client.hgetall( event.data.userId, function(err, profileData) {
      if ( err ) {
        return cb(err);
      }

      var bucheron = Bucheron(profileData);
      bucheron.updateProfile(event);

      // stripping out falsy values because Redis handles null/undefined as strings
      var data = bucheron.getData();
      var dataArray = [event.data.userId];
      Object.keys(data).forEach(function(key) {
        if ( data[key] ) {
          dataArray.push(key);
          dataArray.push(data[key]);
        }
      });
      redis_client.hmset(dataArray, function(err) {
        if ( err ) {
          return cb(err);
        }
        if (CONTRIBUTION_EVENTS.indexOf(event.event_type) === -1) {
          return cb()
        }
        redis_client.sadd(event.data.userId + ":contributions", event.timestamp, cb);
      });
    });
  };
};
