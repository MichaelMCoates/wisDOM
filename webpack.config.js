const path = require('path');
module.exports = {
  context: __dirname,
  entry: './lib/main.js',
  output: {
    path: path.resolve(__dirname),
    filename: './lib/wisDOM.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '*']
  },
  devtool: 'source-maps',
};
