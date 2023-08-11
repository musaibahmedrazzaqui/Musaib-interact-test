const express = require("express");
const axios = require("axios");
const app = express();
var cors = require("cors");

app.use(cors());
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

app.post("/getShipment", express.json(), function (req, res) {
  console.log(req.body);
  let orderId = req.body;
  let appData = {};

  axios
    .post(
      `https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus`,
      {
        orderId: orderId,
      }
    )
    .then((response) => {
      console.log(response.data.shipmentDate);

      appData["error"] = 0;
      appData["data"] = response.data.shipmentDate;
      // console.log("appdata", appData.data);
      let shipmentDate = formatDate(appData.data);
      const fulfilmentMsg = {
        fulfillmentMessages: [
          {
            card: {
              title: shipmentDate,
              subtitle: "Shipment Date",
              imageUri:
                "https://static.vecteezy.com/system/resources/previews/006/900/704/original/green-tick-checkbox-illustration-isolated-on-white-background-free-vector.jpg",
              buttons: [
                {
                  text: "Follow for tracking",
                  postback: "https://example.com/path/for/end-user/to/follow",
                },
              ],
            },
          },
        ],
      };
      res.status(201).json(fulfilmentMsg);
    })
    .catch(function (error) {
      console.log(error);
    });
});

const port = process.env.PORT || 7002;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
