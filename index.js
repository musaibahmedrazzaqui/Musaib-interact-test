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
  console.log("INSIDE FULILMENT",req.body.queryResult.queryText);
  //let orderId = req.body;
  let appData = {};
      
    
  let text=""
      //console.log(response.data.shipmentDate);
      axios.get("http://localhost:7002/custom/get-value").then(response=>{
        console.log(response.data)
        if(response.data.customPayload){
          text=response.data.customPayload.customPayload.echoValue
        }else{
          text="Payload not found"
        }
        
        const fulfilmentMsg = {
          fulfillmentMessages: [
            {
              "text": {
                "text": [
                  text
                ]
              }
            }
             
          ],
        };
        //console.log(fulfilmentMsg)
        res.status(201).json(fulfilmentMsg);
      }).catch(err=>{
        console.log(err)
        res.send(err)
      })
     
  
   
});
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
