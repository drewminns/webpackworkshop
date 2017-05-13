# Prepping for Production

Currently, we're just thinking about bundling our files for development. But what if we wanted to prep our files for production, we would end up with a pretty hefty file size.

Enter webpack configuration for production. Often you'll see a project have two webpack files, one for production and the other for development.

In our example, we're going to just maintain one webpack configuration file and use Node environment variables to control what settings we need.

Node Environment Variables are global variables available to our application to define the environment to run the application within. We can hook into these in our webpack configuration and define different settings based on each.

## Setting Variables

To set an environment variable, we can do it directly through the command line or when running scripts, define the environment directly.

Let's modify our existing "dev" script to set an environment variable to 'development' before running our dev server.

```
"scripts" : {
  "dev": "NODE_ENV=development node config/dev-server.js"
}
```

**Note: If you're on windows you'll need to write 'set NODE_ENV=development'**

_NODE_ENV is a variable now available everywhere in our application. If we do not set it directly, it's value is `undefined`. Read more about it [here](http://stackoverflow.com/questions/16978256/what-is-node-env-in-express)_

Now in our webpack configuration (and anywhere inside of a Node application), we can access our variable by typing `process.env.NODE_ENV`.

## Production Building

We're going to eventually need to build our application for production so we need to set our environment variable to help configure that. First though, we need to define what script will be run for production.

We won't need to run the dev server for this project because our application is just a static application, so we can skip the dev server script and just run our webpack configuration directly.

Let's modify our scripts section in 'package.json' to include a "build" script that sets an environment variable to 'production' and uses our basic build command.
__The name is up to you__

```
"scripts" : {
  "dev": "NODE_ENV=development node config/dev-server.js",
  "build": "NODE_ENV=production webpack --config config/webpack.default.js",
}
```

## Using the Variables

Now that we have these variables available to us, we can access them in our webpack config. Let's create variables in our config to store the values we need.

```
const PROD = process.env.NODE_ENV === 'production';
const DEV = process.env.NODE_ENV === 'development';
```

Now we can modify our config to handle different actions for Production vs Development.

Firstly, we don't need to include all the dev-server files in our final bundle, so let's create a variable to store our entry files that we need for each environment. We can use a ternary operator to check the environment and return the correct value as needed.

```
const entry = PROD
  ? [ './src/script.js' ]
  : [
    './src/script.js',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080'
  ]
```

In the code above, we're checking if `PROD` returns `true` and if so the entry array will only hold our main entry file. If `PROD` returns false, we return an array containing our main entry and all the dev server files.

Now, we can use that variable directly in our configuration.

```
module.exports = {
  entry: entry
  plugins: [ new webpack.HotModuleReplacementPlugin() ],
```

Using ES6, we can leverage a feature that allows us to omit the value of a property if the names are the same.

```
module.exports = {
  entry,
  plugins: [ new webpack.HotModuleReplacementPlugin() ],
```

Next, we can do the same for plugins since HMR won't be much use within production.

```
const plugins = PROD
  ? []
  : [ new webpack.HotModuleReplacementPlugin() ];
```

In our configuration

```
module.exports = {
  entry,
  plugins,
```

Now if we run our webpack using `npm run build` we'll get a bundle output that has all the dev server code removed.

## Optimizing our bundle

You'll notice that our bundle is still 'relatively' big and has a lot of whitespace within it. We can optimize our code to be run through UglifyJS and all whitespace removed (plus so much more).

To do so, we can add another plugin to our **production** build only. In your plugins variable, let's install the included UglifyJS plugin.

```
const plugins = PROD
  ? [
    new webpack.optimize.UglifyJsPlugin()
  ]
  : [ new webpack.HotModuleReplacementPlugin() ];
```

Now when you run `npm run build`, you'll see that the bundle file has whitespace removed and the file size has dropped significantly.

Options can be provided to the plugin by passing in object to the method. Read about available options [here](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/#options).
