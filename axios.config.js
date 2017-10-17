const axios = require("axios");

axios.interceptors.request.use(
  config => {
    const token = process.env.TOKEN;
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

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
