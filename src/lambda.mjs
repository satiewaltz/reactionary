import axios from "axios";
import "./js/axios.config.mjs";
import remark from "remark";
import computeAST from "./js/convertdata.mjs";

export const logError = err => console.log(err.response);
const makeRequest = async url =>
  (await axios.get(url).catch(logError)).data;
const extractMetadata = data =>
  data.slice(2, data.length).map(data => ({
    subject: data.name.slice(0, -3),
    raw_url: data.download_url,
    src: data.html_url
  }));

export async function main(id = 1) {
  const fileURLsList = await makeRequest().then(extractMetadata);
  const file = fileURLsList[id - 1];
  console.log("ayyaaaaaaaaaayy");
  const rawFile = await makeRequest(file.raw_url);
  file.AST = remark.parse(rawFile);
  console.log(computeAST(file));
  return computeAST(file);
}
