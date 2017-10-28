const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin = require("start-server-webpack-plugin");

module.exports = {
  // node: {
  //   fs: "empty",
  //   net: "empty"
  // },

  externals: [
    nodeExternals({
      importType: "commonjs",
      modulesDir: path.resolve("./node_modules")
    })
  ], // in order to ignore all modules in node_modules folder

  context: path.resolve(__dirname, "src"),

  entry: [
    "webpack-dev-server/client?http://0.0.0.0:8080",
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    "webpack/hot/only-dev-server",
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    "./index.mjs"
    // the entry point of our app
  ],

  ////////////////////////////////////////////
  // Output
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./bundle.js",
    pathinfo: true
  },

  //////////////////////////////////////////////////////
  // Resolves imports - helps make importing less verbose
  resolve: {
    mainFields: [ "browser", "module", "main" ],
    extensions: [ ".mjs", ".js" ], // resolves imports
    modules: [
      path.resolve("./src"),
      path.resolve("./node_modules"),
      path.resolve("./src/components")
    ]
  },

  //////////////////////////////////////
  // Modules Loaders
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        use: [ "babel-loader" ],
        include: path.join(__dirname, "src")
      },
      { parser: { amd: false } }
    ]
  },

  ////////////////////////////////////////////
  // Plugins
  plugins: [
    // enable HMR globally - enables hot command
    new webpack.HotModuleReplacementPlugin(),

    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
    new StartServerPlugin()
  ],

  ////////////////////////////////////////////
  // This is the config for webpack-dev-server
  devServer: {
    // Load content from bundle
    hot: true,
    inline: true,
    compress: true,
    historyApiFallback: true,
    host: "0.0.0.0",
    disableHostCheck: true,
    // open: true
    ///// These options are commented out unless we need
    ///// to generate HTML on the fly.
    contentBase: path.resolve(__dirname, "dist")

    // should always point to a index.html
    // publicPath: '/' // should always match output dir
  },
  ////////////////////////////////////////////
  devtool: "cheap-module-eval-source-map"
};
