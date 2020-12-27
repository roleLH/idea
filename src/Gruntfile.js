module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    connect: {
      server: {
        options: {
          port: 8000,
          keepalive: true,
          base: '.'
        }
      }
    },



  });


  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('serve', [ 'connect']);
}
