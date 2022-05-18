const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const clc = require('cli-color');
const crypto = require('crypto');

const SIGNATURE_SECRET = 'my_secret';
const app = express();

function dumpHeaders(headers) {
    console.log(clc.cyan('Headers'));
    console.log(headers);
    console.log(os.EOL);
}

function dumpPayload(payload) {
    console.log(clc.cyan('Payload'))
    console.log(payload);
    console.log(os.EOL);
}

function checkSignature(request) {
    var actualSignature = request.header('x-fivetran-signature-256');
    if (actualSignature) {
        var payloadString = JSON.stringify(request.body);
        console.log(payloadString);
        var expectedSignature = crypto.createHmac('sha256', SIGNATURE_SECRET).update(payloadString).digest('hex');
        if (actualSignature.toUpperCase() === expectedSignature.toUpperCase()) {
            console.log(clc.green('Signature OK'));
        } else {
            console.log(clc.red('Signature mismatch'));
        }
    }
}

app.use(bodyParser.json({ extended: true }));
app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    dumpHeaders(request.headers);
    dumpPayload(request.body);
    checkSignature(request);
    console.log('==========' + os.EOL);

    response.send();
});
app.listen(4242, () => console.log('Running on port 4242'));
