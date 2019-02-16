const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const mysqlp = require('promise-mysql');
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
const session = require('express-session');
const bodyParser = require('body-parser');
const moment = require('moment');
moment.locale('it');
const fs = require('fs');
const fsPromise = fs.promises;
const PdfPrinter = require('pdfmake');
const credentials = require('./credentials.js');
const mysqlCredentials = require('./mysql_credentials.js');

const students = require('./routes/students.js');
const admin = require('./routes/admin.js');

app.disable('x-powered-by');
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: credentials.cookieSecret
}));

app.use('/', students);
app.use('/gestore', admin);

// ERRORS HANDLING
app.use((req, res) => {
    res.type('text/html');
    res.status('404');
    res.render('error',  {
        loginPage: true, // Per centrare il contenuto della pagina
        code: 404,
        message: 'La pagina che stai cercando non è stata trovata all\'interno del server.'
    });
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status('500');
    res.render('error',  {
        loginPage: true, // Per centrare il contenuto della pagina
        code: 500,
        message: 'Il server ha riscontrato un problema. Contatta il Tronweb per maggiori informazioni.'
    });
});



app.listen(app.get('port'), () => {
    console.log('Application started on http://localhost:' + app.get('port') + ', press CTRL-C to terminate.');
});
