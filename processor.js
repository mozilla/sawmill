var async = require("async");
var worker = require("./worker");
var archiver_config = {
  connection_string: process.env.WORKER_ARCHIVER_CONNECTION_STRING
};
var workers = async.applyEachSeries([
  worker.archiver(archiver_config),
  worker.send_event_host_email(),
  worker.send_mofo_staff_email(),
  worker.send_new_user_email(),
  worker.sign_up_for_bsd()
]);

var SqsQueueParallel = require('sqs-queue-parallel');
var config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  name: process.env.INCOMING_QUEUE_NAME,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_QUEUE_REGION,
  debug: true
};
var queue = new SqsQueueParallel(config);

queue.on("message", function(m) {
  workers(m.data, function(err) {
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
