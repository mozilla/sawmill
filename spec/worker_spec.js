var JS  = require('jstest'),
    workers = require('../worker');

JS.Test.describe('Workers', function() { with(this) {
  describe('Backwards Compatibility', function() { with(this) {
    before(function() { with(this) {
      this.worker = workers.backwards_compatibility;
    }});

    it('Fixes user_id', function(resume) { with(this) {
      var event = {
        user_id: 123
      };

      worker( null, event, function() {
        assertEqual(123, event.userId);
        resume();
      });
    }});

    it('Fixes user', function(resume) { with(this) {
      var event = {
        user: "webmaker"
      };

      worker( null, event, function() {
        assertEqual("webmaker", event.username);
        resume();
      });
    }});

    it('Doesn\'t touch valid properties', function(resume) { with(this) {
      var event = {
        username: "webmaker",
        userId: 123
      };

      worker( null, event, function() {
        assertEqual("webmaker", event.username);
        assertEqual(123, event.userId);
        resume();
      });
    }});
  }});
}});
