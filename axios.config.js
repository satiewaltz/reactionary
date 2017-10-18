const axios = require("axios");

const token = process.env.TOKEN;
axios.defaults.headers.common["Authorization"] = token
  ? `Bearer ${token}`
  : null;

axios.interceptors.response.use(
  response => {
    let msg = "// GitHub Response Success! /////////////////";
    if (response.headers["x-ratelimit-remaining"]) {
      console.log(
        `GitHub REMAINING REQS: ${response.headers[
          "x-ratelimit-remaining"
        ]}`
      );
    } else {
      msg += "\n";
    }
    console.log(msg);
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

module.exports = axios;
