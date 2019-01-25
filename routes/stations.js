const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'rackle'
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
        const array = [];
        let products = {};
        for (let product of rows) {
            products = {
                id : product.id,
                name : product.name,
                latitude : product.latitude,
                longitude : product.longitude
            };
            array.push(products);
        };
        const json = {stations : array};
        res.header('Content-Type', 'application/json; charset=UTF-8');
        res.json(json);
    });
});

router.get('/train_lines', (req, res, next) => {
    const station_id = req.query.station_id;
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
    connection.query(sql, [station_id, station_id], (err, rows) => {
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
    const station_id = req.query.station_id;
    const train_line_id = req.query.train_line_id;
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
    connection.query(sql, [station_id, train_line_id], (err, rows) => {
        const array = [];
        let products = {};
        const train_line = {
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
            train_line : train_line,
            gates : array
        };
        res.header('Content-Type', 'application/json; charset=UTF-8');
        res.json(json);
    });
});

module.exports = router;