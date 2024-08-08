var express = require('express');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
var router = express.Router();
const axios = require('axios');
var qs = require('qs');
var net = require('net');
var readlineSync = require('readline-sync');
const { exec } = require('child_process');
// var await1 = require('await');
var setimei = "";
var setlimit = "";
var setdate = "order by servertime desc";
var dataX1 = "";
var dataX2 = "";
var connettion_tcp = 0;
var sever_connect = '54.169.92.251'
var port_connect = 13400

function hexStringToByte(str) {
  if (!str) {
    return new Uint8Array();
  }

  var a = [];
  for (var i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16));
  }

  return new Uint8Array(a);
}


function openconnection(action, datacommand) {

  console.log("openconnection")


  console.log("new socket");
  client = new net.Socket();
  client.connect(port_connect, sever_connect, function () {
    console.log("-- connection is already open--");
    console.log("action", action);
    console.log("filename", datacommand);
    // {"Mode":0,"action":2,"filename":"py_IRIS_Receiver"}
    client.write('{"Mode":0,"action":' + action + ',"filename":"' + datacommand + '"}');


  });

  client.on('error', function (err) {
    client.destroy();
    client = null;
    console.log("EEROR : connection could not be opened. Msg: %s", err.message);

  });
  client.on('data', function (data1) {

    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();
    console.log('Received ' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + data1);
    // state.imei = setimei;
    // controldata1 = 'value=' + state.imei;
    dataX2 = 'Received ' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + data1;
    console.log("Received: %s", data1);

    // data1 = "";
    CloseConnection();


  });

}


function CloseConnection() {
  if (!client) {
    console.log("--Connection is not open or closed--");

    return;
  }
  client.destroy();
  client = null;
  console.log("--Connection closed successfully--")
  return;
}

Mainfuntion = () => {
  console.log("--Connection closed successfully--")
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('services');
});



router.post("/services_recive", function (req, res, next) {
  console.log("--SET COMMAND START--")
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();


  console.log(setimei)
  if (req.body.imei == "START") {
    command_action = "1"

  } else if ((req.body.imei == "STOP")) {
    command_action = "2"

  } else if ((req.body.imei == "Restart")) {
    command_action = "3"

  } else if ((req.body.imei == "Restart web")) {
    command_action = "4"

  }
  setimei = req.body.imei;


  set_overspeed = req.body.set_overspeed;


  controldata1 = 'value=' + setimei;

  controldata2 = 'value=' + set_overspeed;

  console.log("--SET COMMAND successfully--")

  openconnection(command_action, set_overspeed);
  // CloseConnection();

  dataX1 = dataX2;

  res.render('services_1', { title: 'User List', userData: dataX1, valueimei: controldata1, value_set_command: controldata2 });


});

module.exports = router;
