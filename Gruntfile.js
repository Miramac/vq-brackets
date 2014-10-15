/*globals module, process */

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),  
    sync: {
      main: {
        files: [{
          cwd: './',
          src: [
            '**', /* Include everything */
            '!.git' /* but exclude .git dir */
          ],
          dest: process.env.APPDATA + '/Brackets/extensions/user/<%= pkg.name %>/',
        }],
        pretend: false, // Don't do any IO. Before you run the task with `updateAndDelete` PLEASE MAKE SURE it doesn't remove too much.
        verbose: true, // Display log messages when copying files
       // ignoreInDest: "**/*.js", // Never remove js files from destination
        updateAndDelete: true
      }
    },
    watch: {
      scripts: {
        files: ['**/*'],
        tasks: ['sync'],
        options: {
          spawn: false,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-sync');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['sync', 'watch']);

};
