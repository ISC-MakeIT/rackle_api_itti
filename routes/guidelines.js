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


router.get('/guidelines', (req, res, next) => {
    const startGateId = req.query.start_gate_id;
    const endGateId = req.query.end_gate_id;

    const getStartGate = new Promise((resolve, reject) => {
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
        connection.query(sql, [startGateId], (err, rows) => {
            resolve(rows);
        });
    });

    const getEndGate = new Promise((resolve, reject) => {
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
        connection.query(sql, [endGateId], (err, rows) => {
            resolve(rows);
        });
    });

    const getGuidelinse = new Promise((resolve, reject) => {
        const sql = `
            SELECT
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
            resolve(rows);
        });
    });

    const getMovies = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                movies.id,
                movies.name,
                movies.file_path,
                movies.thumbnail_path,
                movies.latitude,
                movies.longitude,
                movies.floor
            FROM (
                guidelines
            INNER JOIN
                guidelines_x_movies
            ON
                guidelines.id = guidelines_x_movies.guideline_id)
            INNER JOIN
	            movies
            ON
                guidelines_x_movies.movie_id = movies.id
            WHERE
                guidelines.start_gate_id = ? AND
                guidelines.end_gate_id = ?
            ORDER BY
                guidelines_x_movies.sort`

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

    const getElevator = new Promise((resolve, reject) => {
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
                elevators`

        connection.query(sql, (err, rows) => {
            resolve(rows);
        });
    });

    const getMoviePoints = new Promise((resolve, reject) => {
        const sql = `
            SELECT
                movies.id,
                movies.latitude,
                movies.longitude,
                movies.floor
            FROM (
                guidelines
            INNER JOIN
                guidelines_x_movies
            ON
                guidelines.id = guidelines_x_movies.guideline_id)
            INNER JOIN
	            movies
            ON
                guidelines_x_movies.movie_id = movies.id
            WHERE
                guidelines.start_gate_id = ? AND
                guidelines.end_gate_id = ?
            ORDER BY
                guidelines_x_movies.sort`

        connection.query(sql, [startGateId, endGateId], (err, rows) => {
            resolve(rows);
        });
    });

    Promise.all([getStartGate, getEndGate, getGuidelinse, getMovies, getToilets, getElevator, getMoviePoints]).then((values) => {
        let startGate, endGate = {};
        let guidelines, movies, toilets, elevators, moviePoints = [];

        startGate = values[0][0];
        endGate = values[1][0];
        guidelines = values[2];
        movies = values[3];
        toilets = values[4];
        elevators = values[5];
        moviePoints = values[6];

        const json = {
            start_gate : startGate,
            end_gate : endGate,
            guidelines : guidelines,
            movies : movies,
            toilets : toilets,
            elevators : elevators,
            movie_points : moviePoints
        };
        res.header('Content-Type', 'application/json; charset=UTF-8');
        res.json(json);
    });
});

module.exports = router;