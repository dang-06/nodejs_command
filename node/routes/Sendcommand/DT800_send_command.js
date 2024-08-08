var express = require('express');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
var router = express.Router();
const axios = require('axios');
var qs = require('qs');
var net = require('net');
var readlineSync = require('readline-sync');
// var await1 = require('await');
var setimei = "";
var setlimit = "";
var setdate = "order by servertime desc";
var dataX1 = "";
var dataX2 = "";
var connettion_tcp = 0;

// var sever_connect = '3.1.175.195'
// var port_connect = 30129



var state = {
  imei: "",
  date: "",
  limit: "",
  data: ""
};
function ascii_to_hex(str) {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join('');
}

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

function decimalToHex2bytes(i) {
  var result = "0000";
  if (i >= 0 && i <= 15) { result = "000" + i.toString(16); }
  else if (i >= 16 && i <= 255) { result = "00" + i.toString(16); }
  else if (i >= 256 && i <= 4095) { result = "0" + i.toString(16); }
  else if (i >= 4096 && i <= 65535) { result = i.toString(16); }
  return result
}
function ReplaceE7(ReplaceE7S1) {
  var decValue = 0;
  var hexString = "";
  var allS1 = "";
  for (var i = 0, len = ReplaceE7S1.length; i < len; i += 2) {
    var data55 = "";
    data55 = ReplaceE7S1.substr(i, 2);
    // console.log("sup1 ", data55);
    var data56 = data55.replace('7e', '7d02');
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
    var data561 = data551.replace('7d', '7d01');
    // console.log("data561 ", data561);
    allS2 = allS2 + data561
  }
  var allS3 = "";
  var ReplaceE7S3 = allS2;
  for (var i = 0, len = ReplaceE7S3.length; i < len; i += 2) {
    var data553 = "";
    data553 = ReplaceE7S3.substr(i, 2);
    // console.log("sup11 ", data551);
    var data563 = data553.replace('3E', '3E01');
    // console.log("data561 ", data561);
    allS3 = allS3 + data563
  }

  var allS4 = "";
  var ReplaceE7S4 = allS3;
  for (var i = 0, len = ReplaceE7S4.length; i < len; i += 2) {
    var data554 = "";
    data554 = ReplaceE7S4.substr(i, 2);
    // console.log("sup11 ", data551);
    var data564 = data554.replace('3E', '3E01');
    // console.log("data561 ", data561);
    allS4 = allS4 + data564
  }
  // console.log(allS2)
  return allS2;
  // return allS4;
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

function DT800_set_commandsms(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  // 7E 8300 000D 012073400714 0001 01 23 30 30 30 30 30 30 2C 50 48 54 4F 83 7E
  var functionid = "8300";

  var imeiT401 = hexstr;

  var infocommand = ascii_to_hex(datastr);
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
  var sequin = "0001";
  var henderdata = "7e";
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
  console.log("Hello world:");
  return checkdata55;
}

function openconnection(dataimei, datacommand) {

  console.log("openconnection")

  // if (!client) {
  //   console.log("-- connection is already open--");

  //   return
  // }
  console.log("new socket");
  client = new net.Socket();
  client.connect(30129, 'receiver.hino-connect.vn', function () {
    console.log("-- connection is already open--");
    console.log("imei", dataimei);
    console.log("datacommandsend", datacommand);
    // setTimeout(function() {
    //   //your code to be executed after 1 second
    //   console.log("Delay 500 ms");
    // }, 500);
    //client.write('`ONELINK<H>ONELINK</H><U>r10v2</U><P>@OLT</P><IMEI>' + dataimei + '</IMEI><B>' + datacommand + '</B>~');
    // client.write('7e0100002d012291302317000100000000373031303748422d41395300000000000000000000000000003133303233313702d4c1423030303030f67e');
    // console.log("7e0100002d012291302317000100000000373031303748422d41395300000000000000000000000000003133303233313702d4c1423030303030f67e");
    // console.log(dataimei);
    // console.log(datacommand);

    //-------------------------------
    //const message = 'ONELINK<H>ONELINK</H><U>r10v2</U><P>@OLT</P><IMEI>' + dataimei + '</IMEI><B>' + datacommand + '</B>~';
    //const message = '7e0100002d012291302317000100000000373031303748422d41395300000000000000000000000000003133303233313702d4c1423030303030f67e';

    Start_message = "274F4C56";  //'OLV   
    //IMEI_message = "012291302317"; 
    IMEI_message = dataimei; 
    //data_message = "7e8300000E01229130231700010123303030303030535456443A31067e"; 
    data_message = datacommand; 
    Stop_message = "56274F4C"; //OLV' 

    test_message = Start_message + "4D4D4D4D" + IMEI_message + "4D4D4D4D" +  "44444444" + data_message + "44444444" + Stop_message;
    const buffer_log = Buffer.from(test_message, 'hex');
    //const buffer_log = Buffer.from(data_message, 'hex');
    console.log("message", buffer_log);
    client.write(buffer_log);
    // client.write(message, function (err) {
    //   if (err) {
    //       console.error('Error writing to the client:', err);
    //   } else {
    //       // console.log('Message successfully written to the client:', message);
    //   }
    //-------------------------------
 
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
    state.imei = setimei;

    controldata1 = 'value=' + state.imei;
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
  console.log("--Connection closed destroy--")
  return;
}

Mainfuntion = () => {
  console.log("--Connection closed successfully--")
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('Sendcommand/DT800_send_command');
});



router.post("/DT800_set_command", function (req, res, next) {
  console.log("--SET COMMAND START--")
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();


  console.log(setimei)
  setimei = req.body.imei;
  set_overspeed = req.body.set_overspeed;


  controldata1 = 'value=' + setimei;
  controldata2 = 'value=' + set_overspeed;

  console.log("--SET COMMAND successfully--")
  var datacommand = DT800_set_commandsms(setimei, set_overspeed);
  // openconnection(setimei, datacommand);
  console.log("datacommand_test", datacommand);

  openconnection(setimei, datacommand);
  // CloseConnection();
  setTimeout(function() {
    //your code to be executed after 1 second
    CloseConnection();
    console.log("Close connection after timeout");
  }, 500);
  console.log("--After open connection--")
  dataX1 = dataX2;

  res.render('Sendcommand/DT800_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1, value_set_command: controldata2 });


});

module.exports = router;
