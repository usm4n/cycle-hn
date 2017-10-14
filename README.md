## Your amazing project

Thanks for using the `one-fits-all` flavor.

### Using your app

Run in development mode: `npm start`
Build a production build: `npm run build`
Run the unit tests: `npm test`

### Extending the configuration

If you want to add custom config to babel or webpack, you can now do it! Just add a `.babelrc` or `webpack.config.js` respectively to your app root directory. The `webpack.config.js` just has to export a partial webpack config. It will be merged with the default config.

Example: Adding the progress bar plugin:
```javascript
// /path/to/your/app/webpack.config.js
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    plugin: [
        new ProgressBarPlugin()
    ]
}
```
