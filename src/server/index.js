const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const User = require('./models/User');
const Event = require('./models/Event');
const Employee = require('./models/Employee');
const withAuth = require('./middleware');

const app = express();


const secret = 'secret_should_not_be_in_git';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongo_uri = 'mongodb://localhost:27017/react-auth';
mongoose.connect(mongo_uri, { useNewUrlParser: true }, function(err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/home', function(req, res) {
  res.send('Welcome!');
});

app.get('/api/secret', withAuth, function(req, res) {
  res.send('Secret content');
});

app.post('/api/register', function(req, res) {
  const { firstname, lastname, email, password } = req.body;
  const user = new User({ firstname, lastname, email, password });
  user.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send('Error registering new user please try again.');
    } else {
      res.status(200).send('Welcome to the club!');
    }
  });
});

app.post('/api/authenticate', function(req, res) {
  const { firstname, lastname, email, password } = req.body;
  User.findOne({ email }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect email or password'
        });
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Internal error please try again'
            });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect email or password'
            });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

app.get('/api/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});

app.get('/api/logout', withAuth, function(req, res) {
  res.cookie('token', '', { httpOnly: true }).sendStatus(200);;
});

// retrieve all user objects from DB
app.get('/api/events', (req, res) => {
  Event.find({}, (err, data) => {
    if (err) throw err;

    res.send(data);
  });
});

app.get('/api/employees', (req, res) => {
  Employee.find({}, (err, data) => {
    if (err) throw err;

    res.send(data);
  });
});

app.get('/api/events/:id', (req, res) => {
  Event.findOne({_id: new ObjectID(req.params.id) }, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// update user based on info supplied in request body
app.put('/api/events', (req, res) => {
  // get the ID of the user to be updated
  let id  = req.body._id;
  // console.log(id);
  // remove the ID so as not to overwrite it when updating
  delete req.body._id;
  // find a user matching this ID and update their details
  Event.updateOne( {_id: new ObjectID(id) }, {$set: req.body}, (err, result) => {
    if (err) throw err;

    console.log('updated in database');
    return res.send({ success: true });
  });
});

// delete user with specific ID from DB
app.delete('/api/events', (req, res) => {
  let id  = req.body._id;
  Event.findOneAndDelete(id, function(err) {
    if (!err) {
      res.sendStatus(200);
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

// create new user based on info supplied in request body
app.post('/api/events', (req, res) => {
  const event = new Event(req.body);

  event.save((err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/api/events/:id/employees', function(req, res) {
  Event.findOne({_id: req.params.id}, function(err, data) {
    if (err) throw err;


    Employee.find({event_id: new ObjectID(req.params.id) }, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });
});

app.listen(process.env.PORT || 8080);
