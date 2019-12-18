
// Bring in istalled modules
const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize app 
const app = express();

// Map global promise - get rid of warning 
mongoose.Promise = global.Promise;

// Connect to mongoose 
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Load Idea model 
require('./models/Idea');
const Idea = mongoose.model('ideas');

// MIDDLEWARES
// Handlebars Middleware 
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body-parse middleware 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method-override middleware
app.use(methodOverride('_method'))

// ROUTES 
// Index Route 
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route 
app.get('/about', (req, res) => {
  res.render('about');
});

// Ideas Index Page Route 
app.get('/ideas', (req, res) => {
  // Fetch data from database 
  Idea.find({})
    // Sort them in descent order 
    .sort({ date: 'desc' })
    // Pass the data into the "ideas" page 
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Add Idea Form 
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form 
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      res.render('ideas/edit', {
        idea: idea
      });
    });
});


// Add Idea Proccess Form ("post" request) 
app.post('/ideas', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }

  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  // If there are erros 
  if (errors.length > 0) {
    // Rerender the "Add idea" form page & pass in the errors
    res.render('ideas/add', {
      errors: errors,              //The errors texts
      title: req.body.title,      //The user input "title" text
      details: req.body.details   //The user input "details" text
    });
  } else {
    // Save input data to the database  
    // Preparing saving by store input data into a variable 
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    // Pass the variable into a new collection-table 
    new Idea(newUser)
      // Save the input data into the collection-table 
      .save()
      // Redirect to the "ideas" page 
      .then(idea => {
        res.redirect('/ideas')
      })
  }
});

// Update Idea Proccess Edit Form ("put" request) 
app.put('/ideas/:id', (req, res) => {
  // Query the database via id parameter 
  Idea.findOne({
    _id: req.params.id
  })
    // Replace the data in database with the input data
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;

      // Save the database 
      idea.save()
        // Load 'ideas' page with new data
        .then(idea => {
          res.redirect('/ideas')
        })
    })
});



// Listen to certain port 
const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
