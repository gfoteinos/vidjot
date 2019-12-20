// Bring in installed modules 
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load Idea model 
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Load "ideas" page ("GET" request) with data from database 
router.get('/', (req, res) => {
  // Fetch data from database (collection "Idea")
  Idea.find({})
    // Sort them in descent order 
    .sort({ date: 'desc' })
    // Load the "/ideas" page rendering the "/ideas/index.handlebars" file & passing the data (collection "Ideas")
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Load "add idea" form page ("GET" request) 
router.get('/add', (req, res) => {
  // Load the "/ideas/add" page rendering the "ideas/add.handlebars" file 
  res.render('ideas/add');
});

// Load "edit idea" form page ("GET" request) 
router.get('/edit/:id', (req, res) => {
  // Fetch data from database (single document - row) via id
  Idea.findOne({
    _id: req.params.id
  })
    // Load the "/ideas/edit/:id" page rendering the "ideas/edit.handlebars" file & passing the data from database 
    .then(idea => {
      res.render('ideas/edit', {
        idea: idea
      });
    });
});

// Submit "add ideas" form page ("post" request) - Add idea
router.post('/', (req, res) => {
  // Error handling 
  let errors = [];

  // If there aren't "title" or "details"; fill in "errors"
  // table with the errors descriptions
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }

  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  // If there are erros 
  if (errors.length > 0) {
    // Load the "ideas/add" form page rendering 
    //"ideas/add.handlebars" file & pass in the errors
    res.render('ideas/add', {
      errors: errors,             //The errors texts
      title: req.body.title,      //The user input "title" text
      details: req.body.details   //The user input "details" text
    });
  } else {
    // Add input data to the database  
      // Preparing adding by store input data into a variable 
      const newUser = {
        title: req.body.title,
        details: req.body.details
      }
      // Pass the variable into a new collection-table 
      new Idea(newUser)
        // Save the input data into the collection-table 
        .save()
        // Redirect to the "/ideas" page 
        .then(idea => {
          req.flash('success_msg', 'Video idea added');
          res.redirect('/ideas');
        })
  }
});

// Submit "edit idea" form page ("put" request) - Update idea
router.put('/:id', (req, res) => {
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
        // Redirect to the 'ideas' page & passing the data from
        // database (return "idea" document)
        .then(idea => { //**is it nesecery to return the idea?**
          req.flash('success_msg', 'Video idea updated');
          res.redirect('/ideas');
        })
    })
});

// Submit "delete idea" form page ("delete" request) - Delete idea
router.delete('/:id', (req, res) => {
  // Delete data from database via id 
  Idea.remove({
    _id: req.params.id
  })
    // Redirect to "idea" page 
    .then(() => {
      req.flash('success_msg', 'Video idea removed');
      res.redirect('/ideas');
    })
});

module.exports = router;