var forwarded = require("forwarded");
var Hapi = require("hapi");
var hatchet = require("hatchet");
var Joi = require("joi");

var config = {
  host: process.env.HOST,
  port: process.env.PORT,
  trust_proxy: process.env.TRUST_PROXY === "true",

  coinbase_address: process.env.COINBASE_ADDRESS,
  coinbase_protocol: process.env.COINBASE_PROTOCOL,
  coinbase_secret: process.env.COINBASE_SECRET
};

var server = Hapi.createServer(config.host, config.port, {
  app: {
    trust_proxy: config.trust_proxy,
    coinbase_address: config.coinbase_address,
    coinbase_protocol: config.coinbase_protocol,
    coinbase_secret: config.coinbase_secret
  }
});

server.pack.register(require("hapi-auth-bearer-token"), function(err) {
  if (err) {
    throw err;
  }
});

server.auth.strategy("simple", "bearer-access-token", {
  validateFunc: function(token, callback) {
    // this = request
    callback(null, token === this.server.settings.app.coinbase_secret, { token: token });
  }
});

server.route({
  method: "POST",
  path: "/coinbase/callback",
  config: {
    auth: "simple"
  },
  handler: function(request, reply) {
    // Do IP & Protocol validation here because I have no idea where else
    // https://devcenter.heroku.com/articles/http-routing#heroku-headers
    var client_ip = request.server.settings.app.trust_proxy ?
      forwarded(request.raw.req).pop() : request.info.remoteAddress;
    var client_proto = request.server.settings.app.trust_proxy ?
      request.headers["x-forwarded-proto"] : request.server.info.protocol;

    if (client_proto !== request.server.settings.app.coinbase_protocol) {
      return reply(Hapi.error.badRequest("Requests must be made using " + request.server.settings.app.coinbase_protocol));
    }
    if (client_ip !== request.server.settings.app.coinbase_address) {
      return reply(Hapi.error.forbidden("IP address " + client_ip + " rejected"));
    }

    hatchet.send("receive_coinbase_donation", request.payload, function(err, data) {
      if (err) {
        return reply(err).code(500);
      }

      reply("queued message with id " + data.MessageId);
    });
  }
});

server.start(function() {
  console.log('Server running at: %s', server.info.uri);
});
