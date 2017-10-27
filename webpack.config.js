const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin = require("start-server-webpack-plugin");

const isDev = process.env.NODE_ENV == "dev";

module.exports = {
  target: "node",
  externals: [
    nodeExternals({
      importType: "commonjs",
      modulesDir: path.resolve("./node_modules")
    })
  ], // in order to ignore all modules in node_modules folder

  context: path.resolve(__dirname, "src"),
  devServer: initDevServer(),
  entry: getEntries(),
  plugins: getPlugins(),
  output: {
    path: path.resolve(__dirname, "./dist/"),
    filename: "src/lambda.js",
    libraryTarget: "commonjs",
    publicPath: path.resolve(__dirname, "./dist/"),
    pathinfo: isDev
  },

  //////////////////////////////////////////////////////
  // Resolves imports - helps make importing less verbose
  resolve: {
    mainFiles: [ "index", "module", "main" ],
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

function getPlugins() {
  let plugins = [];

  if (isDev) {
    plugins = plugins.concat([
      new StartServerPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]);
  }

  return plugins;
}

function getEntries() {
  let entries = [];

  if (isDev) {
    entries = entries.concat([
      "webpack-dev-server/client?http://0.0.0.0:3000",
      "webpack/hot/only-dev-server",
      "./index.mjs"
    ]);
  } else {
    entries = "./index.mjs";
  }

  return entries;
}

function initDevServer() {
  let devConfig = {};

  if (isDev) {
    devConfig = {
      host: "0.0.0.0",
      hot: true,
      inline: true,
      compress: true,
      historyApiFallback: true,
      disableHostCheck: true,
      contentBase: false
    };
  }

  return devConfig;
}
