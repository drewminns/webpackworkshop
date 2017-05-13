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
