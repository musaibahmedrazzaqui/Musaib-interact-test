const express = require("express");
const axios = require("axios");
const app = express();
var cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

// console.log(process.env.OPENAI_API_KEY);
const fineTunedModel = "davinci:ft-personal-2023-08-21-14-07-13";
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // defaults to process.env["OPENAI_API_KEY"]
});

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
  console.log(req.body.queryResult.parameters.number);
  let orderId = req.body.queryResult.parameters.number;
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
      console.log(shipmentDate);
      const fulfilmentMsg = {
        fulfillmentMessages: [
          {
            payload: {
              richContent: [
                // for Dialogflow Messenger integration
                [
                  {
                    type: "info",
                    title: shipmentDate,
                    subtitle: "Shipment Date",
                    image: {
                      src: {
                        rawUrl:
                          "https://static.vecteezy.com/system/resources/previews/006/900/704/original/green-tick-checkbox-illustration-isolated-on-white-background-free-vector.jpg",
                      },
                    },
                    actionLink: "https://example.com",
                  },
                  {
                    type: "button",
                    icon: {
                      type: "chevron_right",
                      color: "#FF9800",
                    },
                    text: "Follow for Tracking",
                    link: "https://example.com/path/for/end-user/to/follow",
                    event: {
                      name: "Follow for tracking",
                    },
                  },
                ],
              ],

              // custom integration payload here
            },
          },
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
      {
      }
      res.status(201).json(fulfilmentMsg);
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.post("/submit", express.json(), async (req, res) => {
  console.log(req.body);
  try {
    const data = req.body;
    const filledIngredients = data.ingredients;
    const ingredientList = [...new Set(filledIngredients)];

    // Join the ingredients with commas
    const formattedIngredients = ingredientList.join(", ");

    // Create the new_prompt string
    const newPrompt = `What can I make with ${formattedIngredients} ->`;

    // Call the OpenAI API
    // console.log(openai);
    // const response = await openai.chat.completions.create({
    //   model: fineTunedModel,
    //   prompt: newPrompt,
    //   max_tokens: 100,
    //   temperature: 0,
    // });
    const completion = await openai.completions.create({
      ///messages: [{ role: "user", content: newPrompt }],
      model: fineTunedModel,
      prompt: newPrompt,
      max_tokens: 100,
      temperature: 0,
    });
    console.log(completion.choices[0].text);
    const answer = completion.choices[0].text;

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
});
const port = process.env.PORT || 7002;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
