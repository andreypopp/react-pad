# react-pad

Authoring tool for React components

  * (need to wire some parts) like jsfiddle with instant preview
  * creates npm packages
  * export to gist
  * (not yet) export to github project
  * uses browserify cdn for bundling deps
  * uses xcss (xcss-cdn?) for bundling CSS deps
  * proposes a format to define an example usage of UI widget (`"example"`
    attribute of `package.json` points to an HTML file — react-pad consumes this
    to create markup for scene and read example deps, same should also work from
    command line)

You probably can't run it yet on your machine cause it depends on unreleased yet
version of [react-app](https://github.com/andreypopp/react-app).

![screenshot](https://raw.github.com/andreypopp/react-pad/master/docs/screenshot.png)
