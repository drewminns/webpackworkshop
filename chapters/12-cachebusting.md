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
