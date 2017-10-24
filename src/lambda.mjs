/////////////////////////////////////////////////////////
// Reactionary API - Dave Barthly
// ======================================================
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

import express from "express";
import axios from "axios";
import "./js/axios.config.mjs";
import remark from "remark";
import computeAST from "./js/convertdata.mjs";
import awsServerlessExpress from "aws-serverless-express";

const app = express();

const logError = err => console.log(err.response.data);
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

if (process.env.NODE_ENV == "dev") {
  main(Number(10)).catch(logError);
}

app.get("/:id", async function(req, res) {
  const data = await main(Number(req.params.id)).catch(logError);
  console.log(data);
  res.set("Cache-Control", "public, max-age=300, s-maxage=5000");
  res.json(data);
});

app.get("/", async function(req, res) {
  res.send(
    "Reactionary API by Dave Barthly. Send a request to /api/{#id} to get a resource."
  );
});

const server = awsServerlessExpress.createServer(app);
export const handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);
