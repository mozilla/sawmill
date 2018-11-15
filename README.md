# Sawmill

A Queue Message Processor written in NodeJS.

## Installation

1. `npm install`
2. `cp env.dist .env`
3. Queue Processor: `npm start`
4. Web hook server: `npm run web`

## Creating a Worker

Create a new file in `/worker` and have it export a function. 
This function should have the following signature: `function(event, cb)` 
`event` is the message the the queue processor receives.
`cb` is a function to call when the worker is done processing the message.
The exported function must be added to the worker list in `processor.js` in order for it to receive messages.

#### Messages
Each message will have an `event_type` attribute that a worker can check to determine if it should process the message
any further. Data about the event is available on `event.data`.


## Sending test events

1. install awscli (`pip install awscli`)
2. `awscli configure` - add your AWS keys
3.  aws sqs send-message --queue-url <queue url> --message-body <json>

Messages are typically sent using [hatchet](https://github.com/jbuck/hatchet), which sends messages with the following 
JSON structure, which you can provide as a string value when testing with the above method.

```json
{
  "app": "app_identifier",
  "event_type": "event_identifier",
  "timestamp": "ISO 8601 formatted string",
  "data": {
    "some": "Data"
  }
}
```
