const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  cache: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./build/"),
    filename: "js/[name].js",
    publicPath: "/"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      hash: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-react",
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: [
                    "last 2 Chrome versions",
                    "last 2 ChromeAndroid versions",
                    "last 2 Firefox versions",
                    "last 2 FirefoxAndroid versions",
                    "last 1 Safari versions",
                    "last 1 iOS versions",
                    "last 1 Edge versions",
                    "last 1 IE versions"
                  ]
                }
              }
            ]
          ],
          plugins: [
            "transform-class-properties",
            "transform-es2015-modules-commonjs"
          ]
        },
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: "html-loader"
      }
    ]
  },
  devServer: {
    host: "0.0.0.0",
    disableHostCheck: true,
    /**
    Dev enviroment solution to routing -- better to user HashRouter or Server side routing
    */
    historyApiFallback: true,
    contentBase: "./",
    hot: true
  }
};
