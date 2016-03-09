module.exports = {
    entry: "./src/i18n",
    output: {
        path: `${__dirname}/dist`,
        libraryTarget: "umd",
        library: "i18n",
        filename: "i18n.js",
        umdNamedDefine: true
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    }
};
