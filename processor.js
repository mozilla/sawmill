if (process.env.NEW_RELIC_ENABLED) {
  require("newrelic");
}

var async = require("async");
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

var rateLimitConfig,
    ttl = process.env.TTL || 1000 * 60 * 5;

if ( process.env.REDIS_HOST && process.env.REDIS_PORT ) {
  rateLimitConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    database: process.env.REDIS_DATABASE || 0,
    password: process.env.REDIS_AUTH,
    partition: "sawmill"
  };
}

require("./rate-limit")(rateLimitConfig, ttl, startProcessor);


function startProcessor(rateLimitClient) {

  var mailroom = require('webmaker-mailroom')();

  var workers = async.applyEachSeries([
    // worker.archiver(archiver_config),
    worker.backwards_compatibility,
    worker.remind_user_about_event(notifier_messager, mailroom),
    worker.login_request(notifier_messager, mailroom),
    worker.send_sms(notifier_messager, rateLimitClient),
    worker.receive_coinbase_donation(notifier_messager, mailroom),
    worker.reset_request(notifier_messager, mailroom),
    worker.send_event_host_email(notifier_messager, mailroom),
    worker.send_mofo_staff_email(notifier_messager, mailroom, process.env.MOFO_STAFF_EMAIL),
    worker.send_new_user_email(notifier_messager, mailroom),
    worker.event_mentor_confirmation_email(notifier_messager, mailroom),
    worker.event_coorganizer_added(notifier_messager, mailroom),
    worker.sign_up_for_bsd(notifier_messager),
    worker.badge_awarded_send_email(notifier_messager),
    worker.badge_application_denied(notifier_messager, mailroom),
    worker.hive_badge_awarded(notifier_messager, mailroom),
    worker.suggest_featured_resource(notifier_messager, process.env.SFR_SPREADSHEET, process.env.SFR_WORKSHEET)
  ]);

  var SqsQueueParallel = require('sqs-queue-parallel');
  var config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    name: process.env.INCOMING_QUEUE_NAME,
    region: process.env.AWS_QUEUE_REGION,
    debug: process.env.DEBUG
  };
  var queue = new SqsQueueParallel(config);

  queue.on("message", function(m) {
    workers(m.message.MessageId, m.data, function(err) {
      if (err) {
        console.log(err);
        return m.next();
      }

      if (config.debug) {
        console.log('SAWMILL EVENT [' + m.data.event_type + ']: %j', m.data.data);
      }

      m.deleteMessage(function(err) {
        if (err) {
          console.log(err);
        }

        m.next();
      });
    });
  });
}
