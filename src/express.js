//express to handle get/post requests
const express = require('express');
const app = express();
const port = 3000;

//function to listen for our get/post requests and send response/handle data
module.exports = {
    listen() {
        app.get('/', (request, response) => {
            response.send('GET request received.');
        })

        app.post('/', (request, response) => {
            response.send('POST request received.');
        })

        //allows Express to 'listen' for requests(basically just starts the server I believe)
        app.listen(port, () => {
            console.log('Listening on port 3000...');
        })
    }
}