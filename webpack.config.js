const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "node",
  externals: [ nodeExternals() ],
  devtool: "source-map",

  context: path.resolve(__dirname, "src"),
  entry: { "src/index": "./index.mjs" },
  output: {
    path: path.resolve(__dirname, "./functions/"),
    filename: "./index.js",
    libraryTarget: "this"
  },

  //////////////////////////////////////////////////////
  // Resolves imports - helps make importing less verbose
  resolve: {
    mainFiles: [ "index" ],
    extensions: [ ".js", ".mjs" ], // resolves imports
    modules: [ path.resolve("./src"), path.resolve("./node_modules") ]
  },

  //////////////////////////////////////
  // Modules Loaders
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        use: [ "babel-loader" ],
        include: path.join(__dirname, "src")
      }
    ]
  },

  ////////////////////////////////////////////
  // Plugins

  plugins: [ new CopyWebpackPlugin([ { from: "package.json" } ]) ]
};
