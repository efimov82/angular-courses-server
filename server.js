const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

jsonwebtoken = require("jsonwebtoken");
require('dotenv').config();

const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const port = process.env.LISTEN_PORT ? process.env.LISTEN_PORT : 3000;
console.log('port=', port);

// Connecting to the database
mongoose.connect(process.env.DB_HOST)
  .then(() => {
    console.log("Successfully connected to the database");
  }).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
  });

// create express app
const app = express();

app.use(express.static('public'));
app.use(fileUpload());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Add headers
app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// define a simple route
app.get('/', (req, res) => {
  res.json({ "message": "Welcome to Easy Courses application. Take courses quickly." });
});

// route middleware to verify a token
app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      // TODO add log user login
      console.log(decode);
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

require('./app/routes/courses.routes.js')(app);
require('./app/routes/auth.routes.js')(app);

if (process.env.DEVELOPMENT_MODE) { // Develop HTTP server
  app.listen(port, () => {
    console.log(`Server listining: http:${process.env.HOST_NAME}:${port}`);
  });
} else { // Production Server HTTPS
  const privateKey = fs.readFileSync(process.env.SSL_PRIVATE_KEY, 'utf8');
  const certificate = fs.readFileSync(process.env.SSL_PUBLIC_KEY, 'utf8');

  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(port, () => {
    console.log(`Server listining: https:${process.env.HOST_NAME}:${port}`);
  });
}