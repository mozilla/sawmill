const {
  HOST: host,
  PORT: port,
  COINBASE_PROTOCOL: coinbase_protocol,
  COINBASE_SECRET: coinbase_secret,
  STRIPE_SECRET: stripe_secret
} = process.env;

let {
  TRUST_PROXY: trust_proxy,
  COINBASE_IP_RANGE: coinbase_ip_range
} = process.env;

trust_proxy = trust_proxy === "true";
coinbase_ip_range = coinbase_ip_range.split(",");

const config = {
  host,
  port,
  trust_proxy,
  coinbase_ip_range,
  coinbase_protocol,
  coinbase_secret,
  stripe_secret
};

async function startWebServer() {
  try {
    let server = await require("./server")(config);
    console.log('Server running at: %s', server.info.uri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startWebServer();
