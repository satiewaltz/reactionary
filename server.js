require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");
require("./axios.config.js");

const url =
  "https://api.github.com/repos/markerikson/react-redux-links/contents";

const logError = err => console.log(err.response);
const getData = async url =>
  (await axios.get(url).catch(logError)).data;

async function main(url) {
  const repoData = await getData(url);
  const filtered = repoData
    .slice(2, repoData.length)
    .map(obj => obj.download_url);

  const fileData = await getData(filtered[3]);

  console.log(fileData);
  return filtered;
}

main(url);
