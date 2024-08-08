
var express = require('http');


const server = http.createserver(function (req, res) {

  res.write("<h1>hello</h1>")
  res.end()
})
server.listen(80), "0.0.0.0", () => {

  console.log("start server 80")
}