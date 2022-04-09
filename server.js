const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ extended: true }));

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    let event = request.body;

    console.log(event);

    response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));