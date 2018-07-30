const nodemailer = require("nodemailer");
const sesTransport = require("nodemailer-ses-transport");
const EVENT_NAME = 'mailer';
const transport = nodemailer.createTransport(sesTransport({
  AWSAccessKeyID: process.env.AWS_ACCESS_KEY_ID,
  AWSSecretKey: process.env.AWS_SECRET_ACCESS_KEY
}));

module.exports = function(event, cb) {
  if (event.event_type !== EVENT_NAME) {
    return process.nextTick(cb);
  }

  const data = event.data;

  // Check required fields
  let errMessage = '';
  if (!data.html || typeof data.html !== 'string') {
    errMessage += 'Mailer: Missing "html" option. You must provide an email body as a string of html. ';
  }
  if (!data.from || typeof data.from !== 'string') {
    errMessage += 'Mailer: Missing "from" option. You must provide an email as a string. ';
  }
  if (!data.to || !(typeof data.to == 'string' || data.to.length)) {
    errMessage += 'Mailer: Missing "to" option. You must provide a list of emails as a string (comma-separated) or an array. ';
  }
  if (errMessage) {
    return process.nextTick(() => {
      cb(new Error(errMessage));
    });
  }

  // Automatically generate plain text
  data.generateTextFromHTML = true;

  // Send if livemode is true, or if no livemode flag is indicated (backwards compatibility for other workers)
  if (!data.hasOwnProperty('livemode') || data.livemode) {
    process.nextTick(() => {
      transport.sendMail(data, cb);
    });
  } else {
    console.log('Dumping email to console because livemode is disabled');
    console.log(`To: ${data.to}\nFrom: ${data.from}\nBody: ${data.html}`);
    cb();
  }
};
