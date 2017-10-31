# Reactionary API 
> *A serverless RESTful API built for accessing Mark Erikson's [react-redux-links](https://github.com/markerikson/react-redux-links) collection.*

### Overview

First we grab a URL list of all files fromm
the repository with `getFileURLs()`. It returns an array
of URLs that we can use to get data from each files.

Next, we get the raw markdown file from each file in the repo
then parse each file into an AST (Abstract Syntax Tree).
Passing that into `computeAST()` will return a cleaned up
object of the markdown file that is properly organized into
an array of objects containing an entry of each resource:
```json
{
  topic: "Async programming with ES6",
  resources: [
    {
      title: "Using ES6 JavaScript async/await",
      link: "https://developer.mozilla.org.... | [Array] of links
      description: 'Official documentation on using an async function."
    }, {...}, {...}, ...
  ]
}
```

---

### Built With
- Express
- Serverless | AWS Lambda
- Webpack

### Getting Started
First create a `.env` file on the top level directory 
with your GitHub personal access token:
```
TOKEN=1234567890
```

Fire up the express server and open `http://localhost:3000`.
```shell
yarn start
```
---
### Licensing

[MIT](https://opensource.org/licenses/mit-license.php)

*Created by Dave Barthly*
