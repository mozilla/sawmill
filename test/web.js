var Code = require("code");
var Lab = require("lab");
var lab = exports.lab = Lab.script();
var server = require("../web/server");

lab.experiment("Coinbase", function() {
  lab.test("callback success (trust proxy)", function(done) {
    var s = server({
      trust_proxy: true,
      coinbase_address: "54.243.226.26",
      coinbase_protocol: "https",
      coinbase_secret: "secret"
    });

    var request = {
      method: "POST",
      url: "/coinbase/callback?access_token=secret",
      headers: {
        "X-Forwarded-For": "54.243.226.26",
        "X-Forwarded-Proto": "https"
      }
    };

    s.inject(request, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.equal("queued message with id fake");

      done();
    });
  });

  lab.test("callback success", function(done) {
    var s = server({
      trust_proxy: false,
      coinbase_address: "",
      coinbase_protocol: "http",
      coinbase_secret: "secret"
    });

    var request = {
      method: "POST",
      url: "/coinbase/callback?access_token=secret"
    };

    s.inject(request, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.equal("queued message with id fake");

      done();
    });
  });

  lab.test("missing access_token", function(done) {
    var s = server({
      trust_proxy: false,
      coinbase_address: "",
      coinbase_protocol: "http",
      coinbase_secret: "secret"
    });

    var request = {
      method: "POST",
      url: "/coinbase/callback"
    };

    s.inject(request, function(response) {
      Code.expect(response.statusCode).to.equal(401);
      Code.expect(response.result).to.deep.equal({
        statusCode: 401,
        error: "Unauthorized",
        message: "Missing authentication"
      });

      done();
    });
  });

  lab.test("invalid access_token", function(done) {
    var s = server({
      trust_proxy: false,
      coinbase_address: "",
      coinbase_protocol: "http",
      coinbase_secret: "secret"
    });

    var request = {
      method: "POST",
      url: "/coinbase/callback?access_token=notsecret"
    };

    s.inject(request, function(response) {
      Code.expect(response.statusCode).to.equal(401);
      Code.expect(response.result).to.deep.equal({
        statusCode: 401,
        error: "Unauthorized",
        message: "Bad token"
      });

      done();
    });
  });

  lab.test("wrong protocol", function(done) {
    var s = server({
      trust_proxy: true,
      coinbase_address: "",
      coinbase_protocol: "https",
      coinbase_secret: "secret"
    });

    var request = {
      method: "POST",
      url: "/coinbase/callback?access_token=secret",
      headers: {
        "X-Forwarded-For": "54.243.226.26",
        "X-Forwarded-Proto": "http"
      }
    };

    s.inject(request, function(response) {
      Code.expect(response.statusCode).to.equal(400);
      Code.expect(response.result).to.deep.equal({
        statusCode: 400,
        error: "Bad Request",
        message: "Requests must be made using https"
      });

      done();
    });
  });

  lab.test("wrong ip address", function(done) {
    var s = server({
      trust_proxy: true,
      coinbase_address: "54.243.226.26",
      coinbase_protocol: "https",
      coinbase_secret: "secret"
    });

    var request = {
      method: "POST",
      url: "/coinbase/callback?access_token=secret",
      headers: {
        "X-Forwarded-For": "8.8.8.8",
        "X-Forwarded-Proto": "https"
      }
    };

    s.inject(request, function(response) {
      Code.expect(response.statusCode).to.equal(403);
      Code.expect(response.result).to.deep.equal({
        statusCode: 403,
        error: "Forbidden",
        message: "IP address 8.8.8.8 rejected"
      });

      done();
    });
  });

  lab.test("hatchet error", function(done) {
    var s = server({
      trust_proxy: true,
      coinbase_address: "54.243.226.26",
      coinbase_protocol: "https",
      coinbase_secret: "secret"
    });

    var request = {
      method: "POST",
      url: "/coinbase/callback?access_token=secret",
      headers: {
        "X-Forwarded-For": "54.243.226.26",
        "X-Forwarded-Proto": "https"
      }
    };

    process.env.HATCHET_QUEUE_URL = "http://127.0.0.1";

    s.inject(request, function(response) {
      delete process.env.HATCHET_QUEUE_URL;

      Code.expect(response.statusCode).to.equal(500);
      Code.expect(response.result).to.deep.equal({
        statusCode: 500,
        error: "Internal Server Error",
        message: "An internal server error occurred"
      });

      done();
    });
  });
});
