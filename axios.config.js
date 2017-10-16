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
    console.log(
      `REMAINING RESPONSES: ${response.headers[
        "x-ratelimit-remaining"
      ]}`
    );
    console.log("/////////////////////////");
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

module.exports = axios;
