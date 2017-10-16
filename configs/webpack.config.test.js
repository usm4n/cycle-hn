const config = require('./webpack.config.js');
const nodeExternals = require('webpack-node-externals');

module.exports = Object.assign({}, config, {
    target: 'node',
    devtool: 'inline-source-map',
    externals: [nodeExternals()],
    plugins: config.plugins.filter(p => !(p.options && p.options.template)), //Exclude HtmlWebpackPlugin
    module: Object.assign({}, config.module, {
        loaders: config.module.loaders.map(l => {
            if (
                l.loaders &&
                l.loaders.reduce(
                    (acc, curr) =>
                        acc || /awesome-typescript-loader.*/.test(curr),
                    false
                )
            ) {
                return Object.assign({}, l, {
                    loaders: l.loaders
                        .filter(e => !/awesome-typescript-loader.*/.test(e))
                        .concat([
                            'awesome-typescript-loader?' +
                                JSON.stringify({
                                    useBabel: true,
                                    babelOptions: {
                                        env: {
                                            test: {
                                                plugins: ['istanbul']
                                            }
                                        }
                                    },
                                    useCache: true,
                                    cacheDirectory:
                                        'node_modules/.cache/at-loader'
                                })
                        ])
                });
            }
            return l;
        })
    })
});
