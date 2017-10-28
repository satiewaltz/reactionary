import axios from "axios";
import "./js/axios.config.mjs";
import remark from "remark";
import computeAST from "./js/convertdata.mjs";

export const logError = err => console.error(err.response);

const makeRequest = async url =>
  (await axios.get(url).catch(logError)).data;

const extractMetadata = data =>
  data.slice(2, data.length).map(data => ({
    subject: data.name.slice(0, -3),
    raw_url: data.download_url,
    src: data.html_url
  }));

export async function getSubject(id = 1) {
  id = Number(id);
  const fileURLsList = await makeRequest().then(extractMetadata);
  const file = fileURLsList[id - 1];
  const rawFile = await makeRequest(file.raw_url);
  file.AST = remark.parse(rawFile);
  console.log(computeAST(file));
  return computeAST(file);
}

export async function getAllSubjects(req) {
  const fullUrl =
    req.protocol + "://" + req.get("host") + req.originalUrl;
  const subjects = await makeRequest().then(extractMetadata);
  subjects.forEach((el, i) => (el.parsed = fullUrl + String(i + 1)));
  return {
    info: `react-redux-links API by Dave Barthly`,
    curator: `Mark Erikson`,
    community: `https://www.reactiflux.com/`,
    repository: `https://github.com/markerikson/react-redux-links`,
    subjects
  };
}
