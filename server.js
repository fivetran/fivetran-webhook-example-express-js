const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const clc = require('cli-color');
const crypto = require('crypto');

const SIGNATURE_SECRET = 'my_secret';

const dumpHeaders = (headers) => {
    console.log(clc.cyan('Headers'));
    console.log(headers);
    console.log(os.EOL);
}

const dumpPayload = (payload) => {
    console.log(clc.cyan('Payload'))
    console.log(payload);
    console.log(os.EOL);
}

const checkSignature = (request) => {
    var actualSignature = request.header('x-fivetran-signature-256');
    if (actualSignature) {
        var expectedSignature = crypto.createHmac('sha256', SIGNATURE_SECRET).update(request.body).digest('hex');
        if (actualSignature.toUpperCase() === expectedSignature.toUpperCase()) {
            console.log(clc.green('Signature OK'));
        } else {
            console.log(clc.red('Signature mismatch'));
        }
    }
}

const app = express();
app.use(bodyParser.text({type: 'application/json', defaultCharset: 'utf-8'}));
app.post('/', (request, response) => {
    dumpHeaders(request.headers);
    dumpPayload(request.body);
    checkSignature(request);
    console.log('==========' + os.EOL);

    response.send();
});
app.listen(4141, () => console.log('Running on port 4141'));
