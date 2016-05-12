var gruntfile = require('eyeos-gruntfile');
module.exports = function(grunt) {
    gruntfile(grunt, "spice", "unittest/", "unittest/tests.js");

    grunt.registerTask('compile', 'builds component', function() {
        gruntfile.executeCommand.call(this, 'php compile.php');
    });
};
