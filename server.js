require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");

axios.interceptors.request.use(
  config => {
    const token = process.env.TOKEN;
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

const remainingReq = res => {
  console.log(
    `REMAINING RESPONSES: ${res.headers["x-ratelimit-remaining"]}`
  );
  console.log("/////////////////////////");
  return res;
};

const logError = err => console.log(err.response.data);

async function getData() {
  const url =
    "https://api.github.com/repos/markerikson/react-redux-links/contents";
  return axios
    .get(url)
    .then(remainingReq)
    .catch(logError);
}

async function main() {
  const repoData = await getData();
  const filtered = repoData.data
    .slice(2, repoData.data.length)
    .map(obj => {
      const urlObj = {};
      urlObj.url = obj.git_url;
      return urlObj;
    });

  console.log(filtered);
  return filtered;
}

main();
