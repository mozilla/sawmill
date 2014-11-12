var AWS = require("aws-sdk");

var Messager = function Messager(config) {
  this._sqs = new AWS.SQS({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
    params: {
      QueueUrl: config.queueUrl
    }
  })
};

Messager.prototype.sendMessage = function(data, cb) {
  this._sqs.sendMessage({
    MessageBody: JSON.stringify(data)
  }, cb);
};

module.exports = function(config) {
  return new Messager(config);
};
