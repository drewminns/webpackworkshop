# Installing Webpack

To install Webpack, we need to utilize the NPM/Yarn ecosystem to inform how we manage project dependencies and run our scripts.

In your terminal, navigate to your project directory and run `npm init -y` to initialize the directory as an NPM project.

__You can also run `npm init` if you want to provide additional information about your project__

Once that script has been run, we can now install webpack to our project. As of writing, webpack is currently in version 2.4.1. There are significant differences between version 1 and 2 so be aware of what version your application is running.

In the terminal, let's install webpack to our project by running `npm install webpack --save-dev`.

Typically, webpack will only be used as a dev-dependency as we will use it during development and when ready to put our project live, we will use webpack to compile all our assets as needed. If you use webpack to handle bundling on a server, for example with server side rendering, you will need to install webpack and all other webpack related dependencies with the `--save` flag.
