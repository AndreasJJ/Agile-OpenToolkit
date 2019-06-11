var path = require('path');
const webpack = require('webpack');
const config = {
        devtool: 'eval-source-map',
 entry: ['babel-polyfill', __dirname + '/src/index.jsx'],
 output:{
  path: path.resolve(__dirname, "public"),
  filename: 'bundle.js',
},
plugins: [
  new webpack.HotModuleReplacementPlugin()
],
devServer: {
  contentBase:  __dirname + '/public',
  index: 'index.html',
  historyApiFallback: true,
  hot: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Acccess-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
  }
},
 resolve: {
  extensions: ['.js','.jsx','.css', '.png', '.jpg', '.gif']
 },
 module: {
  rules: [
    {
      test: /\.jsx?/,
      exclude: /node_modules/,
      use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              require('@babel/plugin-proposal-class-properties'),
              require('@babel/plugin-proposal-object-rest-spread'),
              require('@babel/plugin-transform-destructuring'),
              require('@babel/plugin-proposal-function-bind')
            ]
          }
      }
    },
    {
      test: /\.(png|jp(e*)g|svg|gif)$/,  
      use: [{
          loader: 'url-loader',
          options: { 
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[hash]-[name].[ext]'
          } 
      }]
    }
  ]
 }
};
module.exports = config;