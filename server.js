require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");

var github = require("octonode");

var client = github.client();

var ghrepo = client.repo("markerikson/react-redux-links");

ghrepo.contents("", "master", function(err, data, headers) {
  let filteredRepoFiles = data.slice(2, data.length);
});

const PORT = 4000;
app.listen(PORT);
console.log(`Listening on https://localhost:${PORT} ...`);
