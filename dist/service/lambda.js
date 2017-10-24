(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = undefined;

let main = (() => {
  var _ref2 = _asyncToGenerator(function* (id = 1) {
    const fileURLsList = yield makeRequest(_axios2.default.defaults.baseURL).then(extractMetadata);
    const file = fileURLsList[id - 1];
    const rawFile = yield makeRequest(file.raw_url);
    file.AST = _remark2.default.parse(rawFile);
    console.log((0, _convertdata2.default)(file));
    return (0, _convertdata2.default)(file);
  });

  return function main() {
    return _ref2.apply(this, arguments);
  };
})();

// // main(Number(10)).catch(logError);

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _axios = __webpack_require__(0);

var _axios2 = _interopRequireDefault(_axios);

__webpack_require__(3);

var _remark = __webpack_require__(4);

var _remark2 = _interopRequireDefault(_remark);

var _convertdata = __webpack_require__(5);

var _convertdata2 = _interopRequireDefault(_convertdata);

var _awsServerlessExpress = __webpack_require__(6);

var _awsServerlessExpress2 = _interopRequireDefault(_awsServerlessExpress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /////////////////////////////////////////////////////////
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

const app = (0, _express2.default)();

const logError = err => console.log(err.response);
const makeRequest = (() => {
  var _ref = _asyncToGenerator(function* (url) {
    return (yield _axios2.default.get(url).catch(logError)).data;
  });

  return function makeRequest(_x) {
    return _ref.apply(this, arguments);
  };
})();
const extractMetadata = data => data.slice(2, data.length).map(data => ({
  subject: data.name.slice(0, -3),
  raw_url: data.download_url,
  src: data.html_url
}));

app.get("/:id", (() => {
  var _ref3 = _asyncToGenerator(function* (req, res) {
    const data = yield main(Number(req.params.id)).catch(logError);
    console.log(data);
    res.set("Cache-Control", "public, max-age=300, s-maxage=5000");
    res.json(data);
  });

  return function (_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
})());

app.get("/", (() => {
  var _ref4 = _asyncToGenerator(function* (req, res) {
    res.send("Reactionary API by Dave Barthly. Send a request to /api/{#id} to get a resource.");
  });

  return function (_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
})());

const handler = exports.handler = _awsServerlessExpress2.default.createServer(app);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = __webpack_require__(0);

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_axios2.default.defaults.baseURL = "https://api.github.com/repos/markerikson/react-redux-links/contents";

const token = functions.config().github.token;

_axios2.default.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : null;

_axios2.default.interceptors.response.use(response => {
  let msg = "// GitHub Response Success! /////////////////";
  if (response.headers["x-ratelimit-remaining"]) {
    console.log(`GitHub REMAINING REQS: ${response.headers["x-ratelimit-remaining"]}`);
  } else {
    msg += "\n";
  }
  console.log(msg);
  return response;
}, error => {
  return Promise.reject(error);
});

exports.default = _axios2.default;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("remark");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = computeAST;
// mapSingleEntrys() iterates over each child
// and builds a simplifed object contiaining
// only neccessary information.
const mapSingleEntrys = children => children.map(el => {
  const singleEntry = el.children[0].children;

  const description = singleEntry.reduce((acc, curr) => {
    if (curr.type == "text" || curr.type == "inlineCode") acc += curr.value;
    return acc;
  }, "");

  const link = singleEntry.reduce((acc, curr) => {
    if (curr.type == "link") acc = [...acc, curr.url];
    return acc;
  }, []);

  // Here we return an array of links, or if there
  // is only one link - just the link itself.
  // And a description if one exists.
  // The 'title' just denote this child's heading.
  return _extends({
    title: singleEntry[0].children[0].value
  }, link.length > 1 ? { link } : { link: link[0] }, description && { description });
});

function computeAST({ subject, src, AST }) {
  // We first filter out all children only for
  // lists - than we map each children
  // for only the data we want. (A title, a link, and a description.)
  const lists = AST.children.filter(el => el.type == "list").map(({ children }) => mapSingleEntrys(children));

  // This first removes any duplicate headings so we can
  // mix this array with the list array on a 1:1 ratio.
  // Then it fitlers only headings with children and
  // returns only each heading's text. (Which is all we care about).
  const headings = AST.children.filter((el, i, arr) => {
    // Remove adjcent headings from array
    return arr[i + 1] != null && arr[i].type != arr[i + 1].type;
  }).filter(el => el.type == "heading" && el.children).filter((el, index, headingsArr) => {
    // Sometimes there is an extra heading at the top
    // of a file that is sums up what the file is about.
    // We remove this since an unequal # of headings and lists
    // arrays will cause some headings to not have child
    // when we combine them into the final output.
    if (headingsArr.length > 1 && lists.length > 1 && headingsArr.length !== lists.length && index === 0) {
      return false;
    } else {
      return true;
    }
  }).map(({ children }) => ({ topic: children[0].value }));

  const content = headings.map((topic, i) => _extends({}, topic, {
    resources: lists[i]
  }));

  return { subject, src, content };
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("aws-serverless-express");

/***/ })
/******/ ])));