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
