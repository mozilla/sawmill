module.exports = function(apostle) {
  var LUMBERYARD_EVENT = "mailer";
  var FROM_EMAIL = 'Webmaker <help@webmaker.org>';

  return function(id, event, cb) {
    if (event.event_type !== "create_user" || event.data.sendNewUserEmail === false) {
      return process.nextTick(cb);
    }

    function success() {
      cb();
    }

    function error(message, response) {
      cb(response);
    }

    var options = {
      email: event.data.email,
      username: event.data.username || "there"
    };

    apostle.deliver("user_created", options).then(success, error);
  };
};
