// Import express.js
const express = require("express");
const path = require('path');



// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Set Pug as the view engine
app.set('view engine', 'pug');

// Set the path to the views directory
app.set('views', './views');

app.use(express.static('public'));

// Login
app.get('/login', (req, res) => {
    res.render('login');
  });

//   register

app.get('/register', (req, res) => {
    res.render('register');
  });

//   Admin

app.get('/admin', (req, res) => {
    res.render('admin');
  });
  

// Create a route for root - /
app.get("/", function(req, res) {
    db.query('SELECT * FROM images WHERE id >= 2 AND id <= 7').then(results => {
      const imageData = results.map(result => result.image.toString('base64'));
      res.render('index', { imageData });
    }).catch(error => {
      console.log(error);
      res.send(error);
    });
  });
  
  









// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});