const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const router         = require('./config/routes');
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const morgan         = require('morgan');
const mongoose       = require('mongoose');
mongoose.Promise     = require('bluebird');
const session        = require('express-session');
const app              = express();
const flash            = require('express-flash');
const authenticate = require('./lib/authenticateUser');
const customResponses = require('./lib/customResponses');


const { port, dbURI, secret } = require('./config/environment');

mongoose.connect(dbURI);

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(morgan('dev'));
app.use(expressLayouts);
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret,
  resave: false,
  saveUninitialized: false
}));

app.use(methodOverride(function (req) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(flash());

app.use(authenticate);
app.use(customResponses);
app.use(router);


app.listen(port, () => console.log(`Express is listening on port ${port}`));
