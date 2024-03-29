const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const clc = require('cli-color');
const crypto = require('crypto');

dotenv.config();
const signatureSecret = process.env.SIGNATURE_SECRET;

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
    if (actualSignature && signatureSecret) {
        var expectedSignature = crypto.createHmac('sha256', signatureSecret).update(request.body).digest('hex');
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
app.listen(4242, () => console.log('Running on port 4242'));
