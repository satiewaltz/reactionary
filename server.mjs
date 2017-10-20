//////////////////////////////////
// Reactionary API - Dave Barthly
// ===============================
import fs from "fs";
import express from "express";
import axios from "axios";
import { logError, makeRequest } from "./js/axios.config.mjs";
import { computeAST, extractMetadata } from "./js/convertdata.mjs";
import remark from "remark";

const app = express();
axios.defaults.baseURL =
  "https://api.github.com/repos/markerikson/react-redux-links/contents";

async function main(id = 1) {
  const fileURLsList = await makeRequest().then(extractMetadata);
  const file = fileURLsList[id - 1];
  const rawFile = await makeRequest(file.raw_url);
  file.AST = remark.parse(rawFile);

  // console.log(computeAST(file));
  return computeAST(file);
}

// main(Number(10)).catch(logError);
app.get("/api/:id", async function(req, res) {
  const data = await main(Number(req.params.id)).catch(logError);
  res.json(data);
});
app.listen(3000, () => console.log("API listening on port 3000!"));

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
