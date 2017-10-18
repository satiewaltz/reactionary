const fs = require("fs");
require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
require("./axios.config.js");
const remarkAbstract = require("remark");
const remark = remarkAbstract();

async function main(url, id = 1) {
  const fileURLsList = await getFileURLs(repoURL);
  const file = fileURLsList[id - 1];
  const mdData = await makeRequest(file.raw_url);
  file.AST = remark.parse(mdData);

  console.log(computeAST(file));
  return computeAST(file);
}

// main(repoURL, Number(10)).catch(logError);

/////////////////////////////////////////////////////////
// // Express:
app.get("/api/:id", async function(req, res) {
  const data = await main(repoURL, Number(req.params.id)).catch(
    logError
  );
  res.send(data);
});

app.listen(3000, function() {
  console.log("API listening on port 3000!");
});

/////////////////////////////////////////////////////////
// Reactionary API - Dave Barthly
// ------------------------------
// Program flow:
//
// First we grab a URL list of all files fromm
// the repository with getFileURLs(). It returns an array
// of URLs that we can use to get data from each files.
//
// Next, we get the raw markdown file from each file in the repo
// then parse each file into an AST (Abstract Syntax Tree).
// Passing that into computeAST() will return a cleaned up
// object of the markdown file that is properly organized into
// an array of objects containing an entry of each resource:
//
// {
//   topic: 'Async programming with ES6',
//   resources: [{
//     title: 'Using ES6 JavaScript async/await'
//     link: "https://developer.mozilla.org.... | [Array] of links
//     description: 'Official documentation on using an async function."
//   }]
// }
//
/////////////////////////////////////////////////////////

const repoURL =
  "https://api.github.com/repos/markerikson/react-redux-links/contents";

const logError = err => console.log(err.response);
const makeRequest = async url =>
  (await axios.get(url).catch(logError)).data;

const getFileURLs = async url => {
  const repoData = await makeRequest(url);
  return repoData.slice(2, repoData.length).map(data => ({
    subject: data.name.slice(0, -3),
    raw_url: data.download_url,
    src: data.html_url
  }));
};

/////////////////////////////////////////////////////////

const mapSingleEntrys = children =>
  // mapSingleEntrys() iterates over each child
  // and builds a simplifed object contiaining
  // only neccessary information.
  children.map(el => {
    const singleEntry = el.children[0].children;

    const description = singleEntry.reduce((acc, curr) => {
      if (curr.type == "text" || curr.type == "inlineCode")
        acc += curr.value;
      return acc;
    }, "");

    const link = singleEntry.reduce((acc, curr) => {
      if (curr.type == "link") acc = [ ...acc, curr.url ];
      return acc;
    }, []);

    // Here we return an array of links, or if there
    // is only one link - just the link itself.
    // And a description if one exists.
    // The 'title' just denote this child's heading.
    return {
      title: singleEntry[0].children[0].value,
      ...(link.length > 1 ? { link } : { link: link[0] }),
      ...(description && { description })
    };
  });

const computeAST = ({ subject, src, AST }) => {
  // We first filter out all children only for
  // lists - than we map each children
  // for only the data we want. (A title, a link, and a description.)
  const lists = AST.children
    .filter(el => el.type == "list")
    .map(({ children }) => mapSingleEntrys(children));

  // This first removes any duplicate headings so we can
  // mix this array with the list array on a 1:1 ratio.
  // Then it fitlers only headings with children and
  // returns only each heading's text. (Which is all we care about).
  let headings = AST.children
    .filter((el, i, arr) => {
      return arr[i + 1] != null && arr[i].type != arr[i + 1].type;
    })
    .filter(el => el.type == "heading" && el.children)
    .map(({ children }) => ({ topic: children[0].value }));

  // Sometimes there is an extra heading at the top
  // of a file that is sums up what the file is about.
  // We remove this since an unequal # of headings and lists
  // arrays will cause some headings to not have child
  // when we combine them into the final output.
  if (
    headings.length > 1 &&
    lists.length > 1 &&
    headings.length !== lists.length
  ) {
    headings = headings.slice(1);
  }

  // We lastly both parsed arrays
  // into one object as out final output.
  const content = headings.map((el, i) => ({
    ...el,
    resources: lists[i]
  }));

  return { subject, src, content };
};
