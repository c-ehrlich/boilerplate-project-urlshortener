require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();
const assert = require("chai").assert;

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
const { isValidHttpUrl } = require("./utils");

// Setup DB
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
  let promise = ShortenedUrl.findById(req.params.id).exec();
  assert.ok(promise instanceof Promise);
  promise.then((urlObject) => {
    if (urlObject !== null) {
      res.redirect(urlObject.original_url);
    } else {
      res.json({ error: "No short URL found for the given input" });
    }
  });
});

/**
 * @endpoint POST /api/shorturl
 *
 * body needs to contain 'url'
 * if this url is already in the DB, return that object
 * if not, create a new object and return it
 * if the server doesn't respond to dns lookup, throw error
 */
app.post("/api/shorturl", (req, res) => {
  let { url } = req.body;
  let hostname = isValidHttpUrl(url);
  if (!hostname) res.json({ error: "Invalid URL" });
  else
    dns.lookup(hostname, (err, address, family) => {
      if (err) {
        console.error(err);
        res.json({ error: "Invalid Hostname" });
      } else {
        // check if there is already a DB entry with this url
        // let urlObject = getUrl(url, returnInput);
        let promise = ShortenedUrl.findOne({ original_url: url }).exec();
        assert.ok(promise instanceof Promise);
        promise.then((urlObject) => {
          if (urlObject !== null) {
            // if yes, return it
            res.json({
              original_url: urlObject.original_url,
              short_url: urlObject._id,
            });
          } else {
            // if no, create a new one and return that
            const newUrl = new ShortenedUrl({ original_url: url });
            newUrl.save((err) => {
              if (err) res.json({ Error: err });
              else
                res.json({
                  original_url: newUrl.original_url,
                  short_url: newUrl._id,
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
