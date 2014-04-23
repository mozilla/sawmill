var JS  = require('jstest'),
    Bucheron = require('../');

JS.Test.describe('Bucheron', function() { with(this) {
  it('exists', function() { with(this) {
    assert(Bucheron);
  }});

  it('has Contributor', function() { with(this) {
    assert(Bucheron.Contributor);
  }});

  it('has getContributionInfo', function() { with(this) {
    assert(Bucheron.getContributionInfo);
  }});

  describe('Default Values', function() { with(this) {

    before(function() { with(this){
      this.profileData = (new Bucheron.Contributor()).getData();
    }});

    it('Defaults lastActive', function() { with(this) {
      assertNot(profileData.lastActive);
      assertEqual(profileData.lastActive, null);
    }});
    it('Defaults firstContribution', function() { with(this) {
      assertNot(profileData.firstContribution);
      assertEqual(profileData.firstContribution, null);
    }});
    it('Defaults latestContribution', function() { with(this) {
      assertNot(profileData.latestContribution);
      assertEqual(profileData.latestContribution, null);
    }});
    it('Defaults contributor', function() { with(this) {
      assertNot(profileData.contributor);
      assertEqual(profileData.contributor, false);
    }});
    it('Defaults eventHost', function() { with(this) {
      assertNot(profileData.eventHost);
      assertEqual(profileData.eventHost, false);
    }});
    it('Defaults createdAt', function() { with(this) {
      assertNot(profileData.lastActive);
      assertEqual(profileData.lastActive, null);
    }});
    it('Defaults deletedAt', function() { with(this) {
      assertNot(profileData.deletedAt);
      assertEqual(profileData.deletedAt, null);
    }});
  }});

  describe('updates', function() { with(this) {
    before(function() { with(this) {
      this.p = Bucheron.Contributor({
        lastActive: "2014-01-01T00:00:00.000Z"
      });
    }});

    it('updates lastActive', function() { with(this) {
      p.updateProfile({
        event_type: "test",
        timestamp: "2014-01-01T01:00:00.000Z"
      });

      assertEqual("2014-01-01T01:00:00.000Z", p.getData().lastActive);
    }});

    it('updates lastActive if timestamp is newer', function() { with(this) {
      p.updateProfile({
        event_type: "test",
        timestamp: "2013-01-01T01:00:00.000Z"
      });

      assertEqual("2014-01-01T00:00:00.000Z", p.getData().lastActive);
    }});

    it('updates firstContribution', function() { with(this) {
      p.updateProfile({
        event_type: "create_event",
        timestamp: "2014-01-01T00:00:00.000Z"
      });

      assertEqual("2014-01-01T00:00:00.000Z", p.getData().firstContribution);
    }});

    it('updates firstContribution if timestamp is older', function() { with(this) {
      p.updateProfile({
        event_type: "create_event",
        timestamp: "2014-02-01T00:00:00.000Z"
      });
      p.updateProfile({
        event_type: "create_event",
        timestamp: "2014-01-01T00:00:00.000Z"
      });
      p.updateProfile({
        event_type: "create_event",
        timestamp: "2014-03-01T00:00:00.000Z"
      });

      assertEqual("2014-01-01T00:00:00.000Z", p.getData().firstContribution);
    }});

    it('latestContribution', function() { with(this) {
      p.updateProfile({
        event_type: "create_event",
        timestamp: "2014-02-01T00:00:00.000Z"
      });
      p.updateProfile({
        event_type: "create_event",
        timestamp: "2014-01-01T00:00:00.000Z"
      });
      p.updateProfile({
        event_type: "create_event",
        timestamp: "2014-03-01T00:00:00.000Z"
      });

      assertEqual("2014-03-01T00:00:00.000Z", p.getData().latestContribution);
    }});

    it('createdAt', function() { with(this) {
      p.updateProfile({
        event_type: "create_user",
        timestamp: "2014-01-01T00:00:00.000Z"
      });

      assertEqual("2014-01-01T00:00:00.000Z", p.getData().createdAt);
    }});
  }});
}});
