var redis = require("redis");

var Bucheron = require("bucheron");

module.exports = function(config) {
  var redis_client = redis.createClient(config.port, config.host);
  if (config.auth) {
    redis_client.auth(config.auth);
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
      redis_client.hmset(dataArray, cb);
    });
  };
};
