const Code = require("code");
const Lab = require("lab");
const lab = exports.lab = Lab.script();
const server = require("../web/server");
const Wreck = require("wreck");


lab.experiment("Coinbase", async() => {
  lab.test("callback success (ip range)", async() => {
    const s = await server({
      trust_proxy: true,
      coinbase_ip_range: ["54.243.226.26/32", "54.175.255.192/27"],
      coinbase_protocol: "https",
      coinbase_secret: "secret"
    });

    const request = {
      method: "POST",
      url: "/coinbase/callback?access_token=secret",
      headers: {
        "X-Forwarded-For": "54.175.255.200",
        "X-Forwarded-Proto": "https"
      }
    };

    const response = await s.inject(request);

    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result).to.equal("queued message with id fake");
  });

  lab.test("callback failure (ip range)", async() => {
    const s = await server({
      trust_proxy: true,
      coinbase_ip_range: ["54.243.226.26/32", "54.175.255.192/27"],
      coinbase_protocol: "https",
      coinbase_secret: "secret"
    });

    const request = {
      method: "POST",
      url: "/coinbase/callback?access_token=secret",
      headers: {
        "X-Forwarded-For": "66.207.208.102",
        "X-Forwarded-Proto": "https"
      }
    };

    const response = await s.inject(request);

    Code.expect(response.statusCode).to.equal(403);
    Code.expect(response.result).to.equal({
      statusCode: 403,
      error: "Forbidden",
      message: "IP address 66.207.208.102 rejected"
    });
  });

  lab.test("callback success (trust proxy)", async() => {
    const s = await server({
      trust_proxy: true,
      coinbase_ip_range: ["54.243.226.26/32"],
      coinbase_protocol: "https",
      coinbase_secret: "secret"
    });

    const request = {
      method: "POST",
      url: "/coinbase/callback?access_token=secret",
      headers: {
        "X-Forwarded-For": "54.243.226.26",
        "X-Forwarded-Proto": "https"
      }
    };

    const response = await s.inject(request);

    Code.expect(response.statusCode).to.equal(200);
    Code.expect(response.result).to.equal("queued message with id fake");
  });

  lab.test("callback success", async function() {
    const s = await server({
      host: "127.0.0.1",
      port: 0,
      trust_proxy: false,
      coinbase_ip_range: ["127.0.0.1/32"],
      coinbase_protocol: "http",
      coinbase_secret: "secret"
    });

    const {
      res,
      payload
    } = await Wreck.post(`${s.info.uri}/coinbase/callback?access_token=secret`);

    Code.expect(payload.toString()).to.equal("queued message with id fake");
    await s.stop();
  });

  lab.test("missing access_token", async function() {
    const s = await server({
      trust_proxy: false,
      coinbase_ip_range: ["54.243.226.26/32"],
      coinbase_protocol: "http",
      coinbase_secret: "secret"
    });

    const request = {
      method: "POST",
      url: "/coinbase/callback"
    };

    const response = await s.inject(request);

    Code.expect(response.statusCode).to.equal(401);
    Code.expect(response.result).to.equal({
      statusCode: 401,
      error: "Unauthorized",
      message: "Missing authentication"
    });
  });

  lab.test("invalid access_token", async function() {
    const s = await server({
      trust_proxy: false,
      coinbase_ip_range: ["54.243.226.26/32"],
      coinbase_protocol: "http",
      coinbase_secret: "secret"
    });

    const request = {
      method: "POST",
      url: "/coinbase/callback?access_token=notsecret"
    };

    const response = await s.inject(request);

    Code.expect(response.statusCode).to.equal(401);
    Code.expect(response.result.statusCode).to.equal(401);
    Code.expect(response.result.error).to.equal("Unauthorized");
    Code.expect(response.result.message).to.equal("Bad token");
  });

  lab.test("wrong protocol", async function() {
    const s = await server({
      trust_proxy: true,
      coinbase_ip_range: ["54.243.226.26/32"],
      coinbase_protocol: "https",
      coinbase_secret: "secret"
    });

    const request = {
      method: "POST",
      url: "/coinbase/callback?access_token=secret",
      headers: {
        "X-Forwarded-For": "54.243.226.26",
        "X-Forwarded-Proto": "http"
      }
    };

    const response = await s.inject(request);

    Code.expect(response.statusCode).to.equal(400);
    Code.expect(response.result).to.equal({
      statusCode: 400,
      error: "Bad Request",
      message: "Requests must be made using https"
    });
  });

  lab.test("wrong ip address", async function() {
    const s = await server({
      trust_proxy: true,
      coinbase_ip_range: ["54.243.226.26/32"],
      coinbase_protocol: "https",
      coinbase_secret: "secret"
    });

    const request = {
      method: "POST",
      url: "/coinbase/callback?access_token=secret",
      headers: {
        "X-Forwarded-For": "8.8.8.8",
        "X-Forwarded-Proto": "https"
      }
    };

    const response = await s.inject(request)

    Code.expect(response.statusCode).to.equal(403);
    Code.expect(response.result).to.equal({
      statusCode: 403,
      error: "Forbidden",
      message: "IP address 8.8.8.8 rejected"
    });
  });
});
