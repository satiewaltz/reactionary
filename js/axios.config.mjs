import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

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

export const logError = err => console.log(err.response);
export const makeRequest = async url =>
  (await axios.get(url).catch(logError)).data;

export default axios;
