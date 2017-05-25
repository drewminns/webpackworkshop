# Webpack

Let's start with the basics. What is webpack and why would you want to use it?

Webpack in the simplest explanation, is a way to write your application in multiple JavaScript files and connect them to each other. This is not a new idea, tools like Require.js and Browserify have been doing it for years. In fact, this idea of writing your JS in separate files has become such a common way of organizing your application that browsers are beginning to [introduce support](http://stackoverflow.com/questions/33516906/which-browsers-support-import-and-export-syntax-for-ecmascript-6) for handling the import and export of JS.

This concept is officially called module bundling and webpack takes care of this and so much more.

What webpack does differently than browserify or require.js, is add additional tools to create development servers, hot module reloading (more on that soon) and the ability to load CSS, Fonts and Images directly into your JavaScript. As well, webpack helps keep application bloat down by allowing for scripts to be dynamically loaded in as they are needed, and using tree-shaking to remove extraneous code when bundling.

# Installing Webpack

To install Webpack, we need to utilize the NPM/Yarn ecosystem to inform how we manage project dependencies and run our scripts.

In your terminal, navigate to your project directory and run `npm init -y` to initialize the directory as an NPM project.

__You can also run `npm init` if you want to provide additional information about your project__

Once that script has been run, we can now install webpack to our project. As of writing, webpack is currently in version 2.4.1. There are significant differences between version 1 and 2 so be aware of what version your application is running.

In the terminal, let's install webpack to our project by running `npm install webpack --save-dev`.

Typically, webpack will only be used as a dev-dependency as we will use it during development and when ready to put our project live, we will use webpack to compile all our assets as needed. If you use webpack to handle bundling on a server, for example with server side rendering, you will need to install webpack and all other webpack related dependencies with the `--save` flag.

## Using Webpack

Let's get started with webpack by building a simple application and start to dig into how to use webpack and what it can do for us.

Let's create an `index.html` file and add some basic markup and a script tag to it.
```
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'/>
  <title>Webpack</title>
</head>
<body>

  <div id="app"></div>
  <script src="src/script.js"></script>

</body>
</html>
```

Next, we'll create an `script.js` file in a `src` directory and write some code to select an element in our HTML and inject some text into it.

```
var app = document.getElementById('app');
app.innerHTML = '<p>Hello World!</p>';
```

If we view the page in browser, we see the application rendered correctly with the paragraph and text inserted in to the element.

Great, that's a basic application, now let's start structuring our application and start to build it larger.

### Importing assets.
Now, let's create a another file (data.js) in our src directory to contain some information we want to display.

```
module.exports = {
  location: 'World',
};
```

We'll use the CommonJS module structure to export an object containing one property.

Now, let's use a require statement to import the object into our `script.js` file and concatenate it into our text.

```
var data = require('./data');

var app = document.getElementById('app');
app.innerHTML = '<p>Hello ' +  data.location + ' !</p>';
```

Theoretically, this should work. We're exporting an object and then importing and using the data, but if you view the site in the browser, you'll notice that nothing displays and the console displays an error.

```
Uncaught ReferenceError: require is not defined
    at script.js:1
```

The browser is choking on our usage of the require function to import a file. We need something to help us load it in.

In the terminal, let's use webpack to compile our file into one that has support for require.

```
./node_modules/webpack/bin/webpack.js src/script.js bundle.js
```

That command is broken down into the following:
`./node_modules/webpack/bin/webpack.js` - looks into the node_modules folder for the webpack package
`src/script.js` - tells webpack which file to treat as the entry, or the initial application file.
`bundle.js` - what the name and where to output the compiled file. This example will create a bundle.js file in the root of the project.

We'll make this easier in a later lesson.

webpack will output a bundle.js file and the terminal will display some information on the size of the file.
```
Hash: 455655b1f62baa84d64c
Version: webpack 2.4.1
Time: 60ms
    Asset     Size  Chunks             Chunk Names
bundle.js  2.89 kB       0  [emitted]  main
   [0] ./src/data.js 43 bytes {0} [built]
   [1] ./src/script.js 129 bytes {0} [built]
```

Now we can modify our index.html to reference the new bundle.js file and see the content displayed!

```
<script src="bundle.js"></script>
```

### Making building easier
That command we ran is pretty tough to remember, we can make it easier to access webpack by putting it in our npm scripts.

Open up `package.json` and find the scripts section. Delete the existing `test` property and value and add a "build" script with the following data.

```
...
"scripts": {
  "build" : "webpack src/script.js bundle.js"
},
...
```

You'll notice that we no longer need to write `.node_modules/webpack/bin/webpack.js` in the value and that's because npm scripts will automatically look within the node_modules folder for the needed package.

We can now run `npm run build` and webpack will bundle our file.

## Watching for changes
If we want to have webpack watch your changes in our entry file and rebundle our code, we can add a **watch flag** to our command like so:
```
...
"scripts": {
  "build" : "webpack src/script.js bundle.js --watch"
},
...
```

With this in place, we can leave our terminal running.

## Exercise
Add more external JS files and require them into your script.js. Import others into your data.js and create a chain of files to be bundled into one final file.

[Using the bundle](03-understanding-the-bundle.md)

# Understanding the Bundle

If you open up the bundle.js file that webpack created, you'll find a larger amount more code than we wrote. What is it?

webpack doesn't just combine files together into one, webpack creates the missing module export and require functions that we need to link files together.

At the top of our webpack file, we have scripts that allow for the ability to require and export, but what's important is the bottom of the file.

At the bottom of the file, you will find an array containing our code modified a little bit. Each item in the array is now wrapped in a function and have a comment block above with a number.

```
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  location: 'World',
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var data = __webpack_require__(0);

var app = document.getElementById('app');
app.innerHTML = '<p>Hello ' +  data.location + ' !</p>';


/***/ })
/******/ ]);
```

In the first item in the array, we have our data.js script, but the code has been changed. Because `module.exports` is not supported in the browser, webpack modifies the code to have support from webpack itself.

In the second module in the array, we have our script.js file, but again you'll notice that it has been modified. We no longer have our require statement linking to our data.js file, we now have `var data = __webpack_require__(0);`. This is again, because require is not supported in the browser, so webpack provides support to import a file.

But what's the '0'? Well that's our first array entry, webpack just uses our array to pull content in.

### Entry
So how does webpack know which array item to start with? Roughly around line 65, webpack states our entry module as '1', our array item with the index of 1!

```
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
```

[Webpack Config File](04-webpack-config-file.md)

# Webpack Config File

For now, our Webpack process has simply been bundling JavaScript files together into one, but as our project grows, we'll want to add in different types of assets, take advantage of ES6 and have our changes automatically loaded into the browser.

We could modify our build script to handle this, but it would become very long and difficult to have inside of your package.json file. Instead, we can create a config file that will hold all of our settings for webpack to run.

In the root directory of our project, or wherever you prefer to keep your configuration, let's create a JS file called `webpack.config.js`. The naming of the file is up to you but by default, this and 'webpackfile.js' is the naming that Webpack will look for.

Inside of our config file, we need to specify our configuration by exporting a module containing our settings. It's important to remember that we have to use non-ES6 syntax within this file, because currently Node does not fully support all ES6 features.

```
module.exports = {

}
```

## Entry
Now the first step in every Webpack setup, is to again say where to start. We can add a field to our configuration called `entry` and provide the path to our scripts.js file. In the url, we need to include an **absolute** path to our entry file.

```
module.exports = {
  entry: './src/script.js'
}
```

## Output
Now the next step is to specify where to output the bundled files, to do that we add another field to our configuration called `output` that is an object containing additional fields.

### filename
The most important field is the `filename` field which specifies what our bundled file will be named.

```
module.exports = {
  entry: './src/script.js',
  output: {
    filename: 'bundle.js'
  }
}
```

### path
As our app grows, we're going to have many more assets to manage, so it's best to keep those off the root of our project and in a `dist` folder. To define the folder in which to output our bundle, we add a `path` property to our `output` object.

```
module.exports = {
  entry: './src/script.js',
  output: {
    filename: 'bundle.js',
    path: ''
  }
}
```

Providing a folder name will unfortunately through an error though. If we were to set the value to be a folder name and run Webpack, we'd get an error in the terminal alerting us that we have not provided an absolute path. There are a few ways around this, first we can use a global Node variable called [__dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname) which returns the current directory. Using concatenation, we can let webpack know to append the current directory to the output folder name.

```
module.exports = {
  entry: './src/script.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  }
}
```

### publicPath
As our project grows, we will have assets being created and needing to be referenced out of different places relative to our index.html. To provide context as to what paths our assets should have, we can use a publicPath property to set a directory to append to each asset path (Much more on this later)..

```
module.exports = {
  entry: './src/script.js',
  output: {
    filename: 'bundle.js',
    publicPath: '/dist/',
    path: __dirname + '/dist'
  }
}
```

## Running our config file
Now that we have created our config file, we can modify our scripts to use our config. In `package.json`, find our scripts section and remove the entry and output file names.

...
"scripts": {
  "build" : "webpack --watch"
},
...

## Naming your Webpack file something different

If you wanted to name your webpack file something other than 'webpack.config.js', you absolutely can. For example, some people name them 'webpack.default.js' or 'webpack.development.js'.

To specify which file for webpack to use, we can provide a `--config` flag to the build script to specify where to find our configuration.

...
"scripts": {
  "build" : "webpack --watch --config webpack.default.js"
},
...

## Putting it somewhere else
Instead of putting the config file on the root of your project, you can keep a config folder where you can put other application configuration files. Create a config folder at the root of your project and put your `webpack.default.js` file in it.

We can now update our scripts to point to our new file.

...
"scripts": {
  "build" : "webpack --watch --config config/webpack.default.js"
},
...

Now if we run our webpack file, you'll notice an immediate problem. There is a dist folder created in our config folder. What's going on?

The issue is caused by our output.path property. We're using the `__dirname` Node variable to return the current directory so in affect, telling Webpack to output the files inside of the config folder.

Let's explore a couple ways to approach this

If we add two dots to indicate go back a folder and run it:

```
module.exports = {
  output: {
    filename: 'bundle.js',
    path: __dirname + '../dist'
  }
}
```

We get a folder in the root of our project, but what's created is 'config../dist/bundle.js'. Hmmm, not what we want.

If we simply put '../dist' with no concatenated `__dirname`, we get our absolute path error.

#### Path module
To solve this problem, we can utilize another piece of the Node API to help us navigate our directories. The [Path](https://nodejs.org/api/path.html) module gives us tools to work with directory paths in our applications.

We can use an available Path method called 'join()' to combine multiple path strings into one. Join takes an array of paths and returns a string that you can use your value.

The first step is to import the module into our file. Because it's part of the core Node package, we don't need to use NPM to install it.

```
var path = require('path');

module.exports = {
  output: {
    filename: 'bundle.js',
    path: __dirname + '../dist'
  }
}
```

Now we can change our output.path value to include our paths.

```
var path = require('path');

module.exports = {
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../dist')
  }
}
```

This returns us an absolute path to the current directory (`config`) but one back, denoted by our '..'.

Be sure to update your index.html file to support the location of the new bundle!

## Multiple Entry Points
If you have multiple JS files to act as entry points, possibly specific to each page of your application, you can provide an object to the entry property will properties for each of your entry files.

```
module.exports = {
  entry: {
    dog: './src/start.js',
    pizza: './src/cool.js',
    dragon: './src/hello.js'
  },
  ...
}
```

To specify what each outputted bundle should be named, we modify the filename property in the output object to support the insertion of a dynamic name.

```
module.exports = {
  entry: {
    dog: './src/start.js',
    pizza: './src/cool.js',
    dragon: './src/hello.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: __dirname + '/dist'
  }
}
```

Webpack will output a file for each entry specified and use the property name as the file name. `dog.bundle.js`, `pizza.bundle.js`, `dragon.bundle.js`.

[Webpack Dev Server](05-webpack-dev-server.md)


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

[Loaders](06-loaders.md)


# Loaders

Loaders are a key concept within Webpack. They are used to help transpile, extract or render different file types in our applications. We'll go into much more usage with them as we import images, CSS and even fonts into our JS (I know. Scary).

A loader is a middleware that allows code in different formats (CSS, jsx, TTF, jpg) to be intercepted by Webpack and tasks performed to have it output to our bundle.
This is where many discussions about having CSS in JS come from, but in our project, we're just going to make Webpack our one tool to convert ES6 to ES5, Sass to CSS and manage our image assets. If you're interested in learning more about how loaders work, Boucoup has written a [fantastic blog about the topic](https://bocoup.com/blog/webpack-a-simple-loader).

But first, we have no way to write ES6 in our code and ensure that it will work in every browser. We can use a loader to look at our code, transpile it to ES5 code and output that to our bundle.

Let's get started.

## Packages we need
In order to accomplish this task, we need a few NPM packages related to Webpack and Babel.

In your terminal type the following command

```
npm i babel-core babel-loader babel-preset-es2015 babel-preset-stage-0 --save-dev
```

* babel-core is the actual transpiler package that will perform the conversion of ES6 code to ES5.
* babel-loader is a webpack tool that will allow our code to be transpiled within the webpack process
* babel-preset-es2015 and babel-preset-stage-0 are standards in which to process ES6 code.

Once those are installed, let's create a Babel configuration file named `.babelrc` in the root of our application which will tell the tools within how to transpile our code. Inside, create an empty object with the following properties.

```
{
  "presets" : ["es2015", "stage-0"]
}
```

Next, we need to configure our webpack file to look for ES6 code and transpile it as needed. Open up webpack.default.js in your editor.

We're going to add another property to our configuration called 'module' which we will grow through this workshop to handle different formats.

```
module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {

  }
}
```

Inside of module, we are going to create a rules property which will itself, contain an array of objects that will handle our file types.

```
module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {

      }
    ]
  }
}
```

Within each object, we are going to provide three properties, the first is a test, which is a regex check for a file extension. If a file matches that extension, the loader will act upon it.

```
module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/
      }
    ]
  }
}
```

Next, we add a 'use' property to define what loader to use on the file type. The use property can accept an array which will allow us to chain loaders together.

```
module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader']
      }
    ]
  }
}
```

> **Note**: Sometimes you'll see the 'use' property written as 'loaders' and a simple string. There are multiple ways to configure webpack, this is my preferred and recommended by the documentation.

Finally, we can add another property called 'exclude'. This will not go on every loader rule, but will be extremely useful for JS specifically. We can specify which folders to ignore when transpiling.

```
module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: '/node_modules/'
      }
    ]
  }
}
```

Because most dependencies if not all within the node_modules folder will already be transpiled, we can ignore it and help take the load off of Webpack.

## Write some ES6

Now, let's test it. Quit the currently running webpack process if running and write some ES6 in your script.js file.

Instead of concatenated strings, let's use template strings to update our page.

Turn this:
```
app.innerHTML = '<p>Hell ' +  data.location + '!</p>';
```

into this:
```
app.innerHTML = `<p>Hello ${data.location}!</p>`;
```

Start up the dev server again with `npm run dev` and you will have ES5 code delivered to your browser in the bundle.js file.

[Production Building](07-production-building.md)

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

[Loading Styles](08-loading-styles.md)

# Loading Styles

Along with bundling our javascript files, Webpack can also help us manage compilation of our styles.

This is often where people get afraid of Webpack, and the idea of CSS in your JavaScript starts to scare people. But just wait, Webpack when used in development with Styles is an incredibly powerful tool.

Let's go ahead and create a styles directory with a `main.css` file in our src folder, to hold some basic styles.

```
- src
  - styles
```

Inside of our main.css file, let's add some basic styles. Feel free to add whatever you would like.

```
body {
  background: blue;
  font-family: sans-serif;
}
```

## Loading CSS
Now, with all file types we need to install a loader to help Webpack understand how to process our files.

We're going to install two loaders to handle this.

- style-loader will help us inject our styles into our pages by inserting a style tag directly into the DOM
- css-loader will handle the input of CSS syntax into our system.

Let's install them with `npm i style-loader css-loader --save-dev`.

## Loading styles
In our webpack configuration, we need to now add a loader rule to check for .css file types.

We can copy our existing `.js` rule to test for CSS.

```
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: '/node_modules/'
    },
    {
      test: /\.css$/,
      use: [],
      exclude: '/node_modules/'
    }
  ]
}
```

Next, we need to define our loaders to process the styles. Let's modify our 'use' array to include our loaders.

```
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: '/node_modules/'
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      exclude: '/node_modules/'
    }
  ]
}
```

We are now able to run our webpack dev server to process CSS.

## Importing the styles

Our dev server runs without errors, but we don't see any of our styles. Well, we need to import our styles into our app.

This is where it's going to feel weird. We need to import our styles into our JavaScript file. At the top of 'script.js', import the styles directly into your project.

```
require('./styles/main.css');
```

Because we have the dev server running, you will see the changes immediately when you press save. As well, if you change the CSS, it's reflected in the code.

## What is happening?

If you inspect the head of the page, you'll notice that there is a `<style>` tag that wasn't included in our original HTML document. That's the style-loader plugin inserting the styles into the DOM. As well, HMR is helping us reflect those changes immediately.

If you inspect the bundle, you'll see the styles included directly within.

## Sass

Not everyone uses vanilla CSS though, so let's add support for .SASS and .SCSS files in our configuration.

It's as simple as installing another loader for Webpack and setting up another rule. As well, we need to install the `node-sass` package to do the compilation of SASS to CSS for us.

`npm i sass-loader node-sass --save-dev`

Now in our Webpack configuration, let's create another rule specific to .scss files.

```
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: '/node_modules/'
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      exclude: '/node_modules/'
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader'],
      exclude: '/node_modules/'
    }
  ]
}
```

Next, let's modify the loaders to include our `sass-loader`. The order is important here. Loaders are used from the end of an array to the beginning, we want the sass to be compiled first and then loaded into our page.

```
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: '/node_modules/'
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      exclude: '/node_modules/'
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      exclude: '/node_modules/'
    }
  ]
}
```

Now we change our 'main.css' to 'main.scss', update our require statement to reflect the extension change and start using SCSS immediately.

**script.js**
```
require('./styles/main.scss');
```

**styles/main.scss**
```
$background: blue;

body {
  background: $background;
  font-family: sans-serif;
}
```

## Autoprefixing

Often we need to autoprefix our styles so that they work in every browser. In order to do this, we're going to need two packages to load into our Webpack configuration: 'postcss-loader' and 'autoprefixer'.

`npm i postcss-loader autoprefixer --save-dev`

Now we need to modify our loaders a bit differently as postcss-loader and autoprefixer need to be configured a bit differently. Let's create a variable to handle our postcss-loader configuration.

```
const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      require('autoprefixer')()
    ]
  }
};
```

We're breaking out our loader configuration to a separate object and providing it information about what additional plugins we will need, in this case autoprefixer.

Now we can use that postcss variable directly within our loaders.

```
{
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', postcss, 'sass-loader'],
  exclude: '/node_modules/'
}
```

## Extracting a CSS file

We've got our styles being written to the head of our file, however we will want them output to a separate file eventually.

In order to this we need the `extract-text-webpack-plugin` plugin.

`npm i extract-text-webpack-plugin --save-dev`

Now we need to reconfigure our CSS loader rules a bit to be modified for production/development.

First, let's import our newly installed plugin into our config.

```
const ExtractTextPlugin = require("extract-text-webpack-plugin");
```

Next, let's create a variable to contain our different configurations for loading CSS per environment.

```
const cssLoader = PROD
  ? []
  : ['style-loader', 'css-loader', postcss, 'sass-loader']
```

Be sure to update your loader rules to reflect the variable.

```
{
  test: /\.scss$/,
  use: cssLoader,
  exclude: '/node_modules/'
}
```

Now, we need to tell Webpack to use our plugin in production. Instead of returning an array, we can return our plugin with some configuration.

```
const cssLoader = PROD
  ? ExtractTextPlugin.extract({
    use: ['css-loader?minimize=true', postcss, 'sass-loader']
  })
  : ['style-loader', 'css-loader', postcss, 'sass-loader']
```

In the configuration, we've included our css-loader, our postcss variable and sass-loader. We no longer need style-loader as we'll be creating a file vs loading into a style tag in the DOM. As well, can add a param to css-loader of 'minimize=true' to compress our styles when output.

The final step is to load the plugin into our production plugins configuration to define the output file.

```
const plugins = PROD
  ? [
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('style.css'),
  ]
  : [
      new webpack.HotModuleReplacementPlugin(),
    ];
```

The file will be output the publicPath value we defined in our Webpack output object.


[Loading Assets](09-loading-assets.md)

# Loading Images

Along with Styles, we can also use Webpack to handle image assets (among others). This is useful because we may want to import images to be used in markup generated by our JavaScript.

## Including an Image

In the 'resources' folder of this project, there are two images available - 'prudence.jpg' and 'webpack.jpg'. Create a folder called 'images' inside of the 'src' directory and put the images in there.

Now, in our 'script.js' file (or any other module), we can import our images in by putting the path to the file.

```
import prudence from './images/prudence.jpg';
import webpack from './images/webpack.jpg';
```

We can now use the imported files as references within our application.

```
app.innerHTML = `
  <p>Hello ${data.location}!</p>
  <div><img src='${prudence}' /></div>
  <div><img src='${webpack}' /></div>
`;
```

However if we run Webpack, we'll get an error that we need a loader to handle the file type. That's Webpack's way of telling us that we need to set up a loader rule to handle a file type.

## file-loader

The first tool we'll look at will help us simply import a file type into our application. Using 'file-loader', we'll import image file types, but it can be used to handle the import of font files (Example in React project) and other assets.

`npm i file-loader --save-dev`

Next, let's add a rule to our Webpack configuration to handle image file types. Instead of simply looking for jpg files though, we'll create a regex test for jpgs, pngs and gifs.

```
{
  test: /\.(png|gif|jpg)$/,
  use: [],
  exclude: '/node_modules/'
},
```

Next, we'll tell the rule to use 'file-loader'.

```
{
  test: /\.(png|gif|jpg)$/,
  use: ['file-loader'],
  exclude: '/node_modules/'
},
```

Be sure to restart your webpack server, and you will see the images being imported.

If you inspect the image tags, you'll see that the file name has been replaced with a hash automatically. This is useful for cache-busting assets.

As well, if we run `npm run build`, the assets will be exported to our 'dist' directory with the file hashes included.

## url-loader
Another way to handle assets in your project is to use 'url-loader'. This tool allows us to return an inline base64 data value if our image is smaller than a specified size. This is great for our application as we can minimize the number of network requests made.

`npm i url-loader --save-dev`

We can swap the loader used for our image assets to 'url-loader'.

```
{
  test: /\.(png|gif|jpg)$/,
  use: ['url-loader'],
  exclude: '/node_modules/'
},
```

To inline image assets that are below a specified value, we can provide a parameter to the loader with a byte size to limit our assets to. The below example will inline any png/gif/jpg files that are imported and are below 20kb.

```
{
  test: /\.(png|gif|jpg)$/,
  use: ['url-loader?limit=20000'],
  exclude: '/node_modules/'
},
```

When we run `npm run build`, only the large image will be exported to the 'dist' folder, while the smaller image will be delivered inline via JS.

[Sourcemaps](10-sourcemaps.md)

# Sourcemaps

Sourcemaps are a crucial tool when developing a project. Because we are working with development tools like Babel, Sass and others it's important to know the source of any problems that could arise.

Often the outputted bundle is not much help as it's the compiled source, we need to track down all errors to our source files.

Webpack offers sourcemaps right out of the box without adding any existing plugins.

Using the 'devtool' property, we're able to define what type of sourcemap we want.

## Development Sourcemaps

### devtool: 'eval'
The quickest tool for development except is missing line numbers.

### devtool: 'inline-source-map'
Inline Sourcemap is created within the bundle as a DataURL

### devtool: 'eval-source-map'
Like 'eval', but includes line numbers. Is slow on initial build, but each subsequent rebuild is quick.

### devtool 'cheap-module-eval-source-map'
Like 'eval-source-map', it is slow but provides better support for individual modules that have been imported.

## Production Sourcemaps

### devtool: 'source-map'
A full sourcemap is emitted by Webpack. Slow on build.

### devtool: 'hidden-source-map'
A full sourcemap is created to help provide information to error logs, but the sourcemap is hidden from browser dev tools.

### devtool: 'cheap-source-map'
A SourceMap without column-mappings that ignores modules.

### devtool: 'cheap-module-source-map'
A simpler sourcemap, often the best option as it is built quickly

## Loading devtools per environment

Once we have decided if and which sourcemap we need for our project, we can load them in dynamically using our environment variables.

```
devtool: PROD ? 'cheap-module-source-map' : 'eval',
```

### Uglify and Babel
Because we're running our JS through Babel, we can have UglifyJS create a sourcemap for us.

```
new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
```

[Tree Shaking](11-tree-shaking.md)

# Tree Shaking

One of the best features of Webpack is something called Tree Shaking.

How much of our code that we write do we not use? Webpack can help us keep our bundle sizes small in production by removing unused JS from modules.

## Math.js

Let's start by creating a new file to hold some basic math functions. Think of it as a library that we may need in our project.

Create a new folder called `utils` and inside, create a file called `math.js`.

```
export const multiply = (a,b) => a * b;
export const add = (a,b) => a + b;
export const subtract = (a,b) => a - b;
export const divide = (a,b) => a / b;
```

## Importing

We've created name exports for each function, so when we import the file into our other modules, we can use ES6 destructuring to import the files individually.

```
import { multiply } from './utils/math.js'
```

Next, we can use the function directly within our code.

```
const message = `Math is cool. Here's the result of 3 * 3 = ${ multiply(3,3) }`;

app.innerHTML = `
  <h1>Hello ${data.location}!</h1>
  <p>${message}</p>
  <div>${image}</div>
  <div>${webpackImage}</div>
`;
```

If we run our app in development or production, and inspect the bundle, we can see that the entire file is loaded, even though we only use the one function.

This isn't necessarily bad because our math file is small, but in larger projects, finding reductions in file size is crucial.

## Removing unused code

The first step in removing unused code is identifying it in our code. We can use Babel as the tool to identify it by adding more configuration to our `.babelrc`

```
{
  "presets" : [
    [ "es2015", { "modules": false } ],
    "stage-0"
  ]
}
```

When we run our bundle, we can see comments being added by Babel to provide additional information. Any unused imports now feature comments to identify them as not imported.

```
/* unused harmony export multiply */
```

Great, now the next step is use our UglifyJS plugin in production to removed the unused code.

```
const plugins = PROD
  ? [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: false
    }),
    new ExtractTextPlugin('style.css'),
  ]
  : [
      new webpack.HotModuleReplacementPlugin(),
    ];

```

The mangle property is standard with UglifyJS in which to remove certain pieces of code.

If we run our production build, we can inspect and see that all of the unused code has now been removed from our bundle.


### CSS!
If you're interested in removing unused CSS, check out the [purifycss-webpack plugin](https://github.com/webpack-contrib/purifycss-webpack).

[HTML Files](12-HTML-files.md)

# Generating an HTML File

Now that we've created a way to bundle our JS, handle our CSS and import image assets with optimization, we need a way to prep our entire project for deployment.

We have one major problem though. Our HTML no longer points to the correct javascript file and there is no link to our stylesheet.

To accomplish this dynamically, we can use the [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) tool to export an HTML file with the proper links to our assets for production.

`npm i html-webpack-plugin --save-dev`

## Template Files

Now that we have the plugin installed we can import it into our webpack configuration.

```
const HTMLWebpackPlugin = require("html-webpack-plugin");
```

And use it within our plugins for production

```
const plugins = PROD
  ? [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: false
    }),
    new ExtractTextPlugin('style.css'),
    new HTMLWebpackPlugin()
  ]
  : [
      new webpack.HotModuleReplacementPlugin(),
    ];
```

The plugin takes some configuration, mainly the location of a file to use as a template for the export.

Let's create a `template.html` file in our config folder that includes our basic markup, but removes any link or scripts tags to our outputted files.

```
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'/>
  <title>Webpack</title>
</head>
<body>

  <div id="app"></div>

</body>
</html>
```

Next, we can add a template property containing the path to our template here.

```
new HTMLWebpackPlugin({
  template: 'config/template.html'
})
```

When we run our production build, we can see an HTML file created with the inserted link and script tags.

## Production Paths

Script and Link tags were added but they point to the wrong directory. Because we've got a publicPath property in our output property pointing to '/dist/', our template will include links to that path.

It's easily changed by updating our property with our handy environment variable.

```
publicPath: PROD ? '/' : '/dist/',
```

## More options
You can see more options for the outputted HTML template such as changing the title [here](https://github.com/jantimon/html-webpack-plugin#configuration).

[Cachebusting](13-cachebusting.md)

# Cache Busting

The final step in production is to allow browsers to know that a file has been changed if they have been updated.

The best way to do this, is to add a hash to the file name so the server and browser identifies it as new and delivers the new content to the user.

## JavaScript

To add a hash to our JS bundle, we can modify our `output.filename` property to deliver a hashed filename on production.

```
output: {
  path: path.join(__dirname, '../dist'),
  publicPath: PROD ? '/' : '/dist/',
  filename: PROD ? 'bundle.[hash:12].min.js' : 'bundle.js'
},
```

The `'bundle.[hash:12].min.js'` value will tell webpack to automatically add a 12 character hash to the outputted bundle.js file. For example, 'bundle.0c7911b1645b.min.js'.

HTMLWebpackPlugin will take care of updating the src value in our output HTML file with the new value.

## CSS

Adding a hash to the file name of our stylesheet is very much alike JS, except that it's taken care of by the ExtractTextPlugin tool.

Where we defined the plugin settings and filename, we can add a hash value and modify the file name as needed.

```
new ExtractTextPlugin('style-[contenthash:12].min.css'),
```

The above code will add a 12 character hash to the file name and again, update our outputted HTML file with the right value as needed.

## Cleaning up as we go

Each time we run a new build, we're going to have new bundles, styles and sourcemaps created and dumped into the 'dist' folder.

The best way to approach this problem, is to delete the 'dist' folder completely before each build. An easy way to do this, is to use a package called 'rimraf'.

```
npm i rimraf --save
```

Now we can modify our build script in `package.json` to use rimraf and delete our directory before we build to it.

```
"build": "rimraf dist && NODE_ENV=production webpack --config config/webpack.default.js",
```

This will allow you to just treat the 'dist' directory as your complete production build.
