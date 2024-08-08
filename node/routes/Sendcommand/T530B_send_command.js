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
function t500readconfig(hexstr) {
 /* 7E
 8104
 0000
 018760440050
 0001
 767E*/
  // console.log("imeiread", hexstr)
  var functionid = "8104";
  var lencommand = "0000";
  var imeiT401 = hexstr;
  var command1 = "";
  var sequin = "0001";
  var henderdata = "7E";
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
  // console.log("checkdata1:", checkdata55);
  return checkdata55;
}


function start_car(hexstr) {
  // console.log("imeiread", hexstr)  
  /*
 7e
 8105
 000c
 018760440050
 0003
 920100000000000000000000
 ea7e*/
  var functionid = "8105";
  var lencommand = "000C";
  var imeiT401 = hexstr;
                  
  var command1 = "920100000000000000000000";
  var sequin = "0003";
  var henderdata = "7E";
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
  // console.log("checkdata1:", checkdata55);
  return checkdata55;
}

function stop_car(hexstr) {
  // console.log("imeiread", hexstr)  
  /*
 7e
 8105
 000c
 018760440050
 0003
 930100000000000000000000
 eb7e*/
  var functionid = "8105";
  var lencommand = "000C";
  var imeiT401 = hexstr;
  var command1 = "930100000000000000000000";
  var sequin = "0003";
  var henderdata = "7E";
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
  // console.log("checkdata1:", checkdata55);
  return checkdata55;
}
function Unlock_car(hexstr) {
  // console.log("imeiread", hexstr)  
  /*
  7E
  8105
  000C
  018750911601
  0005
  A201000000000000000000007D
  027E*/
  var functionid = "8105";
  var lencommand = "000C";
  var imeiT401 = hexstr;
  var command1 = "A20100000000000000000000";
  var sequin = "0005";
  var henderdata = "7E";
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
  // console.log("checkdata1:", checkdata55);
  return checkdata55;
}

function lock_car(hexstr) {
  // console.log("imeiread", hexstr)  
  /*
  7E
  8105
  000C
  018750911601
  0006
  A20000000000000000000000
  7C
  7E*/
  var functionid = "8105";
  var lencommand = "000C";
  var imeiT401 = hexstr;
  var command1 = "A20000000000000000000000";
  var sequin = "0006";
  var henderdata = "7E";
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
  // console.log("checkdata1:", checkdata55);
  return checkdata55;
}
function Cutsstart(hexstr) {
  // console.log("imeiread", hexstr)  
  /*
  7E
  8105
  000C
  018750911601
  0008
  900100000000000000000000
  417E*/
  var functionid = "8105";
  var lencommand = "000C";
  var imeiT401 =  hexstr;
  var command1 = "900100000000000000000000";
  var sequin = "0008";
  var henderdata = "7E";
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
 7E
 8105
 000C
 018750911601
 0008
 910100000000000000000000
 417E*/
  var functionid = "8105";
  var lencommand = "000C";
  var imeiT401 = hexstr;
  var command1 = "910100000000000000000000";
  var sequin = "0008";
  var henderdata = "7E";
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
  // console.log("checkdata1:", checkdata55);
  return checkdata55;
}



function change_password(hexstr,password) {
  // console.log("imeiread", hexstr)  
  /*
7E
8103
000E
018760440050
0001
010000202908
3132333435363738777E*/
  var functionid = "8103";
  var lencommand = "000E";
  var imeiT401 = hexstr;
  var command1 = "010000202908"+ascii_to_hex(password);
  var sequin = "0001";
  var henderdata = "7E";
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
  // console.log("checkdata1:", checkdata55);
  return checkdata55;
}


function config_packdata(hexstr,password) {
  // console.log("imeiread", hexstr)  
  /*
7E
8103
000E
018760440050
0001
010000202908
3132333435363738777E*/
  var packdata = "<HL&P:HOLLOO&6O:1>"
  var functionid = "8300";
  var lencommand = "0012";
  var imeiT401 = hexstr;
  var command1 = "00"+ascii_to_hex(packdata);
  var sequin = "0001";
  var henderdata = "7E";
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
  // console.log("checkdata1:", checkdata55);
  return checkdata55;
}


function config_accON_vol(hexstr,dataconfig) {
  // console.log("imeiread", hexstr)  
  
  var packdata = "<HL&P:HOLLOO&1C:" + dataconfig +">"
  var functionid = "8300";
 
  var imeiT401 = hexstr;
  var command1 = "00"+ascii_to_hex(packdata);
  var sequin = "0001";
  var lencommand = decimalToHex2bytes((command1.length) / 2);
  var henderdata = "7E";
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
  // console.log("checkdata1:", checkdata55);
  return checkdata55;
}


function config_model_id(hexstr,dataconfig) {
  
   //<HL&P:HOLLOO&D:FC19,16>
  var packdata = "<HL&P:HOLLOO&D:" + dataconfig  +",16>"
  var functionid = "8300";
 
  var imeiT401 = hexstr;
  var command1 = "00"+ascii_to_hex(packdata);
  var sequin = "0001";
  var lencommand = decimalToHex2bytes((command1.length) / 2);
  var henderdata = "7E";
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
  // console.log("checkdata1:", checkdata55);
  return checkdata55;
}

function config_ip_port(hexstr, datastr1, datastr2) {
  
  //<HL&P:HOLLOO&E:asapgps.onelink-iot.com:10190>
 var packdata = "<HL&P:HOLLOO&E:" + datastr1 +":"+ datastr2   +">"
 var functionid = "8300";

 var imeiT401 = hexstr;
 var command1 = "00"+ascii_to_hex(packdata);
 var sequin = "0001";
 var lencommand = decimalToHex2bytes((command1.length) / 2);
 var henderdata = "7E";
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
//  console.log("checkdata1:", checkdata55);
 return checkdata55;
}


function config_command_sms(hexstr, datastr1) {
  
  //<HL&P:HOLLOO&E:asapgps.onelink-iot.com:10190>
 var packdata =  datastr1; 
 var functionid = "8300";

 var imeiT401 = hexstr;
 var command1 = "00"+ascii_to_hex(packdata);
 var sequin = "0001";
 var lencommand = decimalToHex2bytes((command1.length) / 2);
 var henderdata = "7E";
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
//  console.log("checkdata1:", checkdata55);
 return checkdata55;
}
function config_interval_time(hexstr,password) {
  // console.log("imeiread", hexstr)  
  /*
7E
8103
000E
018760440050
0001
010000202908
3132333435363738777E*/
  var packdata = "<HL&P:HOLLOO&1A:60>"
  var functionid = "8300";
  var lencommand = "0013";
  var imeiT401 = hexstr;
  var command1 = "00"+ascii_to_hex(packdata);
  var sequin = "0001";
  var henderdata = "7E";
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
  // console.log("checkdata1:", checkdata55);
  return checkdata55;
}



function t530Set_up_firmware(hexstr, datastr1, datastr2, datastr3) {
 
  //<HL&P:HOLLOO&1U:HBD200_V402632,47.106.157.21,21,ftp_holloo,ftp_holloo_*TP_SZ,HBD200_V402632.BIN,./,>
  //<HL&P:HOLLOO&1U:HBD200_V402632,3.0.63.30,21,r10v2,onelink@2012,HBD200_V402632.BIN,./,>
  var packdata = "<HL&P:HOLLOO&1U:" + datastr1 +"," + datastr2 +",21,r10v2,onelink@2012,"+ datastr1+ ".BIN,."+ datastr3  +",>"
  var functionid = "8300";
 
  var imeiT401 = hexstr;
  var command1 = "00"+ascii_to_hex(packdata);
  var sequin = "0001";
  var lencommand = decimalToHex2bytes((command1.length) / 2);
  var henderdata = "7E";
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
 //  console.log("checkdata1:", checkdata55);
  return checkdata55;
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

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('Sendcommand/T530B_send_command');
});






router.post("/MAC_ID", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
    
  var data = qs.stringify({
    'box_imei_id': imei,
    'dtsending': ''
  });
  var config = {
    method: 'post',
    url: 'https://api1-asap.onelink-iot.com/v1/asap/gps/checkpasswordbluetooth',
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
      dataX2 = JSON.stringify(response.data);
  


      res.json({
        success: true,
        message: 'Data received successfully',
        imei: imei,
        fileContents: dataX2
      });   
    })
    .catch(function (error) {
      console.log(error);
    });






});

router.post("/Status_car", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  
  var data = qs.stringify({
    'box_imei_id': imei,
    'dtsending': ''
  });
  var config = {
    method: 'post',
    url: 'https://api1-asap.onelink-iot.com/v1/asap/gps/realtime',
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
      dataX2 = JSON.stringify(response.data);
      let door_stat,door_lock_stat,cut_engine_stat;
     
      if(response.data.results && response.data.results.length > 0){
       door_stat = (response.data).results[0].door_stat;
       door_lock_stat = (response.data).results[0].door_lock_stat;
       cut_engine_stat = (response.data).results[0].cut_engine_stat;
       }
      var set_checkcarstus="";
      if (door_stat == 0 && door_lock_stat==0&& cut_engine_stat==0) {
        set_checkcarstus="/images/unlock3.png";
    } else if (door_stat == 0 && door_lock_stat==0&& cut_engine_stat==1) {
      set_checkcarstus="/images/unlock4.png";
    }else if (door_stat == 0 && door_lock_stat==1&& cut_engine_stat==0) {
      set_checkcarstus="/images/lock3.png";
    } else if (door_stat == 0 && door_lock_stat==1&& cut_engine_stat==1) {
    set_checkcarstus="/images/lock4.png";
    } else if (door_stat == 1 && door_lock_stat==0&& cut_engine_stat==0) {
    set_checkcarstus="/images/unlock1.png";
    } else if (door_stat == 1 && door_lock_stat==0&& cut_engine_stat==1) {
    set_checkcarstus="/images/unlock2.png";
    } else if (door_stat == 1 && door_lock_stat==1&& cut_engine_stat==0) {
     set_checkcarstus="/images/lock1.png";
     } else if (door_stat == 1 && door_lock_stat==1&& cut_engine_stat==1) {
    set_checkcarstus="/images/lock2.png";
    } else {
      set_checkcarstus="/images/lock2.png";
    }
    console.log(set_checkcarstus);

      setTimeout(() => {     //time out server
        if(dataX2){
            
        }else{
         
          dataX2= imei + ": Fail connection response" 
        }

        res.json({
          success: true,
          message: 'Data received successfully',
          imei: imei,
          fileContents: dataX2,
          checkcarstus: set_checkcarstus,
        });
      }, 500); // 1000 milliseconds = 1 second
    
    })
    .catch(function (error) {
      console.log(error);
    });






});


router.post("/config_interval_time", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  var datacommand = config_interval_time(imei,set_change_password);

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


router.post("/config_accON_voltage", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  var datacommand = config_accON_vol(imei,set_config_accON);
 
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


router.post("/config_packdata", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  
  var datacommand = config_packdata(imei,set_change_password);

  
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

router.post("/readconfig", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  var datacommand = t500readconfig(imei);
  // openconnection(imei, datacommand);

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


router.post("/Cut_start_car", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  var datacommand = Cutsstart(imei);
  // openconnection(imei, datacommand);

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


router.post("/change_password", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  var datacommand = change_password(imei,set_change_password);
 
  openconnection(imei, datacommand);
 
  console.log(change_password);

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


router.post("/UnCut_start_car", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  var datacommand = UnCutsstart(imei);
 
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



router.post("/lock_car", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  var datacommand = lock_car(imei);
 
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


router.post("/unlock_car", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  var datacommand = Unlock_car(imei);
 
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


router.post("/start_car", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  var datacommand = start_car(imei);
  // openconnection(imei, datacommand);

  openconnection(imei, datacommand);
  // CloseConnection();
  const door_stat = 3;
  const door_lock_stat = 3;
  const cut_engine_stat = 3;
  dataX1 = dataX2;
  

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

router.post("/stop_car", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  var datacommand = stop_car(imei);
  // openconnection(imei, datacommand);

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



router.post("/config_model_id", function (req, res, next) {
  console.log("555");
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  var datacommand = config_model_id(imei,set_config_model_id);
 
  console.log("555");
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


router.post("/Set_ip_port_apn", function (req, res, next) {
  dataX2="";
  const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  
  var datacommand = config_ip_port(imei,Set_ip_port_apn1,Set_ip_port_apn2);
 
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


router.post("/update_firmware", function (req, res, next) {
  dataX2="";
    const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
  if(Set_up_firmware4=="0000"){ // note noon want 
    date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  
  
  var datacommand = t530Set_up_firmware(imei,Set_up_firmware1,Set_up_firmware2,Set_up_firmware3);
 
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
  }, 500); // 1000 milliseconds = 1 
}
});

router.post("/command_by_sms", function (req, res, next) {
  dataX2="";
    const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
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
    const {  fileContents,imei, set_change_password, set_config_accON, set_config_model_id, Set_ip_port_apn1, Set_ip_port_apn2, set_command_by_sms, Set_up_firmware1,Set_up_firmware2,Set_up_firmware3,Set_up_firmware4 } = req.body;
 
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
