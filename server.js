const fs = require("fs");
require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
require("./axios.config.js");
const remarkAbstract = require("remark");
const remark = remarkAbstract();

const url =
  "https://api.github.com/repos/markerikson/react-redux-links/contents";

const logError = err => console.log(err.response);
const getData = async url =>
  (await axios.get(url).catch(logError)).data;

const computeAST = AST => {
  const lists = AST.children
    .filter(el => el.type !== "heading")
    .map(({ children }) => ({ list: children }));

  const headings = AST.children
    .filter(el => el.type === "heading" && el.depth >= 4)
    .map(({ children }) => ({ heading: children[0].value }));

  const output = headings.map((el, i) => ({
    ...el,
    list: lists[i].list
  }));
  console.log(output);
  return output;
};

async function main(url) {
  const repoData = await getData(url);
  const filterRepo = repoData
    .slice(2, repoData.length)
    .map(obj => obj.download_url);

  const fileData = await getData(filterRepo[3]);
  const AST = remark.parse(fileData);

  return computeAST(AST);
}

main(url);
