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

router.get('/train_lines', (req, res, next) => {
    const stationId = req.query.station_id;
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

router.get('/train_lines/gates', (req, res, next) => {
    const stationId = req.query.station_id;
    const trainLineId = req.query.train_line_id;
    const sql = `
        SELECT
            train_lines.id AS tid,
            train_lines.name AS tname,
            gates.id,
            gates.name,
            gates.latitude,
            gates.longitude,
            gates.floor
        FROM
            train_lines
        INNER JOIN
            gates
        ON
            train_lines.id = gates.train_line_id
        WHERE
            train_lines.station_id = ? AND
            gates.train_line_id = ?`;
    connection.query(sql, [stationId, trainLineId], (err, rows) => {
        const array = [];
        let products = {};
        const trainLine = {
            id : rows[0].tid,
            name : rows[0].tname
        };
        for (let product of rows) {
            products = {
                id : product.id,
                name : product.name,
                latitude : product.latitude,
                longitude : product.longitude,
                floor : product.floor
            };
            array.push(products);
        };
        const json = {
            train_line : trainLine,
            gates : array
        };
        res.header('Content-Type', 'application/json; charset=UTF-8');
        res.json(json);
    });
});

module.exports = router;