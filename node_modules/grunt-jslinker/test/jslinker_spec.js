'use strict';

describe('jslinker', function () {

  var grunt = require('grunt');

  beforeEach(function () {
  });

  describe("default task", function(){
    it('should include all js files', function () {
      var actual = grunt.file.read('test/fixtures/target_files/default.html');
      var expected = grunt.file.read('test/fixtures/expected/default.html');
      expect(actual).toEqual(expected);
    });
  })

  describe("exclude task", function(){
    it('should include all js files except excluded on options', function () {
      var actual = grunt.file.read('test/fixtures/target_files/excluded.html');
      var expected = grunt.file.read('test/fixtures/expected/excluded.html');
      expect(actual).toEqual(expected);
    });
  })

  describe("duplicated_end_tag task", function(){
    it('should include all js between the two tags', function () {
      var actual = grunt.file.read('test/fixtures/target_files/duplicated_end_tag.html');
      var expected = grunt.file.read('test/fixtures/expected/duplicated_end_tag.html');
      expect(actual).toEqual(expected);
    });
  })

});
