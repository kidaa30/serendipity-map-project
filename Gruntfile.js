/*
 * https://medium.com/@verpixelt/get-started-with-grunt-76d29dc25b01
 */
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
            // 'dev/js/libs/jquery.js',
            'dev/js/libs/*.js',
            'dev/js/main.js',
        ],
        dest: 'prod/js/unminified.js',
      }
    },
    connect: {
      server: {
        options: {
          port: 3000,
          livereload: false
        }
      }
    },
    uglify: {
      build: {
        src: 'prod/js/production.js',
        dest: 'prod/js/production.min.js'
      }
    },
    processhtml: {
      dev: {
        files: {
          'index.html': ['index.html'] // 'destination.html': ['source.html']
        }
      },
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          'prod/css/style.css': 'dev/scss/style.scss',
           // 'destination': 'source'
        }
      }
    },
    watch: {
      scripts: {
        files: [
                'dev/js/libs/*.js',
                'dev/js/plugins/*.js',
                'dev/js/*.js',
                ],
        tasks: ['concat'],
        options: {
            spawn: false,
            livereload: false
        },
      },
      css: {
        files: ['dev/scss/**/*.scss',
                'dev/scss/*.scss',
                ],
        tasks: [ 'sass' ],
        options: {
          spawn: false,
          livereload: false
        }
      },
      html: {
        files: ['index.html'],
        options: {
            livereload: false
        }
      }
    },
    watchForProduction: {
      scripts: {
        files: [
                'dev/js/libs/*.js',
                'dev/js/plugins/*.js',
                'dev/js/*.js',
                ],
        tasks: ['concatForProduction'],
        options: {
            spawn: false,
            livereload: false
        },
      },
      css: {
        files: ['dev/scss/**/*.scss',
                'dev/scss/*.scss',
                ],
        tasks: [ 'sass' ],
        options: {
          spawn: false,
          livereload: false
        }
      },
      html: {
        files: ['index.html'],
        options: {
            livereload: false
        }
      }
    }
  });

  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-respimg');
  grunt.loadNpmTasks('grunt-pagespeed');

  // Default task(s).
  grunt.registerTask('default', [
    'connect',
    'sass',
    'watch'
    ]);

  grunt.registerTask('optimize', [
    'respimg',
    ]);

  grunt.registerTask('resize', [
    'responsive_images',
    ]);

  grunt.registerTask('speed', [
    'pagespeed',
    ]);

  grunt.registerTask('compile-sass', [
    'sass',
    ]);

  grunt.registerTask('build', [
    'connect',
    'sass',
    'watchForProduction',
    'processhtml',
    'uglify'
    ]);

};