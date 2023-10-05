const express = require("express");
const bodyParser=require("body-parser")
const app = express();
const axios=require("axios")
var cors = require("cors");
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

var Echo=require("./routes/echoController")
var Custom=require("./routes/customController");
const echo = require("./routes/echoController");
app.get("/", function (req, res) {
  console.log("SERVER STARTED");
  res.send("Server is running");
});

app.use("/echo", Echo)
app.use("/custom",Custom.custom)
const port = process.env.PORT || 7002;

app.post("/fulfilment", express.json(), function (req, res) {
  let params=""
  if(req.body.originalDetectIntentRequest.payload.customPayload){
    params=req.body.originalDetectIntentRequest.payload.customPayload.echoValue
  }else{
    params="ARe you sure you sent a custom payload?"
  }
   
  //let orderId = req.body;
  let appData = {};
      
    
  let text=""
      //console.log(response.data.shipmentDate);
        
        const fulfilmentMsg = {
          fulfillmentMessages: [
            {
              "text": {
                "text": [
                  params
                ]
              }
            }
             
          ],
        };
        //console.log(fulfilmentMsg)
        res.status(201).json(fulfilmentMsg);
      
     
  
   
});
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
