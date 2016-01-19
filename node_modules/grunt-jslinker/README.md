# grunt-jslinker

> Autoinsert script tags (or other filebased tags) in an html file

## Getting Started
This plugin requires Grunt `~0.4.x`

When the task is run the destination file(s) is updated with script tags pointing to all the source files. The reason this plugin was built was to automate the process of inserting script tags when building large web apps.

```shell
npm install grunt-jslinker 
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jslinker');
```

## The "jslinker" task

### Overview
In your project's Gruntfile, add a section named `jslinker` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  jslinker: {
    default:{
      options: {
        target: "app/index.html",
        start_tag: "<!--SCRIPTS-->",
        end_tag: "<!--SCRIPTS END-->",
        relative_to: "app/",
        exclude: ["app/scripts/specs/**.js"]
      },
      src: ["app/scripts/**/*.js"]
    }
  }
})
```

### Options

#### options.start_tag
Type: `String`
Default value: `'<!--SCRIPTS-->'`

Script tags are places between the start_tag and end_tag

#### options.end_tag
Type: `String`
Default value: `'<!--SCRIPTS END-->'`

Script tags are places between the startTag and endTag

#### options.exclude
Type: `String`
Default value: `''`

Prevent files from being included

#### options.relative_to
Type: `String`
Default value: `''`

The root of the application. Script links are relative from this folder.

#### options.prefix_path
Type: `String`
Default value: `''`

string to prefix all include paths


