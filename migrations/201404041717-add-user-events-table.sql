CREATE TABLE user_events
(
  id text NOT NULL,
  event json NOT NULL,
  CONSTRAINT id PRIMARY KEY (id)
);
