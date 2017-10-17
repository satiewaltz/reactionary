const fs = require("fs");
require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
require("./axios.config.js");
const parse = require("markdown-to-ast").parse;

const url =
  "https://api.github.com/repos/markerikson/react-redux-links/contents";

const logError = err => console.log(err.response);
const getData = async url =>
  (await axios.get(url).catch(logError)).data;

async function main(url) {
  const repoData = await getData(url);
  const filterRepo = repoData
    .slice(2, repoData.length)
    .map(obj => obj.download_url);

  const fileData = await getData(filterRepo[3]);
  const AST = parse(fileData);
  console.log(AST);
}

main(url);
