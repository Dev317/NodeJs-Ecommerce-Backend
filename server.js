// provide some funtionalities to spin up server
const http = require('http');

// import express app listener
const app = require('./app');

// create a port, accessed through env variables
// if there is no port env variable, pick 3000 as the port instead
const port = process.env.PORT || 3000;

// pass in a listener that handles any incoming request
const server = http.createServer(app);

server.listen(port);
console.log(`Server listening on port: ${server.address().port}`);