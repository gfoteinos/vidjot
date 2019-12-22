// Bring in installed modules 
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();


// Load Idea model 
require('../models/User');
const User = mongoose.model('users');

// Load "Login" form page ("GET" request)
 router.get('/login', (req, res) => {
  res.render('users/login');
}); 

// Load "Register" form page ("GET" request)
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Submit "register" form page ("post" request) - Add user  
router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password != req.body.password2) {
    errors.push({text:'Passwords do not match'});
  }

  if(req.body.password.length < 4) {
    errors.push({text:'Password must be at least 4 characters'});
  }
  
  // If there are errors with the password 
  if(errors.length > 0 ) {
    // rerender the register page with all input values & errors messages
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    // Check if there is a user with the input email 
    User.findOne({email: req.body.email})
      .then(user => {
        // If there is a user; then flash an error message & redirect to the registry page elae save the user
        if(user) {
          req.flash('error_msg', 'Email already registered');
          res.redirect('/users/register');
        } else {
          // Create a user object 
          const newUser = new User ({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          // Encrypt & replace the users plain text password 
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              // Save the user to the database, flash a success message and redirect to the login page
              newUser.save()
              .then(user => {
                req.flash('success_msg', 'You are now register and can loggin');
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
                return;
              })
            });
          });
        }
      })  
  }
});

module.exports = router;