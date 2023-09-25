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

    console.log("REQUEST", req.body)
    let exchangeRequest=new ExchangeRequest
    exchangeRequest =req.body
    
    let responseOfManager=manager(exchangeRequest )
    console.log("RESPONSE",responseOfManager)
    res.status(200).json(responseOfManager);
   });
module.exports=echo;