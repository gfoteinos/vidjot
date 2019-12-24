
// Bring in istalled modules
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

// Initialize app 
const app = express();

// Load routes 
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config - link passport module
require('./config/passport.js')(passport);

// Map global promise - get rid of warning 
mongoose.Promise = global.Promise;

// Connect to mongoose 
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// MIDDLEWARES
// Handlebars Middleware 
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body-parse middleware 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Path middleware 
  // Set the "public" folder to be the "express static" folder 
  app.use(express.static(path.join(__dirname, 'public')));

// Method-override middleware
app.use(methodOverride('_method'))

// Express-session middleware 
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware 
// It's important to go bellow the "Express session middleware"
app.use(passport.initialize());
app.use(passport.session());


// Connect-flash middleware 
app.use(flash());

// Global variables for flash messages
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  // Set a global var for logged user to "user" if exist or to "null" 
  // if it's not exist
  res.locals.user = req.user || null;
  next();
})

// ROUTES 
  // Load "index" page ("GET" request) 
  app.get('/', (req, res) => {
    const title = 'Welcome';
    // Load the "/" page rendering the "index.handlebars" file & passing the above variable 
    res.render('index', {
      title: title
    });
  });

  // Load "about" page ("GET" request) 
  app.get('/about', (req, res) => {
    // Load the "/about" page rendering the "about.handlebars" file
    res.render('about');
  });

  // Use routes 
  app.use('/ideas', ideas);
  app.use('/users', users);

// Listen to certain port 
const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
