var AWS = require("aws-sdk");

var Messager = function Messager(config) {
  this._queueUrl = config.queueUrl
  this._sqs = new AWS.SQS({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
  })
};

Messager.prototype.sendMessage = function(data, cb) {
  this._sqs.sendMessage({
    MessageBody: JSON.stringify(data),
    QueueUrl: this._queueUrl,
    DelaySeconds: 0
  }, cb);
};

module.exports = function(config) {
  return new Messager(config);
};
