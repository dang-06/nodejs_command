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
// var sever_connect = '3.0.99.204'
// var port_connect = 13200 
var sever_connect = 'hinogps.onelink-iot.com'
var port_connect = 10170



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
function Replace7E(Replace7ES1) {
  var decValue = 0;
  var hexString = "";
  var allS1 = "";
  for (var i = 0, len = Replace7ES1.length; i < len; i += 2) {
    var data55 = "";
    data55 = Replace7ES1.substr(i, 2);
    // console.log("sup1 ", data55);
    var data56 = data55.replace('7e', '7d02');
    // console.log("data56 ", data56);
    allS1 = allS1 + data56
  }
  // console.log("allS1", allS1);
  var allS2 = "";
  var Replace7ES2 = allS1;
  for (var i = 0, len = Replace7ES2.length; i < len; i += 2) {
    var data551 = "";
    data551 = Replace7ES2.substr(i, 2);
    // console.log("sup11 ", data551);
    var data561 = data551.replace('7d', '7d01');
    // console.log("data561 ", data561);
    allS2 = allS2 + data561
  }
  var allS3 = "";
  var Replace7ES3 = allS2;
  for (var i = 0, len = Replace7ES3.length; i < len; i += 2) {
    var data553 = "";
    data553 = Replace7ES3.substr(i, 2);
    // console.log("sup11 ", data551);
    var data563 = data553.replace('3E', '3E01');
    // console.log("data561 ", data561);
    allS3 = allS3 + data563
  }

  var allS4 = "";
  var Replace7ES4 = allS3;
  for (var i = 0, len = Replace7ES4.length; i < len; i += 2) {
    var data554 = "";
    data554 = Replace7ES4.substr(i, 2);
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

function A1T_set_commandsms(hexstr, datastr) {
  // console.log("imeiread", hexstr)
  // 7E 8300 000D 012073400714 0001 01 23 30 30 30 30 30 30 2C 50 48 54 4F 83 7E
  var functionid = "8300";

  var imeiT401 = hexstr;

  console.log(hexstr);
  console.log(datastr);

  var infocommand = ascii_to_hex(datastr);
  console.log(infocommand);

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
  checkdata55 = Replace7E(allS4);
  // console.log("checkdata1:", checkdata55);
  checkdata55 = henderdata + checkdata55 + henderdata
  console.log("checkdata1:", checkdata55);
  return checkdata55;
}

function A1T_set_config(hexstr, datastr) {
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
  checkdata55 = Replace7E(allS4);
  // console.log("checkdata1:", checkdata55);
  checkdata55 = henderdata + checkdata55 + henderdata
  console.log("checkdata1:", checkdata55);
  return checkdata55;
}

function A1T_select_command(command_check) {
  Command_to_check = command_check;
  // working hour

  Working_hour_command = "#000000,STDJ:1,57383,4," + Command_to_check;

  return Working_hour_command;
}

function openconnection(dataimei, datacommand) {

  console.log("openconnection")

  // if (!client) {
  //   console.log("-- connection is already open--");

  //   return
  // }
  console.log("new socket");
  client = new net.Socket();
  client.connect(port_connect, sever_connect, function () {
    console.log("-- connection is already open--");
    console.log("imei", dataimei);
    console.log("datacommandsend", datacommand);
    client.write('`ONELINK<H>ONELINK</H><U>r10v2</U><P>@OLT</P><IMEI>' + dataimei + '</IMEI><B>' + datacommand + '</B>~');
    console.log(dataimei);
    console.log(datacommand);

  });
  // setTimeout(result, 20000)

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
      // controldata1 = 'value=' + state.imei;
      controldata1 = state.imei;
      dataX2 = 'Received ' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " " + data1;
      console.log("Received: %s", data1);
      // console.log(data1_result1);
      // console.log(data1_result);

      Check_result(data1);
    // data1 = "";
     CloseConnection();
    });


}

function Check_result(dataresult) {
  console.log(dataresult);
  
  var buf1 = Buffer.from([0x30, 0x30, 0x31, 0x0a]);
  var buf2 = Buffer.from([0x30, 0x30, 0x30, 0x0a]);
  dataresult_srt = dataresult.toString();
  buf1_srt = buf1.toString();
  buf2_srt = buf2.toString();

  console.log(buf1);
  console.log("buf1");
  if (dataresult_srt == buf1_srt){
    command_fail = "Set Config Pass" 
  }else if(dataresult_srt == buf2_srt){
    command_fail = "Set config fail, Device disconnect from server" + dataresult
  }else{
    command_fail = "Set config fail, error:" + dataresult
  }
  console.log(dataresult);
  console.log(command_fail);
  return command_fail;
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
  console.log("--Connection closed successfully check--")
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('Sendcommand/A1T_send_command');
});



router.post("/A1T_set_command", function (req, res, next) {
  console.log("--A1T_set_command SET COMMAND START--")
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();


  setimei = req.body.imei;


  set_overspeed = req.body.set_overspeed;

  if (set_overspeed != "") {


    // controldata1 = 'value=' + setimei;
    // controldata2 = 'value=' + set_overspeed;
    controldata1 = setimei;
    controldata2 = set_overspeed;

    console.log("--A1T_set_command SET COMMAND successfully--")
    var datacommand = A1T_set_commandsms(setimei, set_overspeed);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_result = "Command: " + set_overspeed
    // dataX1 = dataX2;
  } else {
    command_fail = "Set config fail, Please check your command"
    command_result = "Error"
    controldata2 = ""
    dataX2 = ""

  }
  setTimeout(render, 3000)

  function render(){
  res.render('Sendcommand/A1T_send_command_1', { title: 'User List', userData: dataX2, valueimei: controldata1, value_set_command: controldata2, datacommand: datacommand, command_fail: command_fail, command_result: command_result});
  }

});

// module.exports = router;

router.post("/A1T_set_working_hour", function (req, res, next) {
  console.log("--A1T_set_working_hour SET COMMAND START--")

  date_ob = new Date();
  hours = date_ob.getHours();
  // current minutes
  minutes = date_ob.getMinutes();
  // current seconds
  seconds = date_ob.getSeconds();


  setimei = req.body.imei;
  working_hour = req.body.working_hour;
  interval_time = req.body.interval_time;
  system_reset = req.body.system_reset;
  cut_start = req.body.cut_start;
  go_send_cmd = req.body.go_send_cmd;

  if (working_hour != "") {
    Working_hour_command = "#000000,STDJ:1,57383,4," + working_hour;
    console.log("--workingggggg checkkkk--")
    console.log(Working_hour_command)

    console.log("--A1T_set_working_hour SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, Working_hour_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_result = "-- Working Hour: " + working_hour
    controldata2 = Working_hour_command;
    // dataX1 = dataX2;

  } else if (go_send_cmd == "Go to Send Command") {
    go_send_cmd_command = " "
    // console.log("--FW_upgrade_CMD checkkkk--")
    // console.log(FW_upgrade_CMD_command)

    console.log("--test go to send command--")
    var datacommand = A1T_set_config(setimei, go_send_cmd_command);
    // openconnection(setimei, datacommand);

    // openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_fail = ""
    command_result = "   Welcome to Send Command  "
    controldata2 = ""
    dataX2 = ""
    // dataX1 = dataX2;

  } else if (interval_time != "") {
    interval_time_command = "#000000,STIN:" + interval_time;
    console.log("--workingggggg checkkkk--")
    console.log(interval_time_command)

    console.log("--A1T_set_interval_time SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, interval_time_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    command_result = "-- Interval time: " + interval_time
    controldata2 = interval_time_command;
    // dataX1 = dataX2;


  } else if (system_reset == "reset") {
    system_reset_command = "#000000,REST";
    console.log("--workingggggg checkkkk--")
    console.log(system_reset_command)

    console.log("--A1T_set_interval_time SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, system_reset_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_result = "-- System reset "
    controldata2 = system_reset_command;
    // dataX1 = dataX2;

  } else if ((cut_start == "CUT") || (cut_start == "OK")) {
    cut_start_command = "#000000,STOC:" + cut_start;
    console.log("--workingggggg checkkkk--")
    console.log(cut_start_command)

    console.log("--A1T_set_interval_time SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, cut_start_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    if (cut_start == "CUT")
      command_result = "-- Cut-Start: ON"
    else if (cut_start == "OK")
      command_result = "-- Cut-Start: OFF"
    controldata2 = cut_start_command;
    // dataX1 = dataX2;

  // } else if (go_send_cmd == "") {
  //   go_send_cmd_command = " "
  //   // console.log("--FW_upgrade_CMD checkkkk--")
  //   // console.log(FW_upgrade_CMD_command)

  //   console.log("--test go to send command--")
  //   var datacommand = A1T_set_config(setimei, go_send_cmd_command);
  //   // openconnection(setimei, datacommand);

  //   // openconnection(setimei, datacommand);
  //   // CloseConnection();
  //   // command_fail = "Set Config Pass"
  //   command_fail = ""
  //   command_result = "   Welcome to Send Command  "
  //   controldata2 = ""
  //   dataX2 = ""
  //   // dataX1 = dataX2;

  } else {
    command_fail = "Set config fail, Please check your command"
    command_result = "Error"
    controldata2 = ""
    dataX2 = ""
  }


  controldata1 = setimei;
  
  setTimeout(render, 3000)

  function render(){
  res.render('Sendcommand/A1T_send_command_2', { title: 'User List', userData: dataX2, valueimei: controldata1, value_set_command: controldata2, datacommand: datacommand, command_fail: command_fail, command_result: command_result });
   }

});

router.post("/A1T_FW_upgrade", function (req, res, next) {
  console.log("--A1T_FW_upgrade SET COMMAND START--")

  date_ob = new Date();
  hours = date_ob.getHours();
  // current minutes
  minutes = date_ob.getMinutes();
  // current seconds
  seconds = date_ob.getSeconds();


  setimei = req.body.imei;
  working_hour = req.body.working_hour;
  interval_time = req.body.interval_time;
  system_reset = req.body.system_reset;
  cut_start = req.body.cut_start;
  heartbeat_off = req.body.heartbeat_off;
  Wake_up_level = req.body.Wake_up_level;
  Filter_volt = req.body.Filter_volt;
  Wake_up_time = req.body.Wake_up_time;
  Time_Zone = req.body.Time_Zone;
  FW_upgrade_CMD = req.body.FW_upgrade_CMD;
  FW_upgrade = req.body.FW_upgrade;


  if (heartbeat_off == "0") {
    heartbeat_off_command = "#000000,STPF:HBEN," + heartbeat_off;
    console.log("--heartbeat_off checkkkk--")
    console.log(heartbeat_off_command)

    console.log("--A1T_FW_upgrade SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, heartbeat_off_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_result = "-- Turn off heartbeat: " + heartbeat_off
    controldata2 = heartbeat_off_command;
    // dataX1 = dataX2;

  } else if (Wake_up_level == "1") {
    Wake_up_level_command = "#000000,STPF:ACCEWAKE," + Wake_up_level;
    console.log("--Wake_up_level checkkkk--")
    console.log(Wake_up_level_command)

    console.log("--A1T_FW_upgrade SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, Wake_up_level_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    command_result = "-- Wake up level: " + Wake_up_level
    controldata2 = Wake_up_level_command;
    // dataX1 = dataX2;


  } else if (Filter_volt == "100") {
    Filter_volt_command = "#000000,STPF:ADVAILD," + Filter_volt;
    console.log("--workingggggg checkkkk--")
    console.log(Filter_volt_command)

    console.log("--A1T_FW_upgrade SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, Filter_volt_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_result = "-- filter voltage values: " + Filter_volt
    controldata2 = Filter_volt_command;
    // dataX1 = dataX2;

  } else if (Wake_up_time == "60") {
    Wake_up_time_command = "#000000,STGT:" + Wake_up_time;
    console.log("--workingggggg checkkkk--")
    console.log(Wake_up_time_command)

    console.log("--A1T_FW_upgrade SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, Wake_up_time_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_result = "-- Wake up time (sleep): " + Wake_up_time
    controldata2 = Wake_up_time_command;
    // dataX1 = dataX2;

  } else if (Time_Zone == "07") {
    Time_Zone_command = "#000000,STTZ:" + Time_Zone + ":00";
    console.log("--Time_Zone checkkkk--")
    console.log(Time_Zone_command)

    console.log("--A1T_FW_upgrade SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, Time_Zone_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_result = "-- Time Zone: " + Time_Zone
    controldata2 = Time_Zone_command;
    // dataX1 = dataX2;

  } else if (working_hour != "") {
    Working_hour_command = "#000000,STDJ:1,57383,4," + working_hour;
    console.log("--workingggggg checkkkk--")
    console.log(Working_hour_command)

    console.log("--A1T_FW_upgrade SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, Working_hour_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_result = "-- Working Hour: " + working_hour
    controldata2 = Working_hour_command;
    // dataX1 = dataX2;

  } else if (FW_upgrade_CMD == "415") {
    FW_upgrade_CMD_command = "#000000,FPUP:HBV000,internet,3.0.63.30,21,r10v2,onelink@2012,0,/A1T,HB-A1T-22081-V2.0." + FW_upgrade_CMD + ".bin";
    console.log("--FW_upgrade_CMD checkkkk--")
    console.log(FW_upgrade_CMD_command)

    console.log("--A1T_FW_upgrade SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, FW_upgrade_CMD_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_result = "-- FW version: " + FW_upgrade_CMD_command
    controldata2 = FW_upgrade_CMD_command;
    // dataX1 = dataX2;

  } else if (system_reset == "reset") {
    system_reset_command = "#000000,REST";
    console.log("--system_reset checkkkk--")
    console.log(system_reset_command)

    console.log("--A1T_FW_upgrade SET COMMAND successfully--")
    var datacommand = A1T_set_config(setimei, system_reset_command);
    // openconnection(setimei, datacommand);

    openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_result = "-- System reset "
    controldata2 = system_reset_command;
    // dataX1 = dataX2;

  // } else if (FW_upgrade == "test") {
  //   FW_upgrade_CMD_command = "test"
  //   // console.log("--FW_upgrade_CMD checkkkk--")
  //   // console.log(FW_upgrade_CMD_command)

  //   console.log("--A1T_FW_upgrade SET COMMAND successfully--")
  //   var datacommand = A1T_set_config(setimei, FW_upgrade_CMD_command);
  //   // openconnection(setimei, datacommand);

  //   // openconnection(setimei, datacommand);
  //   // CloseConnection();
  //   // command_fail = "Set Config Pass"
  //   command_fail = "   "
  //   command_result = "      Welcome to FW Upgrade       "
  //   controldata2 = ""
  //   // dataX1 = dataX2;

  } else if (FW_upgrade == "Go to FW Upgrade") {
    FW_upgrade_command = " "
    // console.log("--FW_upgrade_CMD checkkkk--")
    // console.log(FW_upgrade_CMD_command)

    console.log("--test fw upgrade--")
    var datacommand = A1T_set_config(setimei, FW_upgrade_command);
    // openconnection(setimei, datacommand);

    // openconnection(setimei, datacommand);
    // CloseConnection();
    // command_fail = "Set Config Pass"
    command_fail = "   "
    command_result = " Welcome to FW Upgrade "
    controldata2 = ""
    dataX2 = ""
    // dataX1 = dataX2;


  } else {
    command_fail = "Set config fail, Please check your command"
    command_result = "Error"
    controldata2 = ""
    dataX2 = ""
  }


  controldata1 = setimei;
  
  setTimeout(render, 3000)

  function render(){
  res.render('Sendcommand/A1T_send_command_FW', { title: 'User List', userData: dataX2, valueimei: controldata1, value_set_command: controldata2, datacommand: datacommand, command_fail: command_fail, command_result: command_result });
   }

});

module.exports = router;
