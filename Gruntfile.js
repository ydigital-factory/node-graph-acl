module.exports = function(grunt) {
  //var pkg = require("./package.json");

  grunt.initConfig({
    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec',
        jUnit: {
          report: false
        }
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
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jshint', 'jasmine_node']);

  grunt.registerTask('default', ['jshint', 'jasmine_node']);
};
