//////////////////////////////////
// Reactionary API - Dave Barthly
// ===============================

// const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest(
//   (request, response) => {
//     response.send("Hello from boooooooo!");
//   }
// );

import * as functions from "firebase-functions";
import express from "express";
import axios from "axios";
import "./js/axios.config.mjs";
import remark from "remark";
import computeAST from "./js/convertdata.mjs";

const app = express();
const logError = err => console.log(err.response);
const makeRequest = async url =>
  (await axios.get(url).catch(logError)).data;
const extractMetadata = data =>
  data.slice(2, data.length).map(data => ({
    subject: data.name.slice(0, -3),
    raw_url: data.download_url,
    src: data.html_url
  }));

async function main(id = 1) {
  const fileURLsList = await makeRequest(axios.defaults.baseURL).then(
    extractMetadata
  );
  const file = fileURLsList[id - 1];
  const rawFile = await makeRequest(file.raw_url);
  file.AST = remark.parse(rawFile);
  console.log(computeAST(file));
  return computeAST(file);
}

// // main(Number(10)).catch(logError);
console.log("AYYYYY LMAOOOOOOOOOO");

app.get("/api/:id", async function(req, res) {
  const data = await main(Number(req.params.id)).catch(logError);
  res.set("Cache-Control", "public, max-age=300, s-maxage=5000");
  res.json(data);
});
// console.log(functions);

// export const helloWorld = functions.https.onRequest(
//   (request, response) => {
//     response.send("Hello from boooooooo!");
//   }
// );

app.get("/", async function(req, res) {
  res.json(":^)");
});
export const api = functions.https.onRequest(app);

// main().catch(logError);
// let a = functions.https.onRequest(app);
// let exports = {
//   api: functions.https.onRequest(app)
// };
// export const api = https.onRequest((request, response) => {
//   response.send("Hello from boooooooo!");
// });

// app.listen(3000, () => console.log("API listening on port 3000!"));

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
