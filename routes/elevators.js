const express = require('express');
const router = express.Router();

const mysql = require('mysql');
require('dotenv').config();
const connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    database : process.env.DB_DATABASE
});

router.get('/', (req, res, next) => {
    const stationId = req.query.station_id;
    const sql = `
        SELECT
            id,
            name,
            size,
            useable,
            latitude,
            longitude,
            floor
        FROM
            elevators
        WHERE
            station_id = ?`;

    connection.query(sql, [stationId], (err, rows) => {
        const json = {elevators : rows};
        res.header('Content-Type', 'application/json; charset=UTF-8');
        res.json(json);
    });
});

module.exports = router;