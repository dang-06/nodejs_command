var express = require('express');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
var router = express.Router();
const axios = require('axios');
var qs = require('qs');
var net = require('net');
var readlineSync = require('readline-sync');
// var await1 = require('await')
var setimei = "";
var setlimit = "";
var setdate = "order by servertime desc";
var dataX1 = "";
var connettion_tcp = 0;
var dataX2 = "";

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

var state = {
  imei: "",
  date: "",
  limit: "",
  data: ""
};
function byteToHexString(uint8arr) {
  if (!uint8arr) {
    return '';
  }

  var hexStr = '';
  for (var i = 0; i < uint8arr.length; i++) {
    var hex = (uint8arr[i] & 0xff).toString(16);
    hex = (hex.length === 1) ? '0' + hex : hex;
    hexStr += hex;
  }

  return hexStr.toUpperCase();
}
function chk8xor(byteArray) {
  let checksum = 0x00
  // console.log("test", byteArray)
  for (let i = 0; i < byteArray.length; i++)
    checksum ^= byteArray[i]

  // dataxor = byteToHexString(checksum)
  return checksum
}
function decimalToHex(d, padding) {
  var hex = Number(d).toString(16);
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

  while (hex.length < padding) {
    hex = "0" + hex;
  }

  return hex;
}
function ReplaceE7(ReplaceE7S1) {
  var decValue = 0;
  var hexString = "";
  var allS1 = "";
  for (var i = 0, len = ReplaceE7S1.length; i < len; i += 2) {
    var data55 = "";
    data55 = ReplaceE7S1.substr(i, 2);
    // console.log("sup1 ", data55);
    var data56 = data55.replace('E7', 'E602');
    // console.log("data56 ", data56);
    allS1 = allS1 + data56
  }
  // console.log("allS1", allS1);
  var allS2 = "";
  var ReplaceE7S2 = allS1;
  for (var i = 0, len = ReplaceE7S2.length; i < len; i += 2) {
    var data551 = "";
    data551 = ReplaceE7S2.substr(i, 2);
    // console.log("sup11 ", data551);
    var data561 = data551.replace('E6', 'E601');
    // console.log("data561 ", data561);
    allS2 = allS2 + data561
  }

  // console.log(allS2)
  return allS2;
  // Next





}

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
function t500readconfig(hexstr) {
  // console.log("imeiread", hexstr)
  var functionid = "8300";
  var lencommand = "0002";
  var imeiT401 = "54" + hexstr.substr(1, 14);
  var command1 = "AAAA";
  var sequin = "0001";
  var henderdata = "E7";
  // console.log("imeiT401", imeiT401)
  var all = functionid + lencommand + imeiT401 + sequin + command1
  // console.log("all", all);

  // console.log("byte", hexStringToByte(all));
  var crcxor = (chk8xor(hexStringToByte(all)));

  // console.log("crc", crcxor);
  // var pop = 355
  // var ccr = crcxor.toString(16);
  crcxor = decimalToHex(crcxor);
  // console.log("ccr", crcxor);
  var allS3 = all + crcxor;
  var allS4 = allS3.toUpperCase();
  // console.log("allS3", allS4);
  var checkdata55 = "";
  checkdata55 = ReplaceE7(allS4);
  // console.log("checkdata1:", checkdata55);
  checkdata55 = henderdata + checkdata55 + henderdata
  console.log("checkdata1:", checkdata55);
  return checkdata55;
}





/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('Sendcommand/asap_send_command');
});


function openconnection(dataimei, datacommand) {

  console.log("openconnection")

  // if (!client) {
  //   console.log("-- connection is already open--");

  //   return
  // }
  console.log("new socket");
  client = new net.Socket();
  client.connect(10001, '52.77.114.175', function () {
    console.log("-- connection is already open--");
    console.log("imei", dataimei);
    console.log("datacommand", datacommand);
    client.write('ONELINK<H>ONELINK</H><U>r10v2</U><P>@OLT</P><IMEI>' + dataimei + '</IMEI><B>' + datacommand + '</B>~');


  });

  client.on('error', function (err) {
    client.destroy();
    client = null;
    console.log("EEROR : connection could not be opened. Msg: %s", err.message);

  });
  client.on('data', function (data1) {
    console.log('Received ' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + data1);
    state.imei = setimei;
    controldata1 = 'value=' + state.imei;
    dataX2 = 'Received ' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + data1;
    console.log("Received: %s", data1);

    // data1 = "";
    CloseConnection();

    // if (i == 2)
    //   client.destroy();
    // client.connect(10001, '52.77.114.175', function () {
    //   console.log("connection opened successfuly")
    //   settimeout(function () {
    //     menu();
    //   }, 0);
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




router.post("/readconfig", function (req, res, next) {
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  setimei = req.body.imei;
  console.log(setimei)
  controldata1 = 'value=' + setimei;
  var datacommand = t500readconfig(setimei);
  openconnection(setimei, datacommand);
  console.log(dataX2);
  dataX1 = dataX2;
  // console.log("check", controldata1);

  // CloseConnection();
  res.render('Sendcommand/asap_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1 });





});






module.exports = router;
