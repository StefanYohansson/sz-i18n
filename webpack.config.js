module.exports = {
    entry: "./src/i18n",
    output: {
        path: `${__dirname}/dist`,
        libraryTarget: "var",
        library: "i18n",
        filename: "i18n.js"
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    }
};
