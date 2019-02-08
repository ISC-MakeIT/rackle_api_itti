const router = require('./index');

const mysql = require('mysql');
require('dotenv').config();
const connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});


router.get('/guidelines', (req, res, next) => {
    const startGateId = req.query.start_gate_id;
    const endGateId = req.query.end_gate_id;

    const getStartGate = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                gates.id,
                train_lines.name AS tname,
                gates.name,
                gates.latitude,
                gates.longitude,
                gates.floor
            FROM
                gates
            INNER JOIN
                train_lines
            ON
                gates.train_line_id = train_lines.id
            WHERE
                gates.id = ?`
        connection.query(sql, [startGateId], (err, rows) => {
            resolve(rows);
        });
    });

    const getEndGate = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                gates.id,
                train_lines.name AS tname,
                gates.name,
                gates.latitude,
                gates.longitude,
                gates.floor
            FROM
                gates
            INNER JOIN
                train_lines
            ON
                gates.train_line_id = train_lines.id
            WHERE
                gates.id = ?`
        connection.query(sql, [endGateId], (err, rows) => {
            resolve(rows);
        });
    });

    const getGuidelinse = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                guidelines.id,
                guidelines.name,
                location_points.latitude,
                location_points.longitude,
                location_points.floor
            FROM (
                guidelines
            INNER JOIN
                guidelines_x_location_points
            ON
                guidelines.id = guidelines_x_location_points.guideline_id)
            INNER JOIN
	            location_points
            ON
                guidelines_x_location_points.location_point_id = location_points.id
            WHERE
                guidelines.start_gate_id = ? AND
                guidelines.end_gate_id = ?
            ORDER BY
                guidelines_x_location_points.sort`

        connection.query(sql, [startGateId, endGateId], (err, rows) => {
            const array = [];
            let products = {};
            for (let product of rows) {
                products = {
                    latitude : product.latitude,
                    longitude : product.longitude,
                    floor : product.floor
                };
                array.push(products);
            };
            const json = {
                id : rows[0].id,
                name : rows[0].name,
                location_points : array
            };
            resolve(json);
            // resolve(rows);
        });
    });

    const getObjectPoints = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                object_points.id,
                object_points.name,
                object_points.file_path,
                object_points.thumbnail_path,
                object_points.type,
                object_points.caption,
                object_points.latitude,
                object_points.longitude,
                object_points.floor
            FROM (
                guidelines
            INNER JOIN
                guidelines_x_object_points
            ON
                guidelines.id = guidelines_x_object_points.guideline_id)
            INNER JOIN
	            object_points
            ON
                guidelines_x_object_points.object_point_id = object_points.id
            WHERE
                guidelines.start_gate_id = ? AND
                guidelines.end_gate_id = ?
            ORDER BY
                guidelines_x_object_points.sort`

        connection.query(sql, [startGateId, endGateId], (err, rows) => {
            resolve(rows);
        });
    });

    const getToilets = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                id,
                name,
                latitude,
                longitude,
                floor
            FROM
                toilets`

        connection.query(sql, (err, rows) => {
            resolve(rows);
        });
    });

    Promise.all([getStartGate, getEndGate, getGuidelinse, getObjectPoints, getToilets]).then((values) => {
        let startGate, endGate = {};
        let guideline, objectPoints, toilets = [];

        startGate = values[0][0];
        endGate = values[1][0];
        guideline = values[2];
        objectPoints = values[3];
        toilets = values[4];

        const json = {
            start_gate : startGate,
            end_gate : endGate,
            guidelines : guideline,
            object_points : objectPoints,
            toilets : toilets
        };
        res.header('Content-Type', 'application/json; charset=UTF-8');
        res.json(json);
    });
});

module.exports = router;