import http from "http";
import express from "express";
import app from "./server";
import awsServerlessExpress from "aws-serverless-express";
import { main, logError } from "./lambda";

if (process.env.NODE_ENV == "dev") {
  let currentApp = app;
  const devServer = http.createServer(app);
  const logMsg =
    "!!! ===== Server listening on port 3000 ===== !!!\n";

  devServer.listen(3000, () => console.log(logMsg));

  if (module.hot) {
    module.hot.accept([ "./index" ], () => {
      devServer.removeListener("request", currentApp);
      devServer.on("request", app);
      currentApp = app;
    });
  }

  main(Number(10)).catch(logError);
}

const server = awsServerlessExpress.createServer(app);
export const handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);

/////////////////////////////////////////////////////////
// Reactionary API - Dave Barthly
// ======================================================
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
/////////////////////////////////////////////////////////
