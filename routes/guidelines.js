const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'rackle'
});


router.get('/:start_gate_id/:end_gate_id', (req, res, next) => {
    const start_gate_id = req.params.start_gate_id;
    const end_gate_id = req.params.end_gate_id;

    const get_start_gate = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                id,
                name,
                latitude,
                longitude,
                floor
            FROM
                gates
            WHERE
                id = ?`
        connection.query(sql, [start_gate_id], (err, rows) => {
            resolve(rows);
        });
    });

    const get_end_gate = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                id,
                name,
                latitude,
                longitude,
                floor
            FROM
                gates
            WHERE
                id = ?`
        connection.query(sql, [end_gate_id], (err, rows) => {
            resolve(rows);
        });
    });

    const get_guidelinse = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                location_points.latitude,
                location_points.longitude,
                location_points.floor
            FROM (
                guidelines
            INNER JOIN
                guidelines_location_points
            ON
                guidelines.id = guidelines_location_points.guideline_id)
            INNER JOIN
	            location_points
            ON
                guidelines_location_points.location_point_id = location_points.id
            WHERE
                guidelines.start_gate_id = ? AND
                guidelines.end_gate_id = ?
            ORDER BY
                guidelines_location_points.sort;`

        connection.query(sql, [start_gate_id, end_gate_id], (err, rows) => {
            resolve(rows);
        });
    });

    const get_toilets = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                id,
                latitude,
                longitude,
                floor
            FROM
                toilets`

        connection.query(sql, (err, rows) => {
            resolve(rows);
        });
    });

    const get_elevator = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                id,
                size,
                latitude,
                longitude,
                floor
            FROM
                elevators`

        connection.query(sql, (err, rows) => {
            resolve(rows);
        });
    });

    Promise.all([get_start_gate, get_end_gate, get_guidelinse, get_toilets, get_elevator]).then((values) => {
        let start_gate, end_gate = {};
        let guidelines, toilets, elevators = [];

        start_gate = values[0][0];
        end_gate = values[1][0];
        guidelines = values[2];
        toilets = values[3];
        elevators = values[4];

        const json = {
            start_gate : start_gate,
            end_gate : end_gate,
            guidelines : guidelines,
            toilets : toilets,
            elevators : elevators
        };
        res.header('Content-Type', 'application/json; charset=UTF-8');
        res.json(json);
    });
});

module.exports = router;