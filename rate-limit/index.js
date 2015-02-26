var catbox = require("catbox");
var catboxMemory = require("catbox-memory");
var catboxRedis = require("catbox-redis");

module.exports = function(config, ttl, ready) {

  var catboxEngine = config ? new catboxRedis(config) : new catboxMemory();

  var client = new catbox.Client(catboxEngine);

  client.start(function(err) {
    if ( err ) {
      throw new Error(err);
    }

    ready({
      isCached: function(key, callback) {
        client.get(key, function(err, cached) {
          if ( err ) {
            console.error(err);
          }

          if ( !cached || !cached.ttl ) {
            return callback(false);
          }
          callback(true);
        });
      },
      cache: function(key, value, callback) {
        client.set(key, value, ttl, function(err) {
          if ( err ) {
            console.error(err);
          }
          callback();
        });
      }
    });
  });
};
