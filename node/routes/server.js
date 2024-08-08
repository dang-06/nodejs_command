var express = require('express');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
var router = express.Router();
const { Pool, Client } = require('pg')
// var await1 = require('await')
var setimei = "";
var setlimit = "";
var setdate = "order by servertime desc";
var dataX1 = "";
Mainfuntion = () => {

}


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('server');
});



router.post("/logdata/add", function (req, res, next) {
  // console.log("req.body.data2.2")
  // console.log('req.body.data1', req.body.data1)
  // console.log('req.body.description', req.body.description)
  setimei = req.body.data1;
  console.log(setimei)
  // console.log(req.body.name)
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

      Client.query('select * from log_11200 order by servertime desc limit 50;', (err, result) => {
        release()
        if (err) {
          return console.error('erroor acquiring query', err.stack)
        }
        dataX1 = result.rows
        console.log(result.rows)
      })


    }
    console.log(dataX1)
    // res.render('logdata1');
    res.render('user-list', { title: 'User List', userData: dataX1, databack: state });

  })





});







module.exports = router;
