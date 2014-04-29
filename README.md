1. Install postgres
2. `cp env.dist .env`
3. `createdb sawmill`
4.  Run `psql -d sawmill -f 201404041717-add-user-events-table.sql` to create the table


To test events
==============

1. install awscli (`pip install awscli`)
2. `awscli configure` - add your AWS keys
3.  aws sqs send-message --queue-url <queue url> --message-body <json>
