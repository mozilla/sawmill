var Boom = require("boom");
var debug = require("debug")("http");
var forwarded = require("forwarded-for");
var Hapi = require("hapi");
var hatchet = require("hatchet");
var Netmask = require("netmask").Netmask;
var Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = function(config) {
  var server = new Hapi.Server({
    app: {
      trust_proxy: config.trust_proxy,
      coinbase_ip_range: config.coinbase_ip_range.map(function(cidr) {
        return new Netmask(cidr);
      }),
      coinbase_protocol: config.coinbase_protocol,
      coinbase_secret: config.coinbase_secret,
      stripe_secret: config.stripe_secret
    }
  });
  server.connection({
    host: config.host,
    port: config.port
  });

  server.register(require("hapi-auth-bearer-token"), function(err) {});

  server.auth.strategy("coinbase", "bearer-access-token", {
    validateFunc: function(token, callback) {
      // this = request
      callback(null, token === this.server.settings.app.coinbase_secret, { token: token });
    }
  });

  server.auth.strategy("stripe", "bearer-access-token", {
    validateFunc: function(token, callback) {
      // this = request
      callback(null, token === this.server.settings.app.stripe_secret, { token: token });
    }
  });

  server.route({
    method: "POST",
    path: "/coinbase/callback",
    config: {
      auth: "coinbase"
    },
    handler: function(request, reply) {
      // Do IP & Protocol validation here because I have no idea where else
      // https://devcenter.heroku.com/articles/http-routing#heroku-headers
      var client_ip = request.server.settings.app.trust_proxy ?
        forwarded(request.info, request.headers).ip : request.info.remoteAddress;
      var client_proto = request.server.settings.app.trust_proxy ?
        request.headers["x-forwarded-proto"] : request.server.info.protocol;

      if (client_proto !== request.server.settings.app.coinbase_protocol) {
        return reply(Boom.badRequest("Requests must be made using " + request.server.settings.app.coinbase_protocol));
      }
      // This logic is a little weird so:
      // 1) Loop through all of the valid IP ranges we have configured
      // 2) If every single block does not contain the client ip
      // 3) Then the client IP is not on the whitelist
      if (request.server.settings.app.coinbase_ip_range.every(function(block) {
        return !block.contains(client_ip);
      })) {
        return reply(Boom.forbidden("IP address " + client_ip + " rejected"));
      }

      hatchet.send("receive_coinbase_donation", request.payload, function(err, data) {
        if (err) {
          return reply(Boom.badImplementation("An error occurred while sending a message", err));
        }

        reply("queued message with id " + data.MessageId);
      });
    }
  });

  server.route({
    method: "POST",
    path: "/stripe/callback",
    config: {
      auth: "stripe"
    },
    handler: function(request, reply) {
      var event = request.payload;

      debug("received stripe event %j", event);

      switch (event.type) {
        case "charge.succeeded":
          Stripe.customers.retrieve(event.data.object.customer, function(retrieve_error, customer) {
            if (retrieve_error) {
              return reply(Boom.badImplementation("An error occurred while retrieving the customer", retrieve_error));
            }

            event.data.object.customer_object = customer;

            hatchet.send("stripe_charge_succeeded", event.data.object, function(hatchet_error, data) {
              if (hatchet_error) {
                return reply(Boom.badImplementation("An error occurred while sending a message", hatchet_error));
              }

              reply("queued message with id " + data.MessageId);
            });
          });
          break;
        case "charge.dispute.created":
          Stripe.disputes.close(
            event.data.object.id,
            function(close_dispute_error, dispute) {
              if (close_dispute_error) {
                return reply(Boom.badImplementation("An error occurred while closing the dispute", close_dispute_error));
              }

              reply("Dispute closed");
            }
          );
          break;
        default:
          reply("Event type not implemented");
      }
    }
  });

  return server;
};
