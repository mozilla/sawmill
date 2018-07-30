var async = require("async");
var worker = require("./worker");

var notifier_messager = require("./messager/messager")({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_QUEUE_REGION,
  queueUrl: process.env.QUEUE_URL
});

var mailroom = require('webmaker-mailroom')();

var workers = async.applyEachSeries([
  worker.backwards_compatibility,
  worker.send_post_request,
  worker.login_request(notifier_messager, mailroom),
  worker.stripe_charge_succeeded(notifier_messager, mailroom),
  worker.receive_coinbase_donation(notifier_messager, mailroom),
  worker.reset_request(notifier_messager, mailroom),
  worker.mozfest_session_proposal_2018(notifier_messager, mailroom),
  worker.large_stripe_charge(notifier_messager, mailroom),
  worker.mailer
]);

var SQSProcessor = require('sqs-processor');
var queue = new SQSProcessor({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_QUEUE_REGION,
  queueUrl: process.env.QUEUE_URL
});

queue.startPolling(function(message, poll_callback) {
  workers(message, function(worker_error) {
    poll_callback(worker_error);
  });
}, function(poll_error) {
  console.log(poll_error);
  console.log(poll_error.stack);
});

var shutdown_handler = function() {
  queue.stopPolling(function() {
    console.log("polling terminated");
    process.exit(0);
  });
};

// Heroku's dyno manager sends SIGTERM when requesting dyno shut down, Ctrl-C sends SIGINT
process.on("SIGTERM", shutdown_handler);
process.on("SIGINT", shutdown_handler);
