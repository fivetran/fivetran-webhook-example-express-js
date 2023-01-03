# Fivetran Webhooks Test Project in Express.js
A simple example of how to ingest webhooks from Fivetran! Check out the [same example in Python/Flask](https://github.com/fivetran-jimmyhooker/fivetran-webhook-example-python-flask)!

## Setup
We'll use a really simple Express.js server combined with Ngrok to locally test webhooks. 

If you're not familiar with Ngrok, it's a really fast, secure, and easy way to create tunnels to your desktop. This will make it so we can receive webhooks from Fivetran and show them on our local server.

### Prepare
You'll need a Fivetran account and your key and secret that you can find in settings. Find out more in our [getting started guide](https://fivetran.com/docs/rest-api/getting-started).

In addition, head over to Ngrok, create an account, and install it: https://ngrok.com/download

And finally, make sure you have [Node](https://nodejs.org/en/) installed (I generally stick to LTS). 

### Setup the project
If you are signing your webhooks and want to enable signature verification, create a `.env` file in the root of the project and add your signing secret in the below format:
```
SIGNATURE_SECRET=
```

This will just install some node dependencies and start up the server on port `4242`. Run these from the root of the project folder. 
- Run `npm install`
- Run `npm run start`

### Open a tunnel
Run this from your terminal to open a tunnel to port 4242 on your machine (which is what this express server will run on)
- `ngrok http 4242`

Copy down the https (secure) url that ngrok gives you

### Create a webhook
Use the url that Ngrok gave you and create a webhook. Make sure to add `/webhook` to the end, since that's the path to the webhook endpoint this server creates. You can utilize our [Postman collection](https://fivetran.com/docs/rest-api/api-tools#fivetranpostmancollection) for this.

POST https://api.fivetran.com/v1/webhooks/account
```
{
  "url": "https://a-bunch-of-numbers.ngrok.io/webhook",
  "events": [
    "sync_end"
  ],
  "active": true
}
```
### Test the webhook
Fire a test event to see the response in real time. Make sure to replace `{webhook_id}` with the actual id you got back in the previous step. 

POST https://api.fivetran.com/v1/webhooks/{webhook_id}/test
```
{
  "event": "sync_end"
}
```
### Check the results
You should see a response similar to the following show up on your command line.
```
{
  event: 'sync_end',
  created: '2022-04-09T00:08:12.294Z',
  connector_type: '_connector_type',
  connector_id: '_connector_1',
  destination_group_id: '_destination_1'
}
```

### Build cool stuff!
We can't wait to see what you build on top of webhooks!
