var express = require('express');
var { JSDOM } = require("jsdom");
var { window } = new JSDOM("");
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
  return allS4;
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

function t500readconfigID(hexstr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);
  var infocommand = ascii_to_hex("<HLCK>");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500readstatus(hexstr) {
  // console.log("imeiread", hexstr)
  var functionid = "8255";

  var imeiT401 = "54" + hexstr.substr(1, 14);
  // var infocommand = ascii_to_hex("<HLCK>");
  // var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = ""

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = "0000"
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



function t500Set_sleep_mode(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&5X:") + ascii_to_hex(datastr) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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

function t500set_overspeed(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&1E:") + ascii_to_hex(datastr) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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

function t500set_RS232_1(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&5Y:") + ascii_to_hex(datastr) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
  var sequin = "0001";
  var henderdata = "E7";
  // console.log("imeiT401", imeiT401)
  var all = functionid + lencommand + imeiT401 + sequin + command1;
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
  checkdata55 = henderdata + checkdata55 + henderdata;
  console.log("checkdata1:", checkdata55);
  return checkdata55;
}


function t500Set_Voice_group(hexstr, datastr1, datastr2, datastr3) {
  try{

  
  // console.log("imeiread", hexstr,datastr1,datastr2,datastr3);
  var functionid = "8700";
  // console.log("datastr1", datastr1);
  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&5K:") + ascii_to_hex(datastr1) + ascii_to_hex(",") + ascii_to_hex(datastr2) + ascii_to_hex(",") + ascii_to_hex(datastr3) + ascii_to_hex(">");
  // console.log("infocommand", infocommand);
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  var lencommand = decimalToHex2bytes((command1.length) / 2);
  var sequin = "0001";
  var henderdata = "E7";
  // console.log("imeiT401", imeiT401);
  var all = functionid + lencommand + imeiT401 + sequin + command1;
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
  checkdata55 = henderdata + checkdata55 + henderdata;
  console.log("checkdata1:", checkdata55);
  return checkdata55;
 
  }
  catch(err) {
    console.error(err);
  } 
}


function t500Set_accident_start_speed(hexstr, datastr1, datastr2) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&1V:") + ascii_to_hex(datastr1) + ascii_to_hex(",") + ascii_to_hex(datastr2) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_accident_up_speed(hexstr, datastr1, datastr2, datastr3, datastr4) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&1J:") + ascii_to_hex(datastr1) + ascii_to_hex(",") + ascii_to_hex(datastr2) + ascii_to_hex(",") + ascii_to_hex(datastr3) + ascii_to_hex(",") + ascii_to_hex(datastr4) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_accident_down_speed(hexstr, datastr1, datastr2, datastr3, datastr4) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&1K:") + ascii_to_hex(datastr1) + ascii_to_hex(",") + ascii_to_hex(datastr2) + ascii_to_hex(",") + ascii_to_hex(datastr3) + ascii_to_hex(",") + ascii_to_hex("2") + ascii_to_hex(",") + ascii_to_hex(datastr4) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_accident_shrpturn_speed(hexstr, datastr1, datastr2, datastr3, datastr4, datastr5) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&1M:") + ascii_to_hex(datastr1) + ascii_to_hex(",") + ascii_to_hex(datastr3) + ascii_to_hex(",") + ascii_to_hex(datastr4) + ascii_to_hex(",") + ascii_to_hex(datastr5) + ascii_to_hex(",") + ascii_to_hex(datastr2) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_voice_volume(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&5R:") + ascii_to_hex(datastr) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_voice_ptt_A(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&5U:") + ascii_to_hex(datastr) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_over_rpm(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&1S:") + ascii_to_hex(datastr) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_ip_port_apn(hexstr, datastr1, datastr2, datastr3) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&A:") + ascii_to_hex(datastr3) + ascii_to_hex(",,&B:") + ascii_to_hex(datastr1) + ascii_to_hex(":") + ascii_to_hex(datastr2) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_acc_tracking_on(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&1A:") + ascii_to_hex(datastr) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_acc_tracking_off(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&5A:") + ascii_to_hex(datastr) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_Heartbeat_tracking(hexstr, datastr1, datastr2) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&1H:") + ascii_to_hex(datastr1) + ascii_to_hex(",") + ascii_to_hex(datastr2) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_odometer(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&1L:") + ascii_to_hex(datastr) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_model_id(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&D:") + ascii_to_hex(datastr) + ascii_to_hex(",16") + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500Set_up_firmware(hexstr, datastr1, datastr2, datastr3) {
  // console.log("imeiread", hexstr)
  var functionid = "8502";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = ascii_to_hex(datastr1) + ascii_to_hex(",") + ascii_to_hex(datastr2) + ascii_to_hex(",") + ascii_to_hex("21") + ascii_to_hex(",") + ascii_to_hex("r10v2") + ascii_to_hex(",") + ascii_to_hex("onelink@2012") + ascii_to_hex(",") + ascii_to_hex(datastr1) + ascii_to_hex(".BIN") + ascii_to_hex(",") + ascii_to_hex(datastr3) + ascii_to_hex(",");

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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


function t500set_set_input7_8(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&5V:") + ascii_to_hex(datastr) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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



function t500set_command_by_sms(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex(datastr);
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function t500set_reboot_device(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  var functionid = "8700";

  var imeiT401 = "54" + hexstr.substr(1, 14);

  var infocommand = ascii_to_hex("<") + ascii_to_hex("HL&P:HOLLOO&1R:") + ascii_to_hex(datastr) + ascii_to_hex(">");
  var leninfo = decimalToHex2bytes((infocommand.length) / 2);
  var command1 = "01" + leninfo + infocommand;

  // var datalen = decimalToHex2bytes((command1.length) / 2);
  // console.log('datalen', datalen);
  var lencommand = decimalToHex2bytes((command1.length) / 2);
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
function openconnection(dataimei, datacommand) {

  console.log("openconnection")

  
  console.log("new socket");
  client = new net.Socket();
  client.connect(11102, '61.19.250.10', function () {
    console.log("-- connection is already open--");
    console.log("imei", dataimei);
    console.log("datacommandsend", datacommand);
    // client.write('`ONELINK<H>ONELINK</H><U>r10v2</U><P>@OLT</P><IMEI>' + dataimei + '</IMEI><B>' + datacommand + '</B>~');
    const message = '`ONELINK<H>ONELINK</H><U>r10v2</U><P>@OLT</P><IMEI>' + dataimei + '</IMEI><B>' + datacommand + '</B>~';
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
      dataX2 = 'Received '+ " " + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + ": " + "Send OK";
    }else{
      dataX2 = 'Received '+ " " + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + ": " + data1;
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
  res.render('Sendcommand/ptt_send_command');
});



router.post("/readconfig", function (req, res, next) {
  
  dataX2="";

  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
   
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  console.log(setimei);

  var datacommand = t500readconfig(setimei);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  // CloseConnection();
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/readconfigID", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  console.log(setimei);
  
  var datacommand = t500readconfigID(setimei);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second

});
// t500readstatus
router.post("/req_Status", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();

  console.log(setimei);  

  var datacommand = t500readstatus(setimei);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second





});

router.post("/set_overspeed", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();


  console.log(setimei);
  

  var datacommand = t500set_overspeed(setimei, set_overspeed);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});

router.post("/set_RS232_1", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  var datacommand = t500set_RS232_1(setimei, set_overspeed);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_Voice_group", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log("test :",setimei);
  var datacommand = t500Set_Voice_group(setimei, Set_Voice_group1, Set_Voice_group2, Set_Voice_group3);
  // openconnection(setimei, datacommand);
  console.log(datacommand);
  openconnection(setimei, datacommand);
 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " + dataX2;
    }else{
      CloseConnection();
      dataX2 = setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});

router.post("/Set_accident_start_speed", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  var datacommand = t500Set_accident_start_speed(setimei, Set_accident_start_speed1, Set_accident_start_speed2);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});


//18/10/2021 add
router.post("/Set_accident_up_speed", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_accident_up_speed(setimei, Set_accident_up_speed1, Set_accident_up_speed2, Set_accident_up_speed3, Set_accident_up_speed4);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  // CloseConnection();

  dataX1 = dataX2;

  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_accident_down_speed", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_accident_down_speed(setimei, Set_accident_down_speed1, Set_accident_down_speed2, Set_accident_down_speed3, Set_accident_down_speed4);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_accident_shrpturn_speed", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_accident_shrpturn_speed(setimei, Set_accident_shrpturn_speed1, Set_accident_shrpturn_speed2, Set_accident_shrpturn_speed3, Set_accident_shrpturn_speed4, Set_accident_shrpturn_speed5);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
// 19/10/2021
router.post("/Set_voice_volume", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_voice_volume(setimei, Set_voice_volume1);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_voice_ptt_A", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_voice_ptt_A(setimei, Set_voice_ptt_A1);
  openconnection(setimei, datacommand);

  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_over_rpm", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_over_rpm(setimei, Set_over_rpm1);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_ip_port_apn", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_ip_port_apn(setimei, Set_ip_port_apn1, Set_ip_port_apn2, Set_ip_port_apn3);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_acc_tracking_on", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_acc_tracking_on(setimei, Set_acc_tracking_on1);
 
  openconnection(setimei, datacommand);
 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_acc_tracking_off", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_acc_tracking_off(setimei, Set_acc_tracking_off1);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_Heartbeat_tracking", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_Heartbeat_tracking(setimei, Set_Heartbeat_tracking1, Set_Heartbeat_tracking2);
 
  openconnection(setimei, datacommand);
 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_odometer", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_odometer(setimei, Set_odometer1);
 
  openconnection(setimei, datacommand);
 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_model_id", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_model_id(setimei, Set_model_id1);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_sleep_mode", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei,Set_sleep_mode1);
  
  var datacommand = t500Set_sleep_mode(setimei, Set_sleep_mode1);
 
  openconnection(setimei, datacommand);
  
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});
router.post("/Set_up_firmware", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
  
  var datacommand = t500Set_up_firmware(setimei, Set_up_firmware1, Set_up_firmware2, Set_up_firmware3);
  

  openconnection(setimei, datacommand);
  
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});


router.post("/set_input7_8", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);
 
  var datacommand = t500set_set_input7_8(setimei, set_input7_8);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});


router.post("/reboot_device", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    }= req.body;
  date_ob = new Date();
  hours = date_ob.getHours();
  // current minutes
  minutes = date_ob.getMinutes();
  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);  

  var datacommand = t500set_reboot_device(setimei, "1");  

  openconnection(setimei, datacommand); 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});


router.post("/command_by_sms", function (req, res, next) {
  dataX2="";
  var {  
      fileContents,
      setimei,
      set_overspeed,
      set_RS232_1, 
      Set_Voice_group1, 
      Set_Voice_group2, 
      Set_Voice_group3, 
      Set_accident_start_speed1,
      Set_accident_start_speed2,
      Set_accident_up_speed1,
      Set_accident_up_speed2,
      Set_accident_up_speed3,
      Set_accident_up_speed4,
      Set_accident_down_speed1,
      Set_accident_down_speed2,
      Set_accident_down_speed3,
      Set_accident_down_speed4,
      Set_accident_shrpturn_speed1,
      Set_accident_shrpturn_speed2,
      Set_accident_shrpturn_speed3,
      Set_accident_shrpturn_speed4,
      Set_accident_shrpturn_speed5,
      Set_voice_volume1,
      Set_voice_ptt_A1,
      Set_over_rpm1,
      Set_ip_port_apn1,
      Set_ip_port_apn2,
      Set_ip_port_apn3,
      Set_acc_tracking_on1,
      Set_acc_tracking_off1,
      Set_Heartbeat_tracking1,
      Set_Heartbeat_tracking2,
      Set_odometer1,
      Set_model_id1,
      Set_sleep_mode1,
      Set_up_firmware1,
      Set_up_firmware2,
      Set_up_firmware3,
      set_input7_8,
      set_command_by_sms
    } = req.body;
  date_ob = new Date();
  hours = date_ob.getHours();
  // current minutes
  minutes = date_ob.getMinutes();
  // current seconds
  seconds = date_ob.getSeconds();
  console.log(setimei);  

  var datacommand = t500set_command_by_sms(setimei, set_command_by_sms);  

  openconnection(setimei, datacommand); 
  setTimeout(() => {     //time out server
    if(dataX2){
      dataX2= setimei +": " +dataX2;
    }else{
      CloseConnection();
      dataX2= setimei + ": Fail connection response" 
    }
    res.json({
      success: true,
      message: 'Data received successfully',
      imei: setimei,
      fileContents: dataX2,
    });
  }, 900); // 1000 milliseconds = 1 second


});



module.exports = router;
