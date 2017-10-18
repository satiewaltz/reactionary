const fs = require("fs");
require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
require("./axios.config.js");
const remarkAbstract = require("remark");
const remark = remarkAbstract();

// First we grab a URL list of all files fromm
// the repository with getFileURLs(). It returns an array
// of URLs that we can use to get data from each files.
//
// Next, we get the raw markdown file from each file in the repo
// then parse each file into an AST (Abstract Syntax Tree).
// Passing that into computeAST() will return a cleaned up
// object of the markdown file that is properly organized into
// an array of objects containing an entry of each resource:
// [{
// topic: 'Async programming with ES6',
// resources: {
//   title: 'Using ES6 JavaScript async/await'
//   link: "https://developer.mozilla.org.... | [Array] of links
//   description: 'Official documentation on using an async function."
// }]
//
/////////////////////////////////////////////////////////

const repoURL =
  "https://api.github.com/repos/markerikson/react-redux-links/contents";

const logError = err => console.log(err.response);
const makeRequest = async url =>
  (await axios.get(url).catch(logError)).data;

const mapSingleEntrys = children =>
  children.map(el => {
    const singleEntry = el.children[0].children;

    const description = singleEntry.reduce((acc, curr) => {
      if (curr.type == "text" || curr.type == "inlineCode") {
        acc += curr.value;
      }
      return acc;
    }, "");

    const link = singleEntry.reduce((acc, curr) => {
      if (curr.type == "link") {
        acc.push(curr.url);
      }
      return acc;
    }, []);

    return {
      title: singleEntry[0].children[0].value,
      ...(link.length > 1 ? { link } : { link: link[0] }),
      ...(description && {
        description
      })
    };
  });

const computeAST = (AST, src) => {
  console.log(src, "src");
  const lists = AST.children
    .filter(el => el.type == "list")
    .map(({ children }) => {
      return mapSingleEntrys(children);
    });

  let headings = AST.children
    .filter((el, i, arr) => {
      return arr[i + 1] != null && arr[i].type != arr[i + 1].type;
    })
    .filter(el => el.type == "heading" && el.children)
    .map(({ children }) => ({
      topic: children[0].value
    }));

  if (
    headings.length > 1 &&
    lists.length > 1 &&
    headings.length !== lists.length
  ) {
    headings = headings.slice(1);
  }

  // We lastly both parsed arrays
  // into one object as out final output.
  const output = headings.map((el, i) => ({
    ...el,
    resources: lists[i]
  }));

  console.log(output);
  return output;
};

const getFileURLs = async url => {
  const repoData = await makeRequest(url);
  return repoData.slice(2, repoData.length).map(data => ({
    raw_url: data.download_url,
    html_url: data.html_url
  }));
};

async function main(url, id = 1) {
  const fileURLsList = await getFileURLs(repoURL);
  const fileURLs = fileURLsList[id - 1];
  const mdData = await makeRequest(fileURLs.raw_url);
  const AST = remark.parse(mdData);

  return computeAST(AST, fileURLs.html_url);
}

// problem file list
// fileURLList[9], 4
// 10 & 3 => weird comaprison
main(repoURL, 10).catch(logError);

// ///////////////////////////////
// Express:
// app.get("/api/:id", async function(req, res) {
//   const data = await main(repoURL, Number(req.params.id)).catch(
//     logError
//   );
//   res.send(data);
// });

// app.listen(3000, function() {
//   console.log("App listening on port 3000!");
// });
