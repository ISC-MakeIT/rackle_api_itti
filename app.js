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

/* ここから2月8日以降 /api/v2 */

// const StationRouterV2 = require('./routes/stations/stations.js');
// app.use('/api/v2/stations', StationRouterV2);

// const TrainLinesRouterV2 = require('./routes/train_lines/train_lines.js');
// app.use('/api/v2/train_lines', TrainLinesRouterV2);

// const GatesRouterV2 = require('./routes/gates/gates.js');
// app.use('/api/v2/gates', GatesRouterV2);

// const ElevatorsRouterV2 = require('./routes/elevators/elevators.js');
// app.use('/api/v2/elevators', ElevatorsRouterV2);

// const GuidelinesRouterV2 = require('./routes/guidelines/guidelines.js');
// app.use('/api/v2/guidelines', GuidelinesRouterV2);

/* ここまで */

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