# Reactionary API 
>*A serverless RESTful API built for accessing Mark Erikson's [react-redux-links](https://github.com/markerikson/react-redux-links) collection.*

*Try it out:* `curl -l https://api.theweb.rocks/ | python -m json.tool`

### Endpoints
Collection of all files including some metadata:
`https://api.theweb.rocks`

Resources and links from a single file:
`https://api.theweb.rocks/:id` 

*ID is a number starting from 1. (Ex. `/1` returns the "basic concepts" file.)*

### Overview

First we grab a URL list of all files fromm
the repository with `getFileURLs()`. It returns an array
of URLs that we can use to get data from each files.

Next, we get the raw markdown file from each file in the repo
then parse each file into an AST (Abstract Syntax Tree).
Passing that into `computeAST()` will return a cleaned up
object of the markdown file that is properly organized into
an array of objects containing an entry of each resource:

<p align="center">
  <img src="./assets/sample.png" alt="Sample response from API"/>
</p>

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
