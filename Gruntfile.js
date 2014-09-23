module.exports = function(grunt) {
  grunt.initConfig({

    sync: {
      main: {
        files: [{
          cwd: './',
          src: [
            '**', /* Include everything */
            '!.git' /* but exclude .git dir */
          ],
          dest: process.env.APPDATA + '\\Brackets\\extensions\\user\\vq-brackets\\',
        }],
        pretend: false, // Don't do any IO. Before you run the task with `updateAndDelete` PLEASE MAKE SURE it doesn't remove too much.
        verbose: true, // Display log messages when copying files
       // ignoreInDest: "**/*.js", // Never remove js files from destination
        updateAndDelete: true 
      }
    }
  });

  grunt.loadNpmTasks('grunt-sync');
  grunt.registerTask('default', ['sync']);
  
};