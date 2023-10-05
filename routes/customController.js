var express = require("express");
var custom = express.Router();
var cors = require("cors");
const ExchangeRequest = require("../models/ExchangeRequest");
const DFhandlers=require("../utils/DFhandlers")
const {customManager}=require("../manager/CustomManager")
custom.use(cors());

custom.get("/", function (req, res) {
    console.log("SERVER STARTED from custom");
    res.send("Server is running from custom controller");
  });

//const manager = require("../manager/EchoManager");

custom.post("/custom-proxy", express.json(), async (req, res)=> {
    //     sd
    
        console.log("REQUEST agai",req.body)
        let exchangeRequest=new ExchangeRequest
        exchangeRequest=req.body
     
        try{
            let responseOfManager= await customManager(exchangeRequest)
            //console.log("response came")
           // responseOfManager.customPayload=null
            console.log("RESPONSE",responseOfManager)
            
            res.send(responseOfManager);
        }catch(err){
            return err
        }
       
        
       });


module.exports={custom}