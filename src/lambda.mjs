import axios from "axios";
import "./js/axios.config.mjs";
import remark from "remark";
import computeAST from "./js/convertdata.mjs";

export const logError = err => console.error(err.response);

const makeRequest = async url =>
  (await axios.get(url).catch(logError)).data;

const extractMetadata = (data, url) =>
  data.slice(2, data.length).map((data, i) => ({
    subject: data.name.slice(0, -3),
    contents: url ? url + String(i + 1) : null,
    src: data.html_url,
    raw_url: data.download_url
  }));

export async function getSubject(id = 1) {
  id = Number(id);
  const fileURLsList = await makeRequest().then(extractMetadata);

  if (id < fileURLsList.length) {
    const file = fileURLsList[id - 1];
    const rawFile = await makeRequest(file.raw_url);
    file.AST = remark.parse(rawFile);

    console.log(computeAST(file));
    return computeAST(file);
  } else {
    return {
      code: "404",
      message: `The resource for that id does not exist. Try an id from /1 to /${fileURLsList.length}.`
    };
  }
}

export async function getAllSubjects(req) {
  const url =
    req.protocol + "://" + req.get("host") + req.originalUrl;

  const subjects = await makeRequest().then(data =>
    extractMetadata(data, url)
  );

  return {
    code: "200",
    info: `react-redux-links API by Dave Barthly`,
    curator: `Mark Erikson`,
    community: `https://www.reactiflux.com/`,
    repository: `https://github.com/markerikson/react-redux-links`,
    subjects
  };
}
