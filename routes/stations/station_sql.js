const sql = {
    '/' : {
        GET : `
            SELECT id,name,latitude,longitude
            FROM stations`
    },
    '/:station_id' : {
        GET : `
            SELECT id,name,latitude,longitude
            FROM stations
            WHERE id = ?`
    }
}

module.exports = sql;