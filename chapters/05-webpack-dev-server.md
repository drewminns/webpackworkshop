# Webpack Dev Server and HMR

Development involves a lot of refreshing. We're always changing something, pressing save, switching to the browser, refreshing etc. That can be really frustrating.

Luckily Webpack has a few tools to help with this process. [Webpack Dev Server](https://github.com/webpack/webpack-dev-server) and [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/).

These tools should only be used in **development**. We'll explore how to configure our Webpack bundle for production in an upcoming section.

## Webpack Dev Server
The first tool we can use is a separate package from Webpack called [webpack-dev-server](https://github.com/webpack/webpack-dev-server). Webpack Dev Server will create a small local server for us to serve our application in the browser, bundle our assets 'virtually' and reload the page whenever a change has been made.

Go ahead use NPM to install with `npm i webpack-dev-server --save-dev`. The reason for the `--save-dev` flag is that we will not be using it in production.

Now, in your **package.json** file, let's add a "dev" script to use the dev server with our existing configuration file.

...
"scripts": {
  "build" : "webpack --watch --config config/webpack.default.js",
  "dev": "webpack-dev-server --config config/webpack.default.js"
},
...

Much like the build script, we are calling a specific package, in this case 'webpack-dev-server' and telling it to use our `webpack.default.js` file stored in our config folder.

Back in your terminal, if your old script is running exit it with `ctrl+c` and now run `npm run dev`. Your app will now be available at **localhost:8080** by default. You can try editing your JS files and see that the dev server is re-bundling them when saved and refreshing the browser to insert the new scripts into the page.

Voila.

## Hot Module Replacement

What the heck is a hot module, and why do we need to reload it?

So the dev server is great and all, but there's one major issue that is caused by reloading the page. If we had any data we wanted to persist, it would be removed and reset to the initial state. Think about working with AJAX requests, at first we have no data, we have to request it. Once we have it, we have to display it properly. Each time we make a change to styling or our scripts, we need to refresh and again request data to our application to style it, a lengthy process.

Hot module reloading allows us to *insert* the changed modules into our JS file when they are changed without the need for browser refreshing. Think of it as swapping out bits of code on the fly in the browser.

This is particulary useful with frameworks like React and Vue as our components are separate modules that are compiled into one. We often don't need to re-render the entire application, but just the single component we are working on.

### How to use HMR

Hot Module Replacement is one of the core plugins available for Webpack and does not require us to install any other dependencies. We will however leverage Webpack Dev Server to help us serve an application quickly and easily.

This section has a lot of information and can seem tricky, but the usage is indispensable to development once set up.

To make setup easier, we're going to create a new file to configurate our webpack-dev-server. In the config folder, create a file name 'dev-server.js'.

**Note** You can setup webpack-dev-server directly in your webpack configuration, however turning it off for production will be much more difficult.

Inside of the file, we need to import a few resources: webpack-dev-server, webpack, path, and our webpack configuration.

```
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('./webpack.default.js');
var path = require('path');
```

The server needs to know which webpack file to use, so we'll create a reference to it by wrapping it in our main webpack package. This returns to us a running webpack instance when called.

```
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('./webpack.default.js');
var path = require('path');

var compiler = webpack(config);
```

The next step is to configure our server. We create a new instance of the webpack-dev-server and provide it two arguments. One, our webpack configuration instance, and the other, an object to configure the server.

```
...

var server = new WebpackDevServer(compiler, {
  hot: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
});

```

Now, tell our server how to run.

```
...

var server = new WebpackDevServer(compiler, {
  hot: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
});

server.listen(8080, 'localhost');

```

### Accepting Modules
Phew ok. That's one file. Now we have to change our webpack.default.js file to handle HMR. Open up that file in your editor.

In our entry property, we need to modify our string to be an array and accept some files that will be exposed by webpack-dev-server. The first will be our standard entry file we've been using, the other two will be reaching into the node_modules folder to reference files within used during webpack-dev-server's usage.

```
module.exports = {
  entry: [
    './src/script.js',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080'
  ],
  ...
```

Finally, we need to another property to our configuration to turn on HMR, the plugins property is where you can add additional functionality to your webpack instance. To use the HMR plugin we need to first import the Webpack package into our config file.

```
var path = require('path');
var webpack = require('webpack');

module.exports = {
  ...
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
  ...
```

So close, ONE last thing to do. We need to tell our JS to accept changed modules. In your **src/script.js** file we can add some code to "listen" for changes to our code.

```
if (module.hot) {
  module.hot.accept();
}
```

### Running our dev server with HMR
The final step is to run our newly created server, but since we created a dev-server.js file to configure it, we can't simply use `webpack-dev-server` in the command line/scripts anymore. We need to modify our "dev" script to run the dev-server.js file directly in Node.

```
"scripts" : {
  "dev": "node config/dev-server.js"
}
```

Now, with all of that running, you can run `npm run dev` in the terminal, load up localhost:8080 in your browser, make a change to your JS and see it changed immediately without the browser being refreshed.

Boom.
