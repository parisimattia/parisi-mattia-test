var express = require('express');
var bodyParser = require('body-parser');
var cors = require ('cors');
var app = express();
var accounts = require('./routes/accounts');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ParisiMattiaTest');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/accounts', accounts);

var port = 3001;
app.listen(port, ()=>
{console.log("server start at port:", port)})
module.exports = app;
