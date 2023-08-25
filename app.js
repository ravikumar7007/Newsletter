const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey: "47c3033230604785bbd88757832da00a-us8",
  server: "us8",
});

app.get("/", (req, res) => {
  async function run() {
    const response = await mailchimp.ping.get();
    console.log(response);
  }

  run();
  res.sendFile(__dirname + "/signUp.html");
});
app.post("/", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  const run = async () => {
    const response = await mailchimp.lists.addListMember("3e624827ef", {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    });

    return response;
  };
  run().then((msg) => {
    if (msg.status === "subscribed") {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    console.log(msg.status);
  });
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is listening on 3000");
});

// API 47c3033230604785bbd88757832da00a-us8
//id 3e624827ef
