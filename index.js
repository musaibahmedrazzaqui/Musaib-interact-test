const express = require("express");
const bodyParser=require("body-parser")
const app = express();
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
var Custom=require("./routes/customController")
app.get("/", function (req, res) {
  console.log("SERVER STARTED");
  res.send("Server is running");
});

app.use("/echo", Echo)
app.use("/custom",Custom)
const port = process.env.PORT || 7002;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
