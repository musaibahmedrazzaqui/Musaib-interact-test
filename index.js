const express = require("express");
const bodyParser=require("body-parser")
const axios = require("axios");
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

app.get("/", function (req, res) {
  console.log("SERVER STARTED");
  res.send("Server is running");
});
function formatDate(inputDate) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(inputDate);
  const dayOfWeek = daysOfWeek[date.getUTCDay()];
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${dayOfWeek}, ${day} ${month} ${year}`;
}
app.use("/echo", Echo)
const port = process.env.PORT || 7002;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
