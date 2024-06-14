require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');

// npm install connect-flash
const flash = require('connect-flash');

const session = require('express-session');

const mongoose = require('mongoose')

const app = express();
const port = process.env.PORT || 4000;

// Connect to Database  
const dbConnection= async ()=>{ await mongoose.connect("mongodb://localhost:27017/UserDataManagement")
  .then(() => {
    console.log("DataBase Connected");
  })
  .catch((e) => {
    console.log(e);
    console.log("DataBase Con't Connected");
  });}

dbConnection();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// Static Files
app.use(express.static('public'));

// Express Session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  })
);

// Flash Messages
app.use(flash({ sessionKeyName: 'flashMessage' }));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/customer'))

// Handle 404
app.get('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(port, ()=> {
  console.log(`App listeing on port ${port}`)
});
