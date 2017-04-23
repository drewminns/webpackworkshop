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
