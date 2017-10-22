import * as functions from "firebase-functions";
import config from "../.runtimeconfig.json";
import axios from "axios";

axios.defaults.baseURL =
  "https://api.github.com/repos/markerikson/react-redux-links/contents";

const token = config.github.token;

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

export default axios;
