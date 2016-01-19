module.exports = function(grunt) {

  grunt.initConfig({

    concurrent: {
      assets: ['copy', 'stylus', 'jade'],
      start: {
        tasks: ['watch', 'nodemon'],
        options: {
            logConcurrentOutput: true
        }
      }
    },

    clean: {
      build: {
        files: [{ src: ['public/*'] }]
      },
      css: {
        files: [{ src: ['public/css/*'] }]
      },
      html: {
        files: [{ src: ['public/html/*'] }]
      },
      img: {
        files: [{ src: ['public/img/*'] }]
      },
      js: {
        files: [{ src: ['public/js/*'] }]
      },
      annotated: {
        files: [{ src: ['tmp/**/*'] }]
      }
    },

    // JS
    ngAnnotate: {
      dev: {
        files: [
          {
            expand: true,
            src: ['app/assets/js/**/*.js'],
            dest: 'tmp',
            ext: '.annotated.js',
            extDot: 'last'
          }
        ]
      },
      prod: {
        files: [
          {
            expand: true,
            src: ['tmp/**/*.js'],
            dest: 'tmp',
            ext: '.annotated.js',
            extDot: 'last'
          }
        ]
      }
    },

    uglify: {
      dev: {
        options: {
          mangle: false,
          beautify: true
        },
        files: {
          'public/js/base.min.js': [ 'tmp/base.annotated.js', 'tmp/**/*.annotated.js' ],
          'public/js/vendor.min.js': [ 'app/assets/vendor/angular.js', 'app/assets/vendor/**/*.js' ]
        }
      },
      prod: {
        options: {
          mangle: true,
          beautify: false
        },
        files: {
          'public/js/base.min.js': [ 'tmp/assets/js/base.annotated.js', 'tmp/assets/js/**/*.annotated.js' ],
          'public/js/vendor.min.js': [ 'app/assets/vendor/angular.js', 'app/assets/vendor/**/*.js' ]
        }
      }
    },

    // ICON SPRITE
    sprite:{
      all: {
        src: 'app/assets/img/icons/*.png',
        dest: 'app/assets/img/spritesheet.png',
        destCss: 'app/assets/css/sprites.styl',
        cssFormat: 'stylus',
        cssVarMap: function (sprite) {
          sprite.name = 'icon-' + sprite.name;
        }
      }
    },

    // IMG & JS
    copy: {
      main: {
        files: [
          //copy images to public folder
          {expand: true, cwd: 'app/assets/img/', src: ['**'], dest: 'public/img/'},
          {expand: true, cwd: 'app/assets/fonts/', src: ['**'], dest: 'public/fonts/'}
        ]
      }
    },

    // CSS
    stylus: {
      compile: {
        files: {
          'public/css/base.css': 'app/assets/css/base.styl',
          'public/css/vendor.css': 'app/assets/css/vendor.styl'
        },
        options: {
          'include css': true
        }
      }
    },

    // HTML
    jade: {
      compile: {
        files: [{
          expand: true,
          cwd: 'client',
          src: ['**/*.jade'],
          dest: 'public/html',
          ext: '.html'
        }]
      }
    },

    watch: {
      js: {
        files: 'app/assets/js/**/*.js',
        tasks: ['clean:js', 'ngAnnotate:dev', 'uglify:dev', 'clean:annotated']
      },
      img: {
        files: 'app/assets/img/**',
        tasks: ['clean:img', 'copy:main']
      },
      stylus: {
        files: 'app/assets/css/**',
        tasks: ['clean:css', 'stylus']
      },
      html: {
        files: 'client/**/*.jade',
        tasks: ['clean:html', 'jade']
      }
    },

    nodemon: {
      dev: {
        script: 'app.js'
      }
    },

    strip : {
      main : {
        src : 'public/js/base.min.js',
        dest : 'public/js/base.min.js',
        options : {
          nodes : ['console.log']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-strip');

  grunt.registerTask('default', ['clean:build', 'ngAnnotate:dev', 'uglify:dev', 'clean:annotated', 'concurrent:assets', 'concurrent:start']);

};
