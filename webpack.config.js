const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "node",
  externals: [
    nodeExternals({
      importType: "commonjs",
      modulesDir: path.resolve("./src/node_modules")
    })
  ], // in order to ignore all modules in node_modules folder

  context: path.resolve(__dirname, "src"),
  entry: {
    "src/index": "./index.mjs"
  },
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
    modules: [
      path.resolve(__dirname, "./src"),
      path.resolve("./src/node_modules")
    ]
  },

  //////////////////////////////////////
  // Modules Loaders
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        use: [ "babel-loader" ],
        exclude: [ path.resolve(__dirname, "./src/node_modules") ]
      }
    ]
  },

  ////////////////////////////////////////////
  // Plugins
  plugins: [ new CopyWebpackPlugin([ { from: "package.json" } ]) ]
};
