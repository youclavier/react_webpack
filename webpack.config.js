const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const stylelint = require('stylelint');

const NpmInstallPlugin = require('npm-install-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
    app:    path.join(__dirname, 'app'),
    build:  path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {

    entry:  {
        app:    PATHS.app
    },

    resolve:    {
        extensions: ['', '.js', '.jsx']
    },

    output: {
        path: PATHS.build,
        filename:   'bundle.js'
    },

    module: {
        preLoaders: [
            {
              test: /\.css$/,
              loaders:  ['postcss'],
                include:    PATHS.app
            },
            {
                test:   /\.jsx?$/,
                loaders:    ['eslint'],
                include:    PATHS.app
            }
        ],


        loaders:    [
            {
                test:   /\.css$/,
                loaders:    ['style', 'css'],
                include:    PATHS.app
            },
            {
                test: /\.jsx?$/,
                loaders:    ['babel?cacheDirectory'],
                include:    PATHS.app
            }
        ]
    },
    
    postcss:    function () {
        return [stylelint({
            rules:  {
                'color-hex-case':   'lower'
            }
        })];
    }
};

if(TARGET === 'start' || !TARGET){
    module.exports = merge(common, {
        devServer: {
            contentBase:    PATHS.build,

            historyApiFallback: true,
            hot:    true,
            inline:  true,
            progress:   true,

            stats:  'errors-only',

            host:   process.env.HOST,
            port:   process.env.PORT
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new NpmInstallPlugin({
                save:   true
            })
        ],
        devtool:    'eval-source-map'

    });
}

if(TARGET === 'build') {
    module.exports = merge(common, {});
}