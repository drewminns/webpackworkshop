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
