var redis = require("redis");

var Bucheron = require("bucheron");

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

      var contributor = Bucheron.Contributor(profileData);
      contributor.updateProfile(event);

      // stripping out falsy values because Redis handles null/undefined as strings
      var data = contributor.getData();
      var dataArray = [event.data.userId];
      Object.keys(data).forEach(function(key) {
        if ( data[key] ) {
          dataArray.push(key);
          dataArray.push(data[key]);
        }
      });

      var multi = redis_client.multi();
      var contribution = Bucheron.getContributionInfo(event.event_type);

      multi.hmset( dataArray );

      if (contribution) {
        multi.sadd(event.data.userId + ":contributions", event.timestamp);
        multi.sadd(event.data.userId + ":contributions:" + contribution.type, event.timestamp);
      }

      multi.exec(cb);
    });
  };
};
