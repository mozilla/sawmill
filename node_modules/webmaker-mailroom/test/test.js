var assert = require('assert')
var mailer = require('../index.js')();
var data = require('./mock-data.js');

describe('webmaker-mailroom', function() {
  describe('#render', function() {

    it('should render "test"', function() {
      var output = mailer.render('test', data.test[0]);
      assert.equal(output.html, '<p>This is a test 123</p>\n');
      assert.equal(output.subject, 'This is a test');
    });

    it('should render "event_mentor_confirmation_email"', function() {
      var output = mailer.render('event_mentor_confirmation_email', data.event_mentor_confirmation_email[0]);
      var output2 = mailer.render('event_mentor_confirmation_email', data.event_mentor_confirmation_email[1]);
      assert(output.html);
      assert(output.subject);
      assert(output2.html);
      assert(output2.subject);
    });

  });

});
