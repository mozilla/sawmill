module.exports = {
  test: [{
    number: '123'
  }],
  event_mentor_confirmation_email: [
    // This is if the user exists
    {
      username: "webmaker123",
      eventName: "Some Awesome Event",
      eventUrl: "https://events.webmaker.org/#!/events/3452",
      confirmUrlYes: "https://events.webmaker.org/confirm/somerandomtoken&confirmation=yes",
      confirmUrlNo: "https://events.webmaker.org/confirm/somerandomtoken&confirmation=no",
      organizerUsername: "k88hudson"
    },
    // This is if the user does not exist
    {
      eventName: "Some Other Awesome Event",
      eventUrl: "https://events.webmaker.org/#!/events/3452",
      confirmUrlYes: "https://events.webmaker.org/confirm/somerandomtoken&confirmation=yes",
      confirmUrlNo: "https://events.webmaker.org/confirm/somerandomtoken&confirmation=no",
      organizerUsername: "k88hudson"
    }
  ],
  hive_badge_awarded: [
    {
      username: "k88hudson",
      badgeUrl: "https://webmaker.org/badges/hive-community-member",
      profileUrl: "https://webmaker.org/user/k88hudson",
      comments: "Great job!!"
    },
    // No username
    {
      badgeUrl: "https://webmaker.org/badges/hive-community-member",
      signUpUrl: "https://webmaker.org"
    }
  ]
};
