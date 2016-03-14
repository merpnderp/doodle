var path = require('path');
var webpack = require('webpack');

var plugin = new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
})

module.exports = {
    plugins: [plugin],
    entry: {app:'./src/app.js'},
    output: {path: __dirname, filename: './build/[name].js'},
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query:{
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}