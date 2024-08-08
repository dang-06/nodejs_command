var express = require('express');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
var router = express.Router();
const axios = require('axios');
const axios2 = require('axios');
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
var sever_connect = '13.212.9.120'
var port_connect = 13300



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

function IRIS_set_commandsms(hexstr, datastr) {


  var infocommand = ascii_to_hex(datastr);
 

  return infocommand;
}


function IRIS_set_bysms_hero(hexstr, datastr) {


  var imeiT401 = hexstr;

  var infocommand = ascii_to_hex(datastr);


  return infocommand;
}

const findObject = (data, imei) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].uniqueId === imei) {
            return data[i];
          }
        }
        return null;
      };


function send_api_hero_getdata(dataimei,datacommand){
  var data = qs.stringify({
    
  });
  var config = {
    method: 'get',
    url: 'http://18.142.155.204:8082/api/devices',
    
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46YWRtaW4=',
      
    },
    data: data
  };
  axios(config)
    .then(function (response) {
    
          



          // Use the function to find the object
          const foundObject = findObject(response.data, dataimei);
          if (foundObject) {
            console.log("Found object:", foundObject);
            return JSON.stringify(foundObject);
          } else {
            
            throw new Error('Object not found');
          }




    
    })
  
    .catch(function (error) {
      console.log(error);
      
    });



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
  res.render('Sendcommand/IRIS_send_command');
});



router.post("/IRIS_set_command", function (req, res, next) {
  console.log("--SET COMMAND START--")
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();


  console.log(setimei)
  setimei = req.body.imei;
  set_bysms_test = req.body.set_bysms_test;
  set_bysms_hero = req.body.set_bysms_hero;

  controldata1 = 'value=' + setimei;
  controldata2 = 'value=' + set_bysms_test;
  controldata3 = 'value=' + set_bysms_hero;

  console.log("--SET COMMAND successfully--")
  var datacommand = IRIS_set_commandsms(setimei, set_bysms_test);
  // openconnection(setimei, datacommand);

  openconnection(setimei, datacommand);
  // CloseConnection();

  dataX1 = dataX2;

  res.render('Sendcommand/IRIS_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1, value_set_command: controldata2, value_set_bysms_hero: controldata3 });


});


function containsValue(json, value) {
  let contains = false;
  Object.keys(json).some(key => {
      contains = typeof json[key] === 'object' ? containsValue(json[key], value) : json[key] === value;
      return contains;
  });
  return contains;
}


function sendPostRequest(dataFromGet,jsondata_id) {
  
      var data =  {"type": "custom",
      "attributes": {
        "data": dataFromGet
      },
      "deviceId": jsondata_id
    };
      var config = {
        method: 'post',
        url: 'http://18.142.155.204:8082/api/commands/send',
    // url: 'http://18.142.155.204:8082/api/commands/types',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46YWRtaW4=',
        },
        data: data
      };
    
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          var dataapi2 = JSON.stringify(response.data);
          return dataapi2;
          
        })
        .catch(function (error) {
          console.log(error);
        });
        
    
    
}



router.post("/IRIS_set_bysms_hero", function (req, res, next) {
  console.log("--SET COMMAND START--")
  date_ob = new Date();
  hours = date_ob.getHours();

  // current minutes
  minutes = date_ob.getMinutes();

  // current seconds
  seconds = date_ob.getSeconds();


  console.log(setimei)

  setimei = req.body.imei;
  set_bysms_test = req.body.set_bysms_test;
  set_bysms_hero = req.body.set_bysms_hero;

  controldata1 = 'value=' + setimei;
  controldata2 = 'value=' + set_bysms_test;
  controldata3 = 'value=' + set_bysms_hero;
  console.log("--SET COMMAND successfully--")
  var datacommand = IRIS_set_commandsms(setimei, set_bysms_hero);
  datacommand =  set_bysms_hero;
  console.log("command",datacommand)
  
  // openconnection(setimei, datacommand);
  var data = qs.stringify({
    
  });
  var config = {
    method: 'get',
    url: 'http://18.142.155.204:8082/api/devices',
    // url: 'http://18.142.155.204:8082/api/commands/types',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46YWRtaW4=',
      
    },
    data: data
  };
  axios(config)
    .then(function (response) {
    
          



          // Use the function to find the object
          const foundObject = findObject(response.data, setimei);
          if (foundObject) {
            console.log("Found object:", foundObject);
            // return JSON.stringify(foundObject);
            // dataX1 =JSON.stringify(foundObject);
            var jsondata_status  = foundObject.status;
            var jsondata_id  = foundObject.id;
            var jsondata_lastUpdate  = foundObject.lastUpdate;

            if(jsondata_status=="online"){
              console.log("online");
              const CancelToken = axios.CancelToken;
                var repornapi2 =sendPostRequest(datacommand,jsondata_id);
              // while(!repornapi2){
              //   console.log("TEST WHILE");
              // }
              dataX1 =qs.stringify(repornapi2);
              dataX1 = "send ok  " +"id: " +jsondata_id + "\r\n" + "status: " +jsondata_status + "\r\n" + "GPS_lastUpdate: " +jsondata_lastUpdate;
              res.render('Sendcommand/IRIS_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1, value_set_command: controldata2 , value_set_bysms_hero: controldata3});
              
          }else{
            dataX1 = "id: " +jsondata_id + "\r\n" + "status: " +jsondata_status + "\r\n" + "GPS_lastUpdate: " +jsondata_lastUpdate;
            res.render('Sendcommand/IRIS_send_command_1', { title: 'User List', userData: dataX1, valueimei: controldata1, value_set_command: controldata2 , value_set_bysms_hero: controldata3});
          }

          } else {
            dataX2 ="Object not found"
            throw new Error('Object not found');
          }




    
    })
  
    .catch(function (error) {
      console.log(error);
      
    });


});
module.exports = router;
