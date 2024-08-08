var express = require('express');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
var router = express.Router();
const axios = require('axios');
var qs = require('qs');
var net = require('net');
var readlineSync = require('readline-sync');
const bodyParser = require('body-parser');

const path = require('path');
const fs = require('fs');

// var await1 = require('await')
var imei = "";
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









function decimalToHex2bytes(i) {
  var result = "0000";
  if (i >= 0 && i <= 15) { result = "000" + i.toString(16); }
  else if (i >= 16 && i <= 255) { result = "00" + i.toString(16); }
  else if (i >= 256 && i <= 4095) { result = "0" + i.toString(16); }
  else if (i >= 4096 && i <= 65535) { result = i.toString(16); }
  return result
}


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
    hex = (hex.length == 1) ? '0' + hex : hex;
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
  padding = typeof (padding) == "undefined" || padding == null ? padding = 2 : padding;

  while (hex.length < padding) {
    hex = "0" + hex;
  }

  return hex;
}
function ReplaceE7(ReplaceE7S1) {
  var decValue = 0;
  var hexString = "";
  var allS1 = "";
  var allS2 = "";
  for (var i = 0, len = ReplaceE7S1.length; i < len; i += 2) {
    var data55 = "";
    data55 = ReplaceE7S1.substr(i, 2);
    // console.log("sup1 ", data55);
    if(data55=="7E"){
    var data56 = data55.replace('7E', '7D02');
    // console.log("data56 ", data56);
    allS2 = allS2 + data56
    }else if (data55=="7D"){
      var data561 = data55.replace('7D', '7D01');
      // console.log("data561 ", data561);
      allS2 = allS2 + data561
    }else{
      allS2 =allS2 + data55
      // console.log("test ", allS2);
    }
  }
  // // console.log("allS1", allS1);
  // var allS2 = "";
  // var ReplaceE7S2 = allS1;
  // for (var i = 0, len = ReplaceE7S2.length; i < len; i += 2) {
  //   var data551 = "";
  //   data551 = ReplaceE7S2.substr(i, 2);
  //   // console.log("sup11 ", data551);
  //   var data561 = data551.replace('6E', '6E01');
  //   // console.log("data561 ", data561);
  //   allS2 = allS2 + data561
  // }

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



function openconnection(dataimei, datacommand) {

  console.log("openconnection")

 
  console.log("new socket");
  client = new net.Socket();
  client.connect(10002, 'asapgps.onelink-iot.com', function () {
    console.log("-- connection is already open--");
    console.log("imei", dataimei);
    console.log("datacommandsend", datacommand);
    // client.write('ONELINK<H>ONELINK</H><U>r10v2</U><P>@OLT</P><IMEI>' + dataimei + '</IMEI><B>' + datacommand + '</B>~');
    const message = 'ONELINK<H>ONELINK</H><U>r10v2</U><P>@OLT</P><IMEI>' + dataimei + '</IMEI><B>' + datacommand + '</B>~';
    client.write(message, function (err) {
      if (err) {
          console.error('Error writing to the client:', err);
      } else {
          // console.log('Message successfully written to the client:', message);
      }
  });

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

    console.log('Received '+ dataimei +" "  + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + data1);
    
    if(data1=="001\n"){
      dataX2 = 'Received '  +" " + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + ": " + "Send OK";
    }else{
      dataX2 = 'Received ' +" " + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + ": " + data1;
    }
   

    
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

// /* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.render('Tools/RS232_Port');
// });
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('Tools/binnay_mix');
});






router.post("/command_by_sms", function (req, res, next) {
  dataX2="";
    const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  
  var datacommand = config_command_sms(imei,set_command_by_sms);
 
  openconnection(imei, datacommand);

  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= imei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= imei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: imei,
      fileContents: dataX2,
    });
  }, 500); // 1000 milliseconds = 1 second
});




router.post("/upload", function (req, res, next) {
  dataX2="";
  try {
    const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms } = req.body;
 
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  
  console.log(fileContents); 
 
  

  res.json({
    success: true,
    message: 'Data received successfully',
    imei: imei,
    fileContents: "รอก่อนนะย้งไม่เสร้จ"
  });


} catch (error) {
  console.error('Error:', error);
  res.status(500).send('Internal Server Error');
}
});



module.exports = router;
