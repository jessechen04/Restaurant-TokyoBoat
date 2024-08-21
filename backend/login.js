// setup and import code
const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false
}));

const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();

const dotenv = require('dotenv');
const path = require('path');

const bcrypt = require('bcryptjs');
const { error } = require('console');

dotenv.config({path: './.env'});

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

// file paths used
const home = path.join(__dirname, '..', 'home.html');
const orderScreen = path.join(__dirname, '..', 'order-online.html');
const checkoutScreen = path.join(__dirname, '..', 'checkout.html');
const usernameScreen = path.join(__dirname, '..', 'sign-in.html');
const createAccountScreen = path.join(__dirname, '..', 'create-account.html');
const paymentSuccessScreen = path.join(__dirname, '..', 'payment-success.html');
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
    database: 'tokyo-boat',
    port: 3306
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
    if (req.session.authenticated) {
        res.sendFile(orderScreen);
    } else {
        res.sendFile(usernameScreen);
    }
});

// login system, checks if email and password matches database

app.post('/login', encoder, (req, res) => {
    //console.log(req.session);
    const emailInput = req.body.email;
    const passwordInput = req.body.password;

    db.query('select * from users where email = ?', [emailInput] , async (error, results, fields) => {
        if (error) {
            console.log(error);
        }
        
        if (results.length > 0) {
            const user = results[0];
            const hashedPassword = user.password;

            const passwordMatch = await bcrypt.compare(passwordInput, hashedPassword);
            
            if (passwordMatch) {
                req.session.authenticated = true;

                req.session.user = {
                    id: user.id,
                    email: user.email,
                    password: hashedPassword
                };
                
                app.get(`/user-info`, (req, res) => {
                    res.json(req.session.user);
                    //res.json(user); //doesnt work
                });

                res.redirect('/order-online');
                //console.log(results);
            } else {
                res.redirect('/sign-in');
            }
            
        } else {
            res.redirect('/sign-in');
        }
        //res.end();
    });
    
});

app.post('/signout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Error logging out' });
      }
      res.json({ message: 'Logged out successfully' });
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
    res.sendFile(checkoutScreen);
});

app.use(express.json()); // collects and parses frontend data to json

app.get('/getCart', (req, res) => {
    db.query(`SELECT * FROM shoppingcarts WHERE userId = ?`, [req.session.user.id], (err, results, fields) => {
        if (err) {
            console.log(err);
        } else {
            res.json(results);
        }
    });
});

app.post('/addToCart', (req, res) => {
    //console.log(req.body);
    const userId = req.body.userId;
    const itemId = req.body.itemId;
    const count = req.body.count;

    db.query('SELECT * FROM shoppingcarts WHERE userId = ? AND itemID = ?', [userId, itemId], (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            countTotal = count + results[0].count;
            db.query('UPDATE shoppingcarts SET count = ? WHERE userId = ? AND itemID = ?', [countTotal, userId, itemId], (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Successfully Added');
                }
            });
        } else {
            db.query('INSERT INTO shoppingcarts SET ?', {itemId: itemId, count: count, userId: userId}, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Successfully Added');
                }
            });
        }
    });

});

app.post('/removeFromCart', (req, res) => {
    const userId = req.body.userId;
    const itemId = req.body.itemId;

    //console.log(userId);
    //console.log(itemId);

    db.query('DELETE FROM shoppingcarts WHERE userId = ? AND itemId = ?', [userId, itemId], (error, results) => {
        if (error) {
            console.log(error);
        }   
    });
});

app.post('/editCart', (req, res) => {
    const userId = req.body.userId;
    const itemId = req.body.itemId;
    const count = req.body.count;

    db.query('UPDATE shoppingcarts SET count = ? WHERE userId = ? AND itemId = ?', [count, userId, itemId], (error, results) => {
        if (error) {
            console.log(error);
        }   

        if (results > 0) {
            console.log(results);
        }
    });
});

let menuItems = new Map();

db.query('SELECT * FROM menuitems', (error, results) => {
    results.forEach(item => {
        menuItems.set(item.id, item);
    });
    //console.log(menuItems);
});

app.post('/place-order', async (req, res) => {;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.cart.map(item => {
                const cartItem = menuItems.get(parseInt(item.itemId));
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: cartItem.itemName
                        },
                        unit_amount: cartItem.itemPriceCents
                    },
                    quantity: item.count,
                }
            }),
            success_url: `${process.env.SERVER_URL}/payment-success`,
            cancel_url: `${process.env.SERVER_URL}/cart`
        });
        res.json({ url: session.url });
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

app.get('/payment-success', (req, res) => {
    res.sendFile(paymentSuccessScreen);
});

// sets the port for code to run
app.listen(5000, () => {
    console.log('Server started on port 5000.');
});