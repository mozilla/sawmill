var JS  = require('jstest'),
    workers = require('../worker');

JS.Test.describe('Workers', function() { with(this) {
  describe('Backwards Compatibility', function() { with(this) {
    before(function() { with(this) {
      this.worker = workers.backwards_compatibility;
    }});

    it('Fixes user_id', function(resume) { with(this) {
      var event = {
        data: {
          user_id: 123
        }
      };

      worker( event, function() {
        assertEqual(123, event.data.userId);
        resume();
      });
    }});

    it('Fixes user', function(resume) { with(this) {
      var event = {
        data: {
          user: "webmaker"
        }
      };

      worker( event, function() {
        assertEqual("webmaker", event.data.username);
        resume();
      });
    }});

    it('Doesn\'t touch valid properties', function(resume) { with(this) {
      var event = {
        data: {
          username: "webmaker",
          userId: 123
        }
      };

      worker( event, function() {
        assertEqual("webmaker", event.data.username  );
        assertEqual(123, event.data.userId);
        resume();
      });
    }});

    it('Sets default locale', function(resume) { with(this) {
      var event = {
        data: {}
      };

      worker( event, function() {
        assertEqual('en-US', event.data.locale);
        resume();
      });
    }});

    it('Doesn\'t override another locale', function(resume) { with(this) {
      var event = {
        data: {
          locale: "en-CA"
        }
      };

      worker( event, function() {
        assertEqual('en-CA', event.data.locale);
        resume();
      });
    }});
  }});
}});
