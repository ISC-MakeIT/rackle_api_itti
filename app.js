const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
app.use('/api', indexRouter);

require('./routes/stations');
require('./routes/train_lines');
require('./routes/gates');
require('./routes/elevators');
require('./routes/guidelines');

// const stationsRouter = require('./routes/stations');
// app.use('/api/stations', stationsRouter);

// const trainLinesRouter = require('./routes/train_lines');
// app.use('/api/:station_id/train_lines', trainLinesRouter);

// const gatesRouter = require('./routes/gates');
// app.use('/api/:station_id/train_lines/:train_line_id/gates', gatesRouter);

// const guidelinesRouter = require('./routes/guidelines');
// app.use('/api:guidelines', guidelinesRouter);

// const elevatorsRouter = require('./routes/elevators');
// app.use('/api/stations/:station_id/elevators', elevatorsRouter);



// const stationsRouter = require('./routes/stations');
// app.use('/api/stations', stationsRouter);

// const guidelinesRouter = require('./routes/guidelines');
// app.use('/api/guidelines', guidelinesRouter);

// const elevatorsRouter = require('./routes/elevators');
// app.use('/api/elevators', elevatorsRouter);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
