const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(bodyparser.json());

//database  connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simpledb',
    port: 3307
});

//check database connection
db.connect(err => {
    if (err) { console.log('dberr'); }
    console.log('Database connected.....');
})

//Get all data (Read all data)
app.get('/user', (req, res) => {

    // console.log('Get all users');
    const qrr = 'SELECT * FROM user';
    db.query(qrr, (err, results) => {
        if (err) {
            console.log(err, 'errs');
        }
        if (results.length > 0) {
            res.send({
                message: 'All users data',
                data: results
            });
        };
    });
});

//Get data by ID (Read data by ID)
app.get('/user/:id', (req, res) => {
    const qrId = req.params.id;
    const qr = `SELECT * FROM user WHERE id = ${qrId}`;
    db.query(qr, (err, results) => {
        if (err) {
            console.error("Error occured while getting data", err);
            return res.status(500).send("Error occurred while getting data");
        } else {
            if (results.length > 0) {
                res.send({
                    message: "Get data by ID",
                    data: results
                });
            } else {
                res.send({
                    message: "Data not found for the given ID"
                });
            }
        }
    });
});

//Post Data(Creating data)
app.post('/user', (req, res) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const mobile = req.body.mobile;

    if (!fullname || !email || !mobile) {
        return res.status(400).send("Missing required fields");
    }

    const qr = `INSERT INTO user (fullname, email, mobile) VALUES ('${fullname}', '${email}', '${mobile}')`;
    db.query(qr, (err, results) => {
        if (err) {
            console.error("Error occurred while inserting data:", err);
            return res.status(500).send("Error occurred while posting data");
        } else {
            if (results.affectedRows > 0) {
                return res.status(201).send({ message: 'Data Added Successfully', data: results });
            } else {
                return res.status(500).send("Failed to add data");
            }
        }
    });
});


// Put Data (Updating data)
app.put('/user/:id', (req, res) => {
    const uid = req.params.id;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const mobile = req.body.mobile;

    if (!fullname || !email || !mobile) {
        return res.status(400).send("Missing required fields");
    }

    const qr = `UPDATE user SET fullname = '${fullname}', email = '${email}', mobile = '${mobile}' WHERE id = ${uid}`;

    db.query(qr, (err, results) => {
        if (err) {
            console.error("Error occurred while updating data", err);
            return res.status(500).send("Error occurred while putting data");
        } else {
            if (results.affectedRows > 0) {
                return res.status(201).send({ message: 'Data Updated Successfully', data: results });
            } else {
                return res.status(404).send("User not found or data unchanged");
            }
        }
    });
});

// Delete Data
app.delete('/user/:id', (req, res) => {
    const uid = req.params.id;

    if (!uid) {
        return res.status(400).send("Missing user ID");
    }

    const qr = `DELETE FROM user WHERE id = ${uid}`;

    db.query(qr, (err, results) => {
        if (err) {
            console.log("Error occurred while deleting data", err);
            return res.status(500).send("Error occurred while deleting data");
        } else {
            if (results.affectedRows > 0) {
                return res.status(200).send({ message: 'Data Deleted Successfully' });
            } else {
                return res.status(404).send("User not found");
            }
        }
    });
});

app.listen(3000, () => {
    console.log('server running.......');
})
