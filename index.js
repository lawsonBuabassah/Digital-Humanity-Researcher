const express = require('express');
const requestController = require('./controllers/request.controller');
const path = require('path');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000

//setting up template/view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//setup static file connections
app.use(express.static(__dirname + "/static_files/"));

//start requestController
requestController(app);

//listen to port
app.listen(port);
console.log("Listening to port 3000");