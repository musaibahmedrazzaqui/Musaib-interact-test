var express = require("express");
var custom = express.Router();
var cors = require("cors");
const ExchangeRequest = require("../models/ExchangeRequest");
const DFhandlers=require("../utils/DFhandlers")
const {customManager}=require("../manager/EchoManager")
custom.use(cors());
custom.get("/", function (req, res) {
    console.log("SERVER STARTED from custom");
    res.send("Server is running from custom controller");
  });

//const manager = require("../manager/EchoManager");

custom.post("/custom-proxy", express.json(), async (req, res)=> {
    //     sd
    
        console.log("REQUEST agai")
        let exchangeRequest=new ExchangeRequest
        exchangeRequest =req.body
        try{
            let responseOfManager= await customManager(exchangeRequest)
            //console.log("response came")

            res.status(200).json(responseOfManager);
        }catch(err){
            return err
        }
       
        //let exchangeRequest=new ExchangeRequest
        //exchangeRequest =req.body
        //const {text,userId}=req.body
                //let responseOfManager=manager(exchangeRequest )
        //console.log("RESPONSE",responseOfManager)
        //const resultQuery=await DFhandlers.textQuery(text, userId)
        
        
        //console.log(resultQuery)
        //console.log(resultQuery[0].queryResult.fulfillmentMessages[0].text.text[0])
        
       });

module.exports=custom