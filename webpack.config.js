const path = require('path');

const appPath = (...names) => path.join(process.cwd(), ...names);

//This will be merged with the config from the flavor
module.exports = {
    entry: {
        main: [appPath('src', 'index.ts'), appPath('src', 'css', 'styles.scss')]
    },
    output: {
        filename: 'bundle.[hash].js',
        path: appPath('build')
    }
};
