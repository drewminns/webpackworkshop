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
