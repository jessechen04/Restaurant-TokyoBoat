// setup and import code
const mysql = require('mysql2');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();

const dotenv = require('dotenv');
const path = require('path');

const bcrypt = require('bcryptjs');

dotenv.config({path: './.env'});

// file paths used
const home = path.join(__dirname, '..', 'home.html');
const orderScreen = path.join(__dirname, '..', 'order-online.html');
const cartScreen = path.join(__dirname, '..', 'cart.html');
const usernameScreen = path.join(__dirname, '..', 'sign-in.html');
const createAccountScreen = path.join(__dirname, '..', 'create-account.html');
const stylesPagesPath = path.join(__dirname, '..', 'styles', 'pages');
const stylesSharedPath = path.join(__dirname, '..', 'styles', 'shared');
const scriptsPath = path.join(__dirname, '..', 'scripts');
const dataPath = path.join(__dirname, '..', 'data');
const imagesPath = path.join(__dirname, "..", 'images');

// grants permission to use certain folders
app.use('/styles/pages', express.static(stylesPagesPath));
app.use('/styles/shared', express.static(stylesSharedPath));
app.use('/scripts', express.static(scriptsPath));
app.use('/data', express.static(dataPath));
app.use('/images', express.static(imagesPath));


// creates connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs-login',
    port: 3377
});

/*const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: 3377
});*/

//app.set('view engine', 'hbs');

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('MYSQL Connected...');
    }
});

// pulls up the screens
app.get('/', (req, res) => {
    res.sendFile(home);
});

app.get('/sign-in', (req, res) => {
    res.sendFile(usernameScreen);
});

// login system, checks if email and password matches database
app.post('/', encoder, (req, res) => {
    var emailInput = req.body.email;
    var passwordInput = req.body.password;
    db.query('select * from users where email = ? and password = ?', [emailInput, passwordInput] , (error, results, fields) => {
        if (results.length > 0) {
            //console.log('hi');
            res.redirect('/order-online');
        } else {
            res.redirect('/sign-in');
        }
        //res.end();
    });
});

// pulls up the screens

app.get('/create-account', (req, res) => {
    res.sendFile(createAccountScreen);
});

app.post('/register', encoder, (req, res) => {
    const name = req.body.firstName + ' ' + req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    //console.log(name + email + password + passwordConfirm);

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.redirect('/create-account');
        } else if (password !== passwordConfirm) {
            return res.redirect('/create-account');
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/order-online');
            }
        });
    });

    //res.send("Form Submitted");
});

app.get('/order-online', (req, res) => {
    res.sendFile(orderScreen);
});

// pulls the database data
let categoriesArr;

new Promise((resolve) => {
    app.get('/menuCategories', (req, res) => {
        db.query('SELECT * FROM menucategories', (err, results, fields) => {
            if (err) {
                console.log(err);
            } else {
                categoriesArr = results;
                //console.log(categoriesArr);
                res.json(results);
                resolve();
            }
        });
    });
}).then(() => {
    categoriesArr.forEach(element => {
        app.get(`/menu/${element.id}`, (req, res) => {
            db.query(`SELECT * FROM menuItems WHERE itemCategory = \"${element.category}\"`, (err, results, fields) => {
                if (err) {
                    console.log(err);
                } else {
    
                    res.json(results);
                }
            });
        });
    });
});

app.get('/cart', (req, res) => {
    res.sendFile(cartScreen);
});

// sets the port for code to run
app.listen(5000, () => {
    console.log('Server started on port 5000.');
});