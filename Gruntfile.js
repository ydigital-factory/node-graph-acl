module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    jasmine_node: {
      options: {
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'
      },
      all: ['spec/']
    },
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
    jsdoc : {
      dist : {
        src: ['lib/**/*.js', 'spec/**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('test', ['jshint', 'jasmine_node']);
  grunt.registerTask('doc', ['jsdoc']);
  grunt.registerTask('dev', ['test', 'doc']);
  grunt.registerTask('default', ['dev']);
};
