'use strict';

var util = require('util');

module.exports = function(grunt) {

	grunt.registerMultiTask('jslinker', 'Autoinsert script tags (or other filebased tags) in an html file', function() {
    var options = this.options({
      target:"", 
      exclude:[],
      start_tag: "<!--SCRIPTS-->",
      end_tag: "<!--SCRIPTS END-->",
      prefix_path:''
    });

    var page = grunt.file.read(options.target);
    var start = page.indexOf(options.start_tag);
    var end = page.indexOf(options.end_tag, start);
    var indent_level = get_indent_level(page, start);

    var excluded_files = grunt.file.expand(options.exclude);
    var scripts = "\n";
    this.filesSrc.filter(function(file_path){
      if(grunt.util._(excluded_files).contains(file_path)){
        return false;
      }
      return true;
    }).map(function(file_path){
      scripts += indent_level + "<script src='"+options.prefix_path+file_path.replace(options.relative_to, '')+"'></script>\n";
    });

    var page_top = page.substr(0, start + options.start_tag.length);
    var page_bottom = indent_level + page.substr(end);

    var newPage = page_top+scripts+page_bottom;
    grunt.file.write(options.target, newPage);
  });

  var get_indent_level = function(page, character){
    var indent_level = "";
    var counter = 2;
    var current_indent_char = page[character-counter];
    while(current_indent_char !== "\n"){
      indent_level+= " ";
      current_indent_char = page[character-counter];
      counter++;
    }
    return indent_level;
  };

};
