import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

axios.defaults.baseURL =
  "https://api.github.com/repos/markerikson/react-redux-links/contents";

const token = process.env.TOKEN;

axios.defaults.headers.common["Authorization"] = token
  ? `Bearer ${token}`
  : null;

axios.interceptors.response.use(
  response => {
    if (process.env.NODE_ENV == "dev") {
      let msg = "// GitHub Response Success! /////////////////";
      if (response.headers["x-ratelimit-remaining"]) {
        console.log(
          `\nGitHub REMAINING REQS: ${response.headers[
            "x-ratelimit-remaining"
          ]}`
        );
      } else {
        msg += "\n";
      }
      console.log(msg);
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;
