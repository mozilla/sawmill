/* Contributor Profile Interface
**
** An interface for managing contributor profile data saved in Redis
**
** Properties:
**
** lastActive: Date - The last time this user triggered an event to the aggregator queue
** firstContribution: Date - The first time this user triggered an event considered to be a contribution
** latestContribution: Date - The last time this user triggered an event considered to be a contribution
** contributor: Boolean - Has this user contributed to Webmaker
** eventHost: Boolean - Has this user created an event on events.webmaker.org
** createdAt: Date - When this contributor profile was created
** deletedAt: Date - When this Webmaker Account was deleted
**
*/

// event_types that indicate contribution should be added here
// valid contribution types:
// * code
// * content
// * events
// * training
// * community
// * testing
// * apis
//
var contribution_events = [
  {
    name: "create_event",
    type: "events"
  }
];

var getContributionInfo = function(type) {
  for (var i = contribution_events.length - 1; i >= 0; i--) {
    if ( contribution_events[i].name === type ) {
      return contribution_events[i]
    }
  }
};

var profile_update_map = {
  lastActive: function(eventData) {
    if (new Date(eventData.timestamp).valueOf() >
        new Date(this.lastActive).valueOf()) {
      this.lastActive = eventData.timestamp;
    }
  },
  firstContribution: function(eventData, isContribution) {
    if (isContribution &&
        new Date(eventData.timestamp).valueOf() <
        (this.firstContribution ? new Date(this.firstContribution).valueOf() : Date.now())) {
      this.firstContribution = eventData.timestamp;
    }
  },
  latestContribution: function(eventData, isContribution) {
    if (isContribution &&
        new Date(eventData.timestamp).valueOf() >
        (this.latestContribution ? new Date(this.latestContribution).valueOf() : 0)) {
      this.latestContribution = eventData.timestamp;
    }
  },
  contributor: function(eventData, isContribution) {
    if (!this.contributor && isContribution) {
      this.contributor = true;
    }
  },
  eventHost: function(eventData) {
    if ( !this.eventHost && eventData.event_type === "create_event" ) {
      this.eventHost = true;
    }
  },
  createdAt: function(eventData) {
    if (eventData.event_type === "create_user") {
      this.createdAt = eventData.timestamp;
    }
  },
  deletedAt: function(eventData) {
    if ( eventData.event_type === "delete_user" ) {
      this.deletedAt = eventData.timestamp;
    }
  }
};

var profile_properties = Object.keys(profile_update_map);

var Contributor = function Contributor(profileData) {
  profileData = profileData || {};

  this.lastActive = profileData.lastActive || null;
  this.firstContribution = profileData.firstContribution || null;
  this.latestContribution = profileData.latestContribution || null;
  this.contributor = !!profileData.contributor;
  this.eventHost = !!profileData.eventHost;
  this.createdAt = profileData.createdAt || null;
  this.deletedAt = profileData.deletedAt || null;
};

Contributor.prototype.updateProfile = function(eventData) {
  var isContribution = !!getContributionInfo(eventData.event_type);
  profile_properties.forEach(function(profile_prop) {
    if ( profile_update_map.hasOwnProperty(profile_prop) ) {
      profile_update_map[profile_prop].call(this, eventData, isContribution);
    }
  }, this);
};

Contributor.prototype.getData = function() {
  return {
    lastActive: this.lastActive,
    firstContribution: this.firstContribution,
    latestContribution: this.latestContribution,
    contributor: this.contributor,
    eventHost: this.eventHost,
    createdAt: this.createdAt,
    deletedAt: this.deletedAt
  };
};

module.exports = {
  getContributionInfo: getContributionInfo,
  Contributor: function(profileData) {
    return new Contributor(profileData);
  }
};
