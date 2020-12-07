const express = require('express');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://locamat:polytech@cluster0.k6vpz.mongodb.net/test?retryWrites=true&w=majority&authSource=admin', {useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

var users = require('./routes/users');
var materials = require('./routes/materials');
var booking = require('./routes/booking');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/users', users);
app.use('/api/v1/materials', materials);
app.use('/api/v1/booking', materials);

module.exports = app;
