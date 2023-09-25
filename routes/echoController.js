var express = require("express");
var echo = express.Router();
var cors = require("cors");
const ExchangeRequest = require("../models/ExchangeRequest");
const manager = require("../manager/EchoManager");

echo.use(cors());
echo.get("/", function (req, res) {
    console.log("SERVER STARTED");
    res.send("Server is running");
  });

echo.post("/echo-proxy", express.json(), function (req, res) {
//     sd
    //exchangeRequest=new ExchangeRequest
    ExchangeRequest =req.body
    manager(ExchangeRequest )
   });
module.exports=echo;