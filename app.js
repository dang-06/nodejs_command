var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
const cors = require('cors');

var indexRouter = require('./routes/index');


var hino_send_command_Router = require('./routes/Sendcommand/hino_send_command');

var DT800_send_command_Router = require('./routes/Sendcommand/DT800_send_command');



var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


app.use('/hino_send_command', hino_send_command_Router)
app.use('/DT800_send_command', DT800_send_command_Router)




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


const port = 6800;
app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});


module.exports = app;
