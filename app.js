const express = require("express"); // Express web server framework
const https = require("https"); // HTTPS module
const app = express(); // Create a new Express application
const request = require("request"); // "Request" library
const mailchimp = require("@mailchimp/mailchimp_marketing"); // Mailchimp API
app.use(express.urlencoded({ extended: true })); //this is the body parser
app.use(express.json()); //this is the body parser

app.use(express.static("public")); //static files in public folder

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signUp.html");
});
app.post("/", function (req, res) {
  const queryEmail = req.body.inputEmail;
  const queryFirstName = req.body.inputfirstName;
  const queryLastName = req.body.inputLastName;

  const data = {
    members: [
      {
        email_address: queryEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: queryFirstName,
          LNAME: queryLastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data); //convert data to json
  const url = "https://us20.api.mailchimp.com/3.0/lists/753db83e63"; //url of the mailchimp list
  const options = {
    //options for the request
    method: "POST",
    auth: "david:" + process.env.mailchimp_KEY,
  };

  const request = https.request(url, options, function (response) {
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      // console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
  // console.log(queryEmail + " " + queryFirstName + " " + queryLastName +" "+ jsonData);
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
