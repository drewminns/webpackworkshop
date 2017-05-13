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
