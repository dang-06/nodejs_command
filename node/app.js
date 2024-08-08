var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var logdata1_Router = require('./routes/Rawdata/logdata1');
var logdata_AT6_Router = require('./routes/Rawdata/logdata_AT6');
var logdata_JM_VL04_Router = require('./routes/Rawdata/logdata_JM_VL04');
var logdata_JC400_Router = require('./routes/Rawdata/logdata_JC400');
var logdata_M430_Router = require('./routes/Rawdata/logdata_M430');
var logdata_DT800_Router = require('./routes/Rawdata/logdata_DT800');
var logdata_A1T_Router = require('./routes/Rawdata/logdata_A1T');
var logdata_richmor_Router = require('./routes/Rawdata/logdata_richmor');
var logdata_RV8_Router = require('./routes/Rawdata/logdata_RV8');
var logdata_IRIS_Router = require('./routes/Rawdata/logdata_IRIS');
var logdata_T530B_Router = require('./routes/Rawdata/logdata_T530B');

var gps_data_fmc640_Router = require('./routes/GPSdata/gps_data_FMC640');
var gps_data_AT6_Router = require('./routes/GPSdata/gps_data_AT6');
var gps_data_JM_VL04_Router = require('./routes/GPSdata/gps_data_JM_VL04');
var gps_data_M430_Router = require('./routes/GPSdata/gps_data_M430');
var gps_data_dt800_Router = require('./routes/GPSdata/gps_data_dt800');
var gps_data_a1t_Router = require('./routes/GPSdata/gps_data_a1t');
var gps_data_iris_Router = require('./routes/GPSdata/gps_data_iris');

var server_Router = require('./routes/server');
var user_Router = require('./routes/server');
var asap_send_command_Router = require('./routes/Sendcommand/asap_send_command');
var asap_send_command1_Router = require('./routes/Sendcommand/asap_send_command1');

var hino_send_command_Router = require('./routes/Sendcommand/hino_send_command');
var ptt_send_command_Router = require('./routes/Sendcommand/ptt_send_command');
var DT800_send_command_Router = require('./routes/Sendcommand/DT800_send_command');
var A1T_send_command_Router = require('./routes/Sendcommand/A1T_send_command');
var IRIS_send_command_Router = require('./routes/Sendcommand/IRIS_send_command');
var T530B_send_command_Router = require('./routes/Sendcommand/T530B_send_command');

var RS232_Port_Router = require('./routes/Tools/RS232_Port');

var SMS_true_22_Router = require('./routes/SMS/SMS_true_22');
var SMS_AIS_23_Router = require('./routes/SMS/SMS_AIS_23');
var SMS_AIS_24_Router = require('./routes/SMS/SMS_AIS_24');

var services_Router = require('./routes/services');

// var T500_decode_Router = require('./routes/T500_decode');
//var decode_T500_Router = require('./routes/Decode_T500');
var app = express();
const SERVER_PORT = 80;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/logdata1', logdata1_Router)
app.use('/logdata_AT6', logdata_AT6_Router)
app.use('/logdata_JM_VL04', logdata_JM_VL04_Router)
app.use('/logdata_JC400', logdata_JC400_Router)
app.use('/logdata_M430', logdata_M430_Router)
app.use('/logdata_DT800', logdata_DT800_Router)
app.use('/logdata_A1T', logdata_A1T_Router)
app.use('/logdata_richmor', logdata_richmor_Router)
app.use('/logdata_RV8', logdata_RV8_Router)
app.use('/logdata_IRIS', logdata_IRIS_Router)
app.use('/logdata_T530B', logdata_T530B_Router)

app.use('/loggps_data_FMC640', gps_data_fmc640_Router)
app.use('/loggps_data_AT6', gps_data_AT6_Router)
app.use('/loggps_data_JM_VL04', gps_data_JM_VL04_Router)
app.use('/loggps_data_M430', gps_data_M430_Router)
app.use('/loggps_data_dt800', gps_data_dt800_Router)
app.use('/loggps_data_a1t', gps_data_a1t_Router)
app.use('/loggps_data_iris', gps_data_iris_Router)

app.use('/server', server_Router)
app.use('/users', user_Router)
app.use('/asap_send_command', asap_send_command_Router)
app.use('/asap_send_command1', asap_send_command1_Router)

app.use('/hino_send_command', hino_send_command_Router)
app.use('/ptt_send_command', ptt_send_command_Router)
app.use('/DT800_send_command', DT800_send_command_Router)
app.use('/A1T_send_command', A1T_send_command_Router)
app.use('/IRIS_send_command', IRIS_send_command_Router)
app.use('/T530B_send_command', T530B_send_command_Router)

app.use('/RS232_Port', RS232_Port_Router)

app.use('/SMS_true_22', SMS_true_22_Router)
app.use('/SMS_AIS_23', SMS_AIS_23_Router)
app.use('/SMS_AIS_24', SMS_AIS_24_Router)

app.use('/services', services_Router)
// app.use('/T500_decode', T500_decode_Router);
// app.use('/Decode_T500', decode_T500_Router)



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const port = 80;
app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});

// const https = require('https');
// https.createServer
// app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
//   console.log(`Now listening on port ${port}`);
// });

// this wrapper is only for testing purpose
// if (!module.parent) {
  // staring the express server
//   app.listen(SERVER_PORT, function () {
//     console.log("Server is listening at port :  ", SERVER_PORT);
//   });
// }
module.exports = app;
