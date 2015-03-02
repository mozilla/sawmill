var config = {
  host: process.env.HOST,
  port: process.env.PORT,
  trust_proxy: process.env.TRUST_PROXY === "true",

  coinbase_address: process.env.COINBASE_ADDRESS,
  coinbase_protocol: process.env.COINBASE_PROTOCOL,
  coinbase_secret: process.env.COINBASE_SECRET
};

var server = require("./server")(config);

server.start(function() {
  console.log('Server running at: %s', server.info.uri);
});
