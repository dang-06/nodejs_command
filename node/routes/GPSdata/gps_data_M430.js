var express = require('express');
var router = express.Router();
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

const { Pool, Client } = require('pg')
// var await1 = require('await')
var setimei = "";
var setlimit = "";
var setdate = "order by id desc";

var dataX1 = "";

var dataQ = "select * from log_decode_11100_m430 order by id desc limit 50;";

var fileQ = "log_decode_11100_m430";

var culumname = "server_stamp_time"
var datafilter2 = "155959"

var state = {
  imei: "",
  date: "",
  limit: ""
};

function str2char(str) {
  if (str.length == 1) {
    return '0' + str;
  } else {
    return str

  }

  var hexStr = '';
  for (var i = 0; i < uint8arr.length; i++) {
    var hex = (uint8arr[i] & 0xff).toString(16);
    hex = (hex.length === 1) ? '0' + hex : hex;
    hexStr += hex;
  }

  return hexStr.toUpperCase();
}

// const Pool = require('pg').Pool
/* GET users listing. */
router.get('/', function (req, res, next) {
  var today = new Date();
  var datetime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var datatime1 = 'value=' + datetime;
  console.log('result0000');

  res.render('GPSdata/gps_data_M430', { title: 'Express', timenow: datatime1 });



});

router.post("/add", function (req, res, next) {
  // console.log("req.body.data2.2")
  // console.log('req.body.imei')



  setimei = req.body.imei;
  setlimit = req.body.limit;
  setdate = req.body.cals;
  sdate_yy = req.body.cals.split("-", 1);
  sdate_mm = req.body.cals.split("-", 2);
  sdate_dd = req.body.cals.split("-", 3);
  setdate1 = str2char(sdate_yy[0]) + str2char(sdate_mm[1]) + str2char(sdate_dd[2]);
  // setdate = req.body.cals.replace("-", "");
  // setdate = setdate.replace("-", "");
  console.log(setimei)
  console.log(setdate1)


  dataQ = 'select * from ' + fileQ + ' ' + "WHERE imei ='" + setimei + "'" + "and " + culumname + " < " + "'" + setdate1 + datafilter2 + "'" + ' order by id desc limit ' + setlimit + ';';
  console.log(dataQ)

  // Mainfuntion();
  const pool = new Pool({
    user: 'aek54321',
    host: 'ls-3311cb3dd205bf5e24b1afeab0b9a22ec42495db.cukr0ikuloyp.ap-southeast-1.rds.amazonaws.com',
    database: 'dbmydata',
    password: 'aek54321',
    port: 5432,
  })
  pool.connect((err, Client, release, result) => {
    // console.log('kuyyyyyyyyyyy')
    if (err) {
      return console.error('erroor acquiring client', err.stack)
    } else {
      console.log('connected')

      Client.query(dataQ, (err, result) => {
        release()
        if (err) {
          return console.error('erroor acquiring query', err.stack)
        }
        dataX1 = result.rows

      })


    }
    // console.log(dataX1)
    // res.render('GPSdata/logdata1');
    // console.log(state)
    state.imei = setimei;
    state.date = setdate;
    state.limit = setlimit;

    controldata1 = 'value=' + state.imei;
    controldatadate = 'value=' + state.date;
    controldatalimit = 'value=' + state.limit;
    controldatalimit2 = state.limit;
    console.log('data', dataX1)
    res.render('GPSdata/gps_data_M430_1', { title: 'User List', userData: dataX1, valueimei: controldata1, valuedate: controldatadate, valuelimit: controldatalimit, valuelimit2: controldatalimit2 });

  })


});




module.exports = router;

