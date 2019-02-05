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

const stationsRouter = require('./routes/stations');
app.use('/api/stations', stationsRouter);

const guidelinesRouter = require('./routes/guidelines');
app.use('/api/guidelines', guidelinesRouter);

const elevatorsRouter = require('./routes/elevators');
app.use('/api/elevators', elevatorsRouter);

const stationsV2Router = require('./routes/stationsV2');
app.use('/api/v2/stations', stationsV2Router);

const guidelinesV2Router = require('./routes/guidelines');
app.use('/api/v2/guidelines', guidelinesV2Router);

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
