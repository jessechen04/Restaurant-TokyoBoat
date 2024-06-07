const mysql = require('mysql2');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: './.env'});

const home = path.join(__dirname, '..', 'home.html');
const orderScreen = path.join(__dirname, '..', 'order-online.html');
const usernameScreen = path.join(__dirname, '..', 'sign-in-username.html');
const passwordScreen = path.join(__dirname, '..', 'sign-in-password.html');
const createAccountScreen = path.join(__dirname, '..', 'create-account.html');
const stylesPagesPath = path.join(__dirname, '..', 'styles', 'pages');
const stylesSharedPath = path.join(__dirname, '..', 'styles', 'shared');
const scriptsPath = path.join(__dirname, '..', 'scripts');
const dataPath = path.join(__dirname, '..', 'data');

// Use the constructed path with express.static
app.use('/styles/pages', express.static(stylesPagesPath));
app.use('/styles/shared', express.static(stylesSharedPath));
app.use('/scripts', express.static(scriptsPath));
app.use('/data', express.static(dataPath));

/*const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs-login',
    port: 3377
});*/

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: 3377
});

//app.set('view engine', 'hbs');

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('MYSQL Connected...');
    }
});

/*app.get('/', (req, res) => {
    res.send('<div>Home Page</div>');
});*/


app.get('/', (req, res) => {
    res.sendFile(home);
});

app.get('/sign-in-username', (req, res) => {
    res.sendFile(usernameScreen);
});

app.post('/', encoder, (req, res) => {
    var emailInput = req.body.email;
    var passwordInput = req.body.password;
    db.query('select * from users where email = ? and password = ?', [emailInput, passwordInput] , (error, results, fields) => {
        if (results.length > 0) {
            //console.log('hi');
            res.redirect('/sign-in-password');
        } else {
            res.redirect('/sign-in-username');
        }
        //res.end();
    });
});

app.get('/sign-in-password', (req, res) => {
    res.sendFile(passwordScreen);
});

app.get('/create-account', (req, res) => {
    res.sendFile(createAccountScreen);
});

app.get('/order-online', (req, res) => {
    res.sendFile(orderScreen);
});

app.get('/menu', (req, res) => {
    db.query('SELECT * FROM menuItems', (err, results, fields) => {
        if (err) {
            console.log(err);
        } else {
            res.json(results);
        }
    });
});



app.listen(5000, () => {
    console.log('Server started on port 5000.');
});