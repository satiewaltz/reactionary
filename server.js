const fs = require("fs");
require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
require("./axios.config.js");
const remarkAbstract = require("remark");
const remark = remarkAbstract();

const repoURL =
  "https://api.github.com/repos/markerikson/react-redux-links/contents";

const logError = err => console.log(err.response);
const getData = async url =>
  (await axios.get(url).catch(logError)).data;

const mapSingleEntrys = children =>
  children.map(el => {
    const singleEntry = el.children[0].children;

    return {
      topic: singleEntry[0].children[0].value,
      link: singleEntry[2].url,
      description: singleEntry[4].value
    };
  });

const computeAST = AST => {
  const lists = AST.children
    .filter(el => el.type !== "heading")
    .map(({ children }) => mapSingleEntrys(children));

  const headings = AST.children
    .filter(el => el.type === "heading" && el.depth >= 4)
    .map(({ children }) => ({ heading: children[0].value }));

  const output = headings.map((el, i) => ({
    ...el,
    list: lists[i]
  }));

  return output;
};

const getFileURLs = async url => {
  const repoData = await getData(url);
  return repoData
    .slice(2, repoData.length)
    .map(obj => obj.download_url);
};

async function main(url, id) {
  const fileURLList = await getFileURLs(repoURL);
  const mdData = await getData(fileURLList[id - 1]);
  const AST = remark.parse(mdData);

  return computeAST(AST);
}

app.get("/api/:id", async function(req, res) {
  const data = await main(repoURL, req.params.id).catch(logError);
  res.send(data);
});

app.listen(3000, function() {
  console.log("App listening on port 3000!");
});
