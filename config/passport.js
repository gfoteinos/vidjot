const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model 
const User = mongoose.model('users');

// Export "passport" to linked to other files 
module.exports = function(passport) {
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  // Check if there is a user
    // Query the database to find a user with the input email 
    User.findOne({
      email: email
    }).then(user => {
        // If not found return error message 
        if(!user) {
          // "null" for the error, "false" for not found user & a "message"
          return done(null, false, {message: 'No User found'});
        }

        // Compare the non encrypted input "password" with the encrypted "user.password"
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch) {
            return done(null, user);
          } 
          else {
            return done(null, false, {message: 'Password incorect'});
          }
        });
      })
  }));

  // Serialize & deserialize a user 
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
}