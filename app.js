
// Bring in istalled modules
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize app 
const app = express();

// Map global promise - get rid of warning 
mongoose.Promise = global.Promise;

// Connect to mongoose 
mongoose.connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true,
useUnifiedTopology: true
 })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Load Idea model 
require('./models/Idea');
const Idea = mongoose.model('ideas');

// MIDDLEBARS 
  // Handlebars Middleware 
  app.engine('handlebars', exphbs({
    defaultLayout: 'main'
  }));
  app.set('view engine', 'handlebars');

  // Body-parse middleware 
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())


// ROUTES 
  // INDEX Route 
  app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
      title: title
    });
  });

  // ABOUT Route 
  app.get('/about', (req, res) => {
    res.render('about');
  });

  // Add Idea Form 
  app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
  });

  // Proccess Form 
  app.post('/ideas', (req, res) => {
    let errors = [];

    if(!req.body.title) {
      errors.push({text: "Please add a title"});
    }

    if(!req.body.details) {
      errors.push({text: "Please add some details"});
    }

    // If there are erros 
    if(errors.length > 0) {
      // Rerender the "Add idea" form page & pass in the errors
      res.render('ideas/add', {
        errors: errors,              //The errors texts
        title: req.body.title,      //The user input "title" text
        details: req.body.details   //The user input "details" text
      });
    } else {
      res.send('passed');
    }
  });


// Listen to certain port 
  const port = 5000;

  app.listen(port, () => {
    console.log(`Server started on port ${port}`)
  });
