//////////////////////////////////
// Reactionary API - Dave Barthly
// ===============================

const functions = require("firebase-functions");
const express = require("express");
const app = express();
const axios = require("axios");
require("./js/axios.config.js");
const remark = require("remark")();
const {
  computeAST,
  extractMetadata
} = require("./js/convertdata.js");

const logError = err => console.log(err.response);
const makeRequest = async url =>
  (await axios.get(url).catch(logError)).data;

async function main(id = 1) {
  const fileURLsList = await makeRequest(axios.defaults.baseURL).then(
    extractMetadata
  );
  const file = fileURLsList[id - 1];
  const rawFile = await makeRequest(file.raw_url);
  file.AST = remark.parse(rawFile);
  // console.log(computeAST(file));
  return computeAST(file);
}

// main(Number(10)).catch(logError);

app.get("/api/:id", async function(req, res) {
  const data = await main(Number(req.params.id)).catch(logError);
  res.set("Cache-Control", "public, max-age=300, s-maxage=5000");
  res.json(data);
});
// app.listen(3000, () => console.log("API listening on port 3000!"));

exports.app = functions.https.onRequest(app);

/////////////////////////////////////////////////////////
// Program flow:
//
// First we grab a URL list of all files fromm
// the repository with getFileURLs(). It returns an array
// of URLs that we can use to get data from each files.
//
// Next, we get the raw markdown file from each file in the repo
// then parse each file into an AST (Abstract Syntax Tree).
// Passing that into computeAST() will return a cleaned up
// object of the markdown file that is properly organized into
// an array of objects containing an entry of each resource:
//
// {
//   topic: 'Async programming with ES6',
//   resources: [{
//     title: 'Using ES6 JavaScript async/await'
//     link: "https://developer.mozilla.org.... | [Array] of links
//     description: 'Official documentation on using an async function."
//   }]
// }
/////////////////////////////////////////////////////////
