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
var contribution_events = [
  "create_event"
];

var profile_update_map = {
  latestContribution: function(eventData) {
    if (contribution_events.indexOf(eventData.event_type) !== -1) {
      this.latestContribution = Date.now();
    }
  },
  contributor: function(eventData) {
    if (!this.contributor && contribution_events.indexOf(eventData.event_type) !== -1) {
      this.contributor = true;
      this.firstContribution = Date.now();
    }
  },
  eventHost: function(eventData) {
    if ( !this.eventHost && this.event_type === "create_event" ) {
      this.eventHost = true;
    }
  },
  deletedAt: function(eventData) {
    if ( eventData.event_type === "delete_user" ) {
      this.deletedAt = Date.now();
    }
  }
};

var profile_properties = Object.keys(profile_update_map);

var Contributor = function Contributor(profileData) {
  profileData = profileData || {};

  this.firstContribution: profileData.firstContribution || null;
  this.latestContribution: profileData.latestContribution || null;
  this.contributor: !!profileData.contributor;
  this.eventHost: !!profileData.eventHost;
  this.createdAt: profileData.createdAt || Date.now;
  this.deletedAt: profileData.deletedAt || null;
};

Contributor.prototype.updateProfile = function(eventData) {
  profile_properties.forEach(function(profile_prop) {
    if ( profile_update_map.hasOwnProperty(profile_prop) ) {
      profile_update_map[profile_prop].apply(this, eventData);
    }
  });
  this.lastActive = Date.now();
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

module.exports = function() {
  return new Contributor();
};
