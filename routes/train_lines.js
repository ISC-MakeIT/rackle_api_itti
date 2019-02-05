// const express = require('express');
// const router = express.Router();

const router = require('./index');

const mysql = require('mysql');
require('dotenv').config();
const connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});

router.get('/stations/:station_id/train_lines', (req, res, next) => {
    const stationId = req.params.station_id;
    const sql = `
        SELECT
            stations.id AS sid,
            stations.name AS sname,
            train_lines.id,
            train_lines.name
        FROM
            stations,
            train_lines
        WHERE
            stations.id = ? AND
            train_lines.station_id = ?`;
    connection.query(sql, [stationId, stationId], (err, rows) => {
        const array = [];
        let products = {};
        const station = {
            id : rows[0].sid,
            name : rows[0].sname
        };
        for (let product of rows) {
            products = {
                id : product.id,
                name : product.name,
                latitude : product.latitude,
                longitude : product.longitude
            };
            array.push(products);
        };
        const json = {
            station : station,
            train_lines : array
        };
        res.header('Content-Type', 'application/json; charset=UTF-8');
        res.json(json);
    });
});

module.exports = router;