"use strict";
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('express-handlebars').create({ extname: 'hbs', defaultLayout: 'main' });
const session = require('express-session');

const credentials = require('./config/credentials.js');

// SETTINGS
app.use(require('helmet')());
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('port', process.env.PORT || 3000);
app.use(require('body-parser').urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: credentials.cookieSecret
}));

// ROUTES
app.use('/gestore', require('./routes/admin.js'));
app.use('/', require('./routes/students.js'));

// SERVER
app.listen(app.get('port'), () => {
    console.log('Application started on http://localhost:' + app.get('port') + ', press CTRL-C to terminate.');
});
