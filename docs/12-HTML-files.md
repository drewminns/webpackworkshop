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
