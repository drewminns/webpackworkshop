# Webpack

Let's start with the basics. What is webpack and why would you want to use it?

Webpack in the simplest explanation, is a way to write your application in multiple JavaScript files and connect them to each other. This is not a new idea, tools like Require.js and Browserify have been doing it for years. In fact, this idea of writing your JS in separate files has become such a common way of organizing your application that browsers are beginning to [introduce support](http://stackoverflow.com/questions/33516906/which-browsers-support-import-and-export-syntax-for-ecmascript-6) for handling the import and export of JS.

This concept is officially called module bundling and webpack takes care of this and so much more.

What webpack does differently than browserify or require.js, is add additional tools to create development servers, hot module reloading (more on that soon) and the ability to load CSS, Fonts and Images directly into your JavaScript. As well, webpack helps keep application bloat down by allowing for scripts to be dynamically loaded in as they are needed, and using tree-shaking to remove extraneous code when bundling.

## Chapters
* [Installing Webpack](chapters/installing-webpack.md)
* [Using Webpack](chapters/using-webpack.md)
