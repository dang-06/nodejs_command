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
var dataQ = "select * from log_13200_a1t order by id desc limit 50;";
var fileQ = "log_13200_a1t";

var culumname = "servertime"
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
}
Mainfuntion = () => {

}

// const Pool = require('pg').Pool
/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log('result0000');
  var today = new Date();
  var datetime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var datatime1 = 'value=' + datetime;
  res.render('Rawdata/logdata_A1T', { title: 'Express', timenow: datatime1 });



});

router.post("/add", function (req, res, next) {
  // console.log("req.body.data2.2")
  // console.log('req.body.imei')
  // console.log('req.body.imei', req.body.)

  var today = new Date();
  var datetime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var datatime1 = 'value=' + datetime;
  setimei = req.body.imei;
  setlimit = req.body.limit;
  setdate = req.body.cals;
  sdate_yy = req.body.cals.split("-", 1);
  sdate_mm = req.body.cals.split("-", 2);
  sdate_dd = req.body.cals.split("-", 3);
  setdate1 = str2char(sdate_yy[0]) + str2char(sdate_mm[1]) + str2char(sdate_dd[2]);
  console.log(setimei)
  console.log(setlimit)
  // WHERE imei ='867648041605898'
  dataQ = 'select * from ' + fileQ + ' ' + "WHERE imei ='" + setimei + "'" + "and " + culumname + " < " + "'" + setdate1 + datafilter2 + "'" + ' order by id desc limit ' + setlimit + ';';
  console.log("sasi", dataQ)
  // Mainfuntion();
  const pool = new Pool({
    user: 'webadmin',
    host: 'node51239-env-1793441.th1.proen.cloud',
    database: 'postgres',
    password: 'EOLrie65637',
    port: 11433,
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


    // res.render('Rawdata/logdata1');
    // console.log(state)

    state.imei = setimei;
    state.date = setdate;
    state.limit = setlimit;

    controldata1 = 'value=' + state.imei;
    controldatadate = 'value=' + state.date;
    controldatalimit = 'value=' + state.limit;
    controldatalimit2 = state.limit;
    // console.log(state.date)

    res.render('Rawdata/logdata_A1T_1', { title: 'User List', userData: dataX1, valueimei: controldata1, valuedate: controldatadate, valuelimit: controldatalimit, valuelimit2: controldatalimit2 });

  })


});




module.exports = router;

