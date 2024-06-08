const express = require('express');
const path = require('path'); // Include the path module
const app = express();
const { register } = require('module');
const port = 5000;
const userRoutes = require('./routes/crs');
const consolidate = require('consolidate')
const bodyParser = require('body-parser');
const session = require('express-session')
const {con} = require("./controllers/register")
const cookieParser = require("cookie-parser");
require('dotenv').config();


app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy

app.use(session({
  key: process.env.SESSION_COOKIE,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000 // 1 hour
  }
}));

app.use(express.static('public'));
app.use('/images', express.static("Images"))
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine('html', consolidate.swig)
app.set('views', path.join(__dirname, '/src'));
app.set('view engine', 'html');

// Serve the index page for all other requests
app.get("/", (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
});

app.use('/', userRoutes)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});




module.exports = session;