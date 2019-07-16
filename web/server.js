const Boom = require("boom");
const debug = require("debug")("http");
const forwarded = require("forwarded-for");
const Hapi = require("hapi");
const HapiAuthBearerToken = require("hapi-auth-bearer-token");
const hatchet = require("hatchet");
const Netmask = require("netmask").Netmask;

module.exports = async function(config) {
  const {
    trust_proxy,
    coinbase_protocol,
    coinbase_secret,
    port,
    host
  } = config;

  let { coinbase_ip_range } = config;

  coinbase_ip_range = coinbase_ip_range.map((cidr) => new Netmask(cidr));

  const server = Hapi.Server({
    app: {
      trust_proxy,
      coinbase_ip_range,
      coinbase_protocol,
      coinbase_secret
    },
    host,
    port
  });

  try {
    await server.register(HapiAuthBearerToken);

    server.auth.strategy("coinbase", "bearer-access-token", {
      allowQueryToken: true,
      validate: async(request, token) => {
        return {
          isValid: token === request.server.settings.app.coinbase_secret,
          credentials: { token }
        };
      }
    });

    server.route({
      method: "POST",
      path: "/coinbase/callback",
      config: {
        auth: "coinbase"
      },
      handler: async function(request, h) {
        // Do IP & Protocol validation here because I have no idea where else
        // https://devcenter.heroku.com/articles/http-routing#heroku-headers
        const client_ip = request.server.settings.app.trust_proxy ?
          forwarded(request.info, request.headers).ip : request.info.remoteAddress;
        const client_proto = request.server.settings.app.trust_proxy ?
          request.headers["x-forwarded-proto"] : request.server.info.protocol;

        if (client_proto !== request.server.settings.app.coinbase_protocol) {
          return Boom.badRequest(`Requests must be made using ${request.server.settings.app.coinbase_protocol}`);
        }

        // This logic is a little weird so:
        // 1) Loop through all of the valid IP ranges we have configured
        // 2) If every single block does not contain the client ip
        // 3) Then the client IP is not on the whitelist
        if (request.server.settings.app.coinbase_ip_range.every(function(block) {
          return !block.contains(client_ip);
        })) {
          return Boom.forbidden("IP address " + client_ip + " rejected");
        }

        return new Promise((resolve, reject) => {
          hatchet.send("receive_coinbase_donation", request.payload, function(err, data) {
            if (err) {
              return reject(Boom.badImplementation("An error occurred while sending a message", err));
            }

            resolve(h.response(`queued message with id ${data.MessageId}`).state(200));
          });
        });
      }
    });

    await server.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  return server;
};
