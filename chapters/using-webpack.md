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
