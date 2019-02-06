const router = require('./index');

const mysql = require('mysql');
require('dotenv').config();
const connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});

router.get('/stations', (req, res, next) => {
    const sql = `
        SELECT
            id,
            name,
            latitude,
            longitude
        FROM
            stations`;
        
    connection.query(sql, (err, rows) => {
        const json = {station : rows};
        res.header('Content-Type', 'application/json; charset=UTF-8');
        res.json(json);
    });
});

module.exports = router;