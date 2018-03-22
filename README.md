## Installation

1. `npm install`
2. `cp env.dist .env`

## To test events

1. install awscli (`pip install awscli`)
2. `awscli configure` - add your AWS keys
3.  aws sqs send-message --queue-url <queue url> --message-body <json>
