module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'lib/**/*.js',
        'spec/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jasmine_node: {
      options: {
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'
      },
      all: ['spec/']
    },
    lintspaces: {
      all: {
        lib: [
          'lib/**/*.js',
          'spec/**/*.js'
        ],
        options: {
          newline: true,
          newlineMaximum: 2,
          trailingspaces: true,
          indentation: 'spaces',
          spaces: 2,
          indentationGuess: true
        }
      }
    },
    jsdoc : {
      dist : {
        src: ['lib/**/*.js', 'spec/**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-lintspaces');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('test', ['jshint', 'jasmine_node', 'lintspaces']);
  grunt.registerTask('doc', ['jsdoc']);
  grunt.registerTask('dev', ['test', 'doc']);
  grunt.registerTask('default', ['dev']);
};
