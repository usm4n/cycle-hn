const {
    createConfig,
    defineConstants,
    env,
    entryPoint,
    setOutput,
    sourceMaps,
    addPlugins
} = require('@webpack-blocks/webpack2');
const devServer = require('@webpack-blocks/dev-server2');
const postcss = require('@webpack-blocks/postcss');
const sass = require('@webpack-blocks/sass');
const typescript = require('@webpack-blocks/typescript');
const tslint = require('@webpack-blocks/tslint');
const extractText = require('@webpack-blocks/extract-text2');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const SWPreCachePlugin = require('sw-precache-webpack-plugin');

const path = require('path');
const fs = require('fs');

const preprocessor = production => ({
    PRODUCTION: production,
    DEVELOPMENT: !production
});

const ifdef = (opts, block) => context => {
    let conf = block(context);
    conf.module.loaders[0].loaders.push(
        `ifdef-loader?json=${JSON.stringify(opts)}`
    );
    return conf;
};

const tsIfDef = production =>
    ifdef(
        preprocessor(production),
        typescript({
            useCache: true,
            cacheDirectory: 'node_modules/.cache/at-loader'
        })
    );

const appPath = (...names) => path.join(process.cwd(), ...names);

const customConfig = fs.existsSync(appPath('webpack.config.js'))
    ? require(appPath('webpack.config.js'))
    : {};

if (customConfig === undefined) {
    throw new Error(
        'The 3.0 update is a breaking release, you need to upgrade manually. Please refer to https://github.com/cyclejs-community/create-cycle-app-flavors#migrating'
    );
}

module.exports = createConfig([
    () => customConfig, //Include user config
    tslint(),
    sass(),
    postcss([autoprefixer({ browsers: ['last 2 versions'] })]),
    defineConstants({
        'process.env.NODE_ENV': process.env.NODE_ENV
    }),
    addPlugins([
        new HtmlWebpackPlugin({
            template: './index.ejs',
            inject: true,
            favicon: 'public/favicon.png',
            hash: true
        }),
        new webpack.ProvidePlugin({
            Snabbdom: 'snabbdom-pragma'
        })
    ]),
    env('development', [
        tsIfDef(false),
        devServer(),
        sourceMaps(),
        addPlugins([new webpack.NamedModulesPlugin()])
    ]),
    env('production', [
        tsIfDef(true),
        extractText('[name].[chunkhash:8].css', 'text/x-sass'),
        addPlugins([
            new CleanWebpackPlugin([appPath('build')], {
                root: process.cwd()
            }),
            new CopyWebpackPlugin([{ from: 'public', to: '' }]),
            new UglifyJsPlugin(),
            new SWPreCachePlugin({
                cacheId: 'cycle-hn',
                filename: 'service-worker.js',
                dontCacheBustUrlsMatching:/\.\w{8}\./,
                minify: true,
                staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
            })
        ])
    ]),
    env('test', [tsIfDef(true)])
]);
