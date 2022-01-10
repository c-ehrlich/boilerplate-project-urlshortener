require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/:id", (req, res) => {
  id = parseInt(req.params.id);
  if (isNaN(id)) res.json({ error: "Invalid URL" });
  else res.json({ message: req.params.id });
});

app.post("/api/shorturl", (req, res) => {
  let { url } = req.body;
  dns.lookup(url, (err, address, family) => {
    if (err.errno === -3008) res.json({ error: "Invalid Hostname" });
    else if (err) res.json({ error: err });
    else res.json({ 
      address: address,
      family: family,
      original_url: url,
      short_url: 0
    })
  })
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
