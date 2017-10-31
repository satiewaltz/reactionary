const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin = require("start-server-webpack-plugin");
const slsw = require("serverless-webpack");

const isDev = process.env.NODE_ENV == "dev";

module.exports = {
  target: "node",
  externals: [
    nodeExternals({
      importType: "commonjs",
      modulesDir: path.resolve("./node_modules")
    })
  ],

  entry: slsw.lib.entries,
  plugins: [ new webpack.NamedModulesPlugin() ],

  //////////////////////////////////////////////////////
  // Resolves imports - helps make importing less verbose
  resolve: {
    extensions: [ ".js", ".mjs" ], // resolves imports
    modules: [
      path.resolve(__dirname, "./src"),
      path.resolve("./node_modules")
    ]
  },

  //////////////////////////////////////
  // Modules Loaders
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        use: [ "babel-loader" ],
        exclude: [ path.resolve(__dirname, "./node_modules") ]
      }
    ]
  }
};
