var async = require("async");
var Catbox = require("catbox");
var CatboxMemory = require("catbox-memory");
var CatboxRedis = require("catbox-redis");
var url = require("url");
var worker = require("./worker");
var archiver_config = {
  connection_string: process.env.WORKER_ARCHIVER_CONNECTION_STRING
};

var notifier_messager = require("./messager/messager")({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_QUEUE_REGION,
  queueUrl: process.env.OUTGOING_QUEUE_URL
});

var catbox,
    ttl = process.env.TTL || 1000 * 60 * 5;

if ( process.env.CACHE_ENGINE === "redis" ) {
  catbox = new Catbox.Client(
    new CatboxRedis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      database: process.env.REDIS_DATABASE || 0,
      password: process.env.REDIS_AUTH,
      partition: "sawmill"
    })
  );
} else {
  catbox = new Catbox.Client(new CatboxMemory());
}

var mailroom = require('webmaker-mailroom')();

var workers = async.applyEachSeries([
  worker.archiver(archiver_config),
  worker.backwards_compatibility,
  worker.remind_user_about_event(notifier_messager, mailroom),
  worker.login_request(notifier_messager, mailroom),
  worker.send_sms(notifier_messager, catbox, ttl),
  worker.receive_coinbase_donation(notifier_messager, mailroom),
  worker.reset_request(notifier_messager, mailroom),
  worker.send_event_host_email(notifier_messager, mailroom),
  worker.send_mofo_staff_email(notifier_messager, mailroom, process.env.MOFO_STAFF_EMAIL),
  worker.send_new_user_email(notifier_messager, mailroom, process.env.TEACH_CLIENT_ID),
  worker.event_mentor_confirmation_email(notifier_messager, mailroom),
  worker.event_coorganizer_added(notifier_messager, mailroom),
  worker.sign_up_for_bsd(notifier_messager),
  worker.badge_awarded_send_email(notifier_messager),
  worker.badge_application_denied(notifier_messager, mailroom),
  worker.hive_badge_awarded(notifier_messager, mailroom),
  worker.mozfest_session_proposal(notifier_messager, mailroom),
  worker.suggest_featured_resource(notifier_messager, process.env.SFR_SPREADSHEET, process.env.SFR_WORKSHEET)
]);

var SQSProcessor = require('sqs-processor');
var queue = new SQSProcessor({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_QUEUE_REGION,
  queueUrl: process.env.INCOMING_QUEUE_URL
});

catbox.start(function startProcessor(catbox_error) {
  if (catbox_error) {
    throw catbox_error;
  }

  queue.startPolling(function(message, poll_callback) {
    workers(message, function(worker_error) {
      poll_callback(worker_error);
    });
  }, function(poll_error) {
    console.log(poll_error);
    console.log(poll_error.stack);
  });
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
