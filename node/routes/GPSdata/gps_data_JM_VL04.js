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

var dataQ = "select * from log_decode_jm_vl04 order by id desc limit 50;";

var fileQ = "log_decode_jm_vl04";


var state = {
  imei: "",
  date: "",
  limit: ""
};

Mainfuntion = () => {

}

// const Pool = require('pg').Pool
/* GET users listing. */
router.get('/', function (req, res, next) {
  var today = new Date();
  var datetime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var datatime1 = 'value=' + datetime;
  console.log('result0000');

  res.render('GPSdata/gps_data_JM_VL04', { title: 'Express', timenow: datatime1 });



});

router.post("/add", function (req, res, next) {
  // console.log("req.body.data2.2")
  // console.log('req.body.imei')
  // console.log('req.body.imei', req.body.)


  setimei = req.body.imei;
  setlimit = req.body.limit;
  setdate = req.body.cals;
  console.log(setimei)
  console.log(setlimit)
  dataQ = 'select * from ' + fileQ + ' ' + "WHERE imei ='" + setimei + "'" + ' order by id desc limit ' + setlimit + ';';
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
    res.render('GPSdata/gps_data_JM_VL04_1', { title: 'User List', userData: dataX1, valueimei: controldata1, valuedate: controldatadate, valuelimit: controldatalimit, valuelimit2: controldatalimit2 });

  })


});




module.exports = router;

