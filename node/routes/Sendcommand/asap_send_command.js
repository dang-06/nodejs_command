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
var dataX2 = "";
var connettion_tcp = 0;



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


function start_car(hexstr) {
  // console.log("imeiread", hexstr)  
  /*
  E78600000F54123111111124054C7804054C0000000000000000000000B7E7
  E7
  8600
  000F
  54123111111124
  054C
  7803054C0000000000000000000000
  B0E7*/
  var functionid = "8600";
  var lencommand = "000F";
  var imeiT401 = "54" + hexstr.substr(1, 14);
                  
  var command1 = "7804054C0000000000000000000000";
  var sequin = "054B";
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

function stop_car(hexstr) {
  // console.log("imeiread", hexstr)  
  /*
  E78600000F54123111111124054C7805054C0000000000000000000000B6E7
  E7
  8600
  000F
  54123111111124
  054C
  7803054C0000000000000000000000
  B0E7*/
  var functionid = "8600";
  var lencommand = "000F";
  var imeiT401 = "54" + hexstr.substr(1, 14);
  var command1 = "7805054C0000000000000000000000";
  var sequin = "054B";
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
function Unlock_car(hexstr) {
  // console.log("imeiread", hexstr)  
  /*
  E7
  8600
  000F
  54123111111124
  054C
  7803054C0000000000000000000000
  B0E7*/
  var functionid = "8600";
  var lencommand = "000F";
  var imeiT401 = "54" + hexstr.substr(1, 14);
  var command1 = "A50F05490001010101010101010101";
  var sequin = "0549";
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

function lock_car(hexstr) {
  // console.log("imeiread", hexstr)  
  /*
  E7
  8600
  000F
  54123111111124
  054C
  7803054C0000000000000000000000
  B0E7*/
  var functionid = "8600";
  var lencommand = "000F";
  var imeiT401 = "54" + hexstr.substr(1, 14);
  var command1 = "A500054B0000000000000000000000";
  var sequin = "054B";
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
function Cutsstart(hexstr) {
  // console.log("imeiread", hexstr)  
  /*
  E7
  8600
  000F
  54123111111124
  054C
  7803054C0000000000000000000000
  B0E7*/
  var functionid = "8600";
  var lencommand = "000F";
  var imeiT401 = "54" + hexstr.substr(1, 14);
  var command1 = "7803054C0000000000000000000000";
  var sequin = "054C";
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
function UnCutsstart(hexstr) {
  // console.log("imeiread", hexstr)  
  /*
  E7
  8600
  000F
  54123111111124
  054C
  7806
  054C0000000000000000000000B5E7*/
  var functionid = "8600";
  var lencommand = "000F";
  var imeiT401 = "54" + hexstr.substr(1, 14);
  var command1 = "7806054C0000000000000000000000";
  var sequin = "054C";
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
    console.log("datacommandsend", datacommand);
    client.write('ONELINK<H>ONELINK</H><U>r10v2</U><P>@OLT</P><IMEI>' + dataimei + '</IMEI><B>' + datacommand + '</B>~');


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
  console.log("--Connection closed successfully--")
  return;
}

Mainfuntion = () => {
  console.log("--Connection closed successfully--")
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('Sendcommand/asap_send_command');
});



router.post("/MAC_ID", function (req, res, next) {
  // var myElement = document.getElementById("Submit");
  setimei = req.body.imei;
  // setimei5 = req;
  // console.log("api", myElement)

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
      // console.log('sdsd', dataX1);
      res.render('Sendcommand/asap_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1 });
    })
    .catch(function (error) {
      console.log(error);
    });






});

router.post("/Status_car", function (req, res, next) {
  // var myElement = document.getElementById("Submit");
  setimei = req.body.imei;
  // setimei5 = req;
  // console.log("api", myElement)

  var data = qs.stringify({
    'box_imei_id': setimei,
    'dtsending': ''
  });
  var config = {
    method: 'post',
    url: 'http://api2.onelink.co.th/v1/asap/gps/realtime',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic QVNBUEBPbmVMaW5rOjBuZWxpbmtAQVNBUA==',
      'Cookie': 'ci_session=7n5f2nnh7chrk2orqkt2mfvhe039cka4'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      dataX1 = JSON.stringify(response.data);
      state.imei = setimei;
      controldata1 = 'value=' + state.imei;
      // console.log('sdsd', dataX1);
      res.render('Sendcommand/asap_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1 });
    })
    .catch(function (error) {
      console.log(error);
    });






});
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
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  // CloseConnection();

  dataX1 = dataX2;
  // console.log("datax1");
  // console.log("check", controldata1);

  // CloseConnection();
  res.render('Sendcommand/asap_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1 });





});


router.post("/Cut_start_car", function (req, res, next) {

  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  setimei = req.body.imei;
  console.log(setimei)
  controldata1 = 'value=' + setimei;
  var datacommand = Cutsstart(setimei);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  // CloseConnection();

  dataX1 = dataX2;
  // console.log("datax1");
  // console.log("check", controldata1);

  // CloseConnection();
  res.render('Sendcommand/asap_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1 });





});

router.post("/UnCut_start_car", function (req, res, next) {

  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  setimei = req.body.imei;
  console.log(setimei)
  controldata1 = 'value=' + setimei;
  var datacommand = UnCutsstart(setimei);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  // CloseConnection();

  dataX1 = dataX2;
  // console.log("datax1");
  // console.log("check", controldata1);

  // CloseConnection();
  res.render('Sendcommand/asap_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1 });





});



router.post("/lock_car", function (req, res, next) {

  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  setimei = req.body.imei;
  console.log(setimei)
  controldata1 = 'value=' + setimei;
  var datacommand = lock_car(setimei);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  // CloseConnection();

  dataX1 = dataX2;
  // console.log("datax1");
  // console.log("check", controldata1);

  // CloseConnection();
  res.render('Sendcommand/asap_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1 });





});


router.post("/unlock_car", function (req, res, next) {

  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  setimei = req.body.imei;
  console.log(setimei)
  controldata1 = 'value=' + setimei;
  var datacommand = Unlock_car(setimei);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  // CloseConnection();

  dataX1 = dataX2;
  // console.log("datax1");
  // console.log("check", controldata1);

  // CloseConnection();
  res.render('Sendcommand/asap_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1 });





});


router.post("/start_car", function (req, res, next) {

  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  setimei = req.body.imei;
  console.log(setimei)
  controldata1 = 'value=' + setimei;
  var datacommand = start_car(setimei);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  // CloseConnection();

  dataX1 = dataX2;
  // console.log("datax1");
  // console.log("check", controldata1);

  // CloseConnection();
  res.render('Sendcommand/asap_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1 });





});

router.post("/stop_car", function (req, res, next) {

  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  setimei = req.body.imei;
  console.log(setimei)
  controldata1 = 'value=' + setimei;
  var datacommand = stop_car(setimei);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  // CloseConnection();

  dataX1 = dataX2;
  // console.log("datax1");
  // console.log("check", controldata1);

  // CloseConnection();
  res.render('Sendcommand/asap_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1 });





});







module.exports = router;
