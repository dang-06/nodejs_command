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
var dataQ = "select * from log_13400_t530 order by id desc limit 50;";
var fileQ = "log_13400_t530";

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
  res.render('Rawdata/logdata_T530B', { title: 'Express', timenow: datatime1 });



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
  //ls-f8e0b8f7b568e4d6eefc2fab97b6d22b2cd292b5.cgocckwagg5a.ap-southeast-1.rds.amazonaws.com
  // const connectionString = 'postgres://aek54321:$aek54321$@ls-f8e0b8f7b568e4d6eefc2fab97b6d22b2cd292b5.cgocckwagg5a.ap-southeast-1.rds.amazonaws.com:5432/dbmydata';
  // const client = new postgres.Client({ connectionString });
  // const client = new Client({
     
  //   host: 'ls-f8e0b8f7b568e4d6eefc2fab97b6d22b2cd292b5.cgocckwagg5a.ap-southeast-1.rds.amazonaws.com',
  //   user: 'aek54321',   
  //   password: '$aek54321$',

  //   database: 'test2',
  //   port: 5432,
  //   // dialectOptions: {
  //   //   ssl: {
  //   //     require: true, // This will help you. But you will see nwe error
  //   //     rejectUnauthorized: false // This line will fix new error
  //   //   }
  //   // }
  // })
  const pool = new Pool({
    user: 'webadmin',
    host: 'node51239-env-1793441.th1.proen.cloud',
    database: 'postgres',
    password: 'EOLrie65637',
    port: 11433,
  })
  // client.query('SELECT NOW()', (err, res) => {
  //   if (err) {
  //     console.error('Error connecting to PostgreSQL:', err);
  //   } else {
  //     console.log('Connected to PostgreSQL at:', res.rows[0].now);
  //   }
  // });
  // client.query('SELECT * FROM log_13300_iris', (err, result) => {
  //   if (err) {
  //     console.error('Error executing query:', err);
  //   } else {
  //     console.log('Query Result:', result.rows);
  //   }
  // });
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

    res.render('Rawdata/logdata_T530B_1', { title: 'User List', userData: dataX1, valueimei: controldata1, valuedate: controldatadate, valuelimit: controldatalimit, valuelimit2: controldatalimit2 });

  })


});




module.exports = router;

