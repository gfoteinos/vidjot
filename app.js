
// Bring in istalled modules
const express = require('express');
const exphbs  = require('express-handlebars');
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

// // Load Idea model 
// require('./models/Idea');
// const Idea = mongoose.model('ideas');

// Handlebars Middleware 
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

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

// Listen to certain port 
  const port = 5000;

  app.listen(port, () => {
    console.log(`Server started on port ${port}`)
  });
