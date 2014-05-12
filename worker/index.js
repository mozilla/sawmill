module.exports = {
  archiver: require("./archiver"),
  backwards_compatibility: require("./backwards_compatibility"),
  user_stats: require("./user_stats"),
  referrer_stats: require("./referrer_stats"),
  send_event_host_email: require("./send_event_host_email"),
  send_mofo_staff_email: require("./send_mofo_staff_email"),
  send_new_user_email: require("./send_new_user_email"),
  sign_up_for_bsd: require("./sign_up_for_bsd"),
  badge_awarded_send_email: require("./badge_awarded_send_email"),
  supermentor_awarded_set_permissions: require("./supermentor_awarded_set_permissions")
};
