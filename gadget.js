const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(express.static('public'));

app.get('/getProducts', (req, res) => {

    let db = new sqlite3.Database('products.db', sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

    
        let sql = `SELECT Image image, Name name, Price price FROM Products`;


        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
                return;
            }

 
            res.json(rows);
        });


        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    });
});

app.get('/product/:productId', (req, res) => {
    let productId = req.params.productId;


    let db = new sqlite3.Database('products.db', sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

   
        let sql = `SELECT Image image, Name name, Price price, Description description FROM Products WHERE id = ?`;

      
        db.get(sql, [productId], (err, row) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
                return;
            }
            if (row) {
       
                let html = fs.readFileSync(__dirname + '/public/products.html', 'utf8');
           
                html = html.replace('{{productTitle}}', row.name);
                html = html.replace('{{productPrice}}', row.price)
                html = html.replace('{{productImage}}', row.image);
                html = html.replace('{{productDescription}}', row.description);
                res.send(html);
            } else {
                res.status(404).send('Product not found.');
            }
        });


        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    });
});
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/cart', (req, res) => {
    let productId = req.body.productId;


    let db = new sqlite3.Database('products.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }


        let sql = `SELECT * FROM Products WHERE id = ?`;


        db.get(sql, [productId], (err, row) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (row) {

                sql = `INSERT INTO cart (productId, name, price, image) VALUES (?, ?, ?, ?)`;


                db.run(sql, [row.id, row.name, row.price, row.image], (err) => {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    res.send('Product added to cart...');
                });
            } else {
                res.status(404).send('Product added to cart..');
            }
        });

        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    });
});

app.get('/getCartItems', (req, res) => {

    let db = new sqlite3.Database('products.db', sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        let sql = `SELECT * FROM cart`;


        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
                return;
            }


            res.json(rows);
        });

        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    });
});
app.get('/order/:productId', (req, res) => {
    let productId = req.params.productId;

    let db = new sqlite3.Database('products.db', sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        let sql = `SELECT Image image, Name name, Price price, Description description FROM Products WHERE id = ?`;

        db.get(sql, [productId], (err, row) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
                return;
            }
            if (row) {
                let html = fs.readFileSync(__dirname + '/public/order.html', 'utf8');
                html = html.replace('{{productTitle}}', row.name);
                html = html.replace('{{productPrice}}', row.price)
                html = html.replace('{{productImage}}', row.image);
                html = html.replace('{{productDescription}}', row.description);
                res.send(html);
            } else {
                res.status(404).send('Product not found.');
            }
        });

        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    });
});
app.post('/placeOrder', (req, res) => {
    let name = req.body.name;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let productId = req.body.productId;

 
    let db = new sqlite3.Database('orders.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

  
        let sql = `INSERT INTO Orders (name, address, city, state, zip, productId) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [name, address, city, state, zip, productId], (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
                return;
            }

         

            res.send('Order placed successfully!');
        });


        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    });
});
app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});