require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();
const assert = require('chai').assert;

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// Setup DB
const { nanoid } = require("nanoid");
require("dotenv").config();
const mongoose = require("mongoose");
// const { assert } = require("console");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const { Schema } = mongoose;
const shortenedUrlSchema = new Schema({
  original_url: { type: String, required: true },
  short_url: { type: String, required: true },
});
let ShortenedUrl = mongoose.model("ShortenedUrl", shortenedUrlSchema);
async function getUrl(url) {
  const dbUrl = await ShortenedUrl.findOne({ url: url }).exec();
  return _callback(dbUrl);
}

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
  else {
    res.json({ message: req.params.id });
    // search for a url with this id
    // if not found, return an error
    // otherwise, redirect to that url
  }
});

app.post("/api/shorturl", (req, res) => {
  let { url } = req.body;
  let hostname = (new URL(url)).hostname;
  dns.lookup(hostname, (err, address, family) => {
    if (err) {
      console.error(err);
      res.json({ error: "Invalid Hostname" });
    } else {
      // check if there is already a DB entry with this url
      // let urlObject = getUrl(url, returnInput);
      let promise = ShortenedUrl.findOne({ original_url: url }).exec()
      assert.ok(promise instanceof Promise);
      promise.then((urlObject) => {
        console.log(urlObject);
        console.log(typeof urlObject);
        if (urlObject !== null) {
          // if yes, return it
          res.json({
            original_url: urlObject.original_url,
            short_url: urlObject.short_url,
          });
        } else {
          // if no, create a new one and return that
          const newUrl = new ShortenedUrl({ original_url: url, short_url: nanoid() });
          newUrl.save((err) => {
            if (err) res.json({ Error: err });
            else
              res.json({
                original_url: newUrl.original_url,
                short_url: newUrl.short_url,
              });
          });
        }
      });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
