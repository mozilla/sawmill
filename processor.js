var async = require("async");
var url = require("url");
var worker = require("./worker");
var redis_url = url.parse(process.env.REDIS_CONNECTION_STRING);
var redis_config = {
  port: redis_url.port,
  host: redis_url.hostname,
  auth: redis_url.auth,
  db: redis_url.path.substring(1)
};
var archiver_config = {
  connection_string: process.env.WORKER_ARCHIVER_CONNECTION_STRING
};

var notifier_messager = require("./messager/messager")({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_QUEUE_REGION,
  queueUrl: process.env.OUTGOING_QUEUE_URL
});

var workers = async.applyEachSeries([
  worker.archiver(archiver_config),
  worker.backwards_compatibility,
  worker.user_stats(redis_config),
  worker.referrer_stats(redis_config),
  worker.send_event_host_email(notifier_messager),
  worker.send_mofo_staff_email(notifier_messager),
  worker.send_new_user_email(notifier_messager),
  worker.sign_up_for_bsd(notifier_messager)
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

    m.delete(function(err) {
      if (err) {
        console.log(err);
      }

      m.next();
    });
  });
});
