const express = require('express');
const router = express.Router();

const connection = require('../../connection');
const sql = require('./station_sql');

router.get('/', (req, res, next) => {
    connection.query(sql['/'].GET, (err, rows) => {
        let stations = [];
        for (let stationData of rows) {
            let station = {};
            station = {
                id : stationData.id,
                name : stationData.name,
                latitude : stationData.latitude,
                longitude : stationData.longitude
            }
            stations.push(station);
        }
        const json = {stations : stations};
        res.header('Content-Type', 'application/json; charset=UTF-8');
        res.json(json);
    });
});

router.get('/:stationId', (req, res, next) => {
    const stationId = req.params.stationId;
    connection.query(sql['/:staion_id'].GET, [stationId], (err, rows) => {
        let stations = [];
        for (let stationData of rows) {
            let station = {};
            station = {
                id : stationData.id,
                name : stationData.name,
                latitude : stationData.latitude,
                longitude : stationData.longitude
            }
            stations.push(station);
        }
        const json = {station : stations};
        res.header('Content-Type', 'application/json; charset=UTF-8');
        res.json(json);
    });
});

module.exports = router;