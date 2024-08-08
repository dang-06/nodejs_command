var express = require('express');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
var router = express.Router();
const axios = require('axios');
var qs = require('qs');
// var await1 = require('await')
var setimei = "";
var setlimit = "";
var setdate = "order by servertime desc";
var dataX1 = "";

var state = {
  imei: "",
  date: "",
  limit: "",
  data: ""
};





/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('Sendcommand/asap_send_command');
});



router.post("/add", function (req, res, next) {

  setimei = req.body.imei;
  console.log(setimei)

  var data = qs.stringify({
    'box_imei_id': setimei,
    'dtsending': ''
  });
  var config = {
    method: 'post',
    url: 'http://api2.onelink-iot.com/v1.5/Onetrack/CheckPasswordBluetooth',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic QVNBUEBPbmVMaW5rOjBuZWxpbmtAQVNBUA==',
      'Cookie': 'ci_session=4n6ctocf3upqqa33bbufv9tmncf3s1k8'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      dataX1 = JSON.stringify(response.data);
      state.imei = setimei;
      controldata1 = 'value=' + state.imei;
      console.log('sdsd', dataX1);
      res.render('Sendcommand/asap_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1 });
    })
    .catch(function (error) {
      console.log(error);
    });






});







module.exports = router;
