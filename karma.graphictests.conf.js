/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

// karma.conf.js
 module.exports = function(config) {
   config.set({
       frameworks: ['mocha', 'chai'],
       reporters: ['progress', 'junit'],
           urlRoot: "base/",
           files: [
                 'jsquic.js',
                 'lib/prng4.js',
                 'lib/rng.js',
                 'lib/modernizr.js',
                 'lib/jquery-2.0.3.js',
                 'lib/lodash.4.0.0.min.js',
                 'lib/utils.js',
                 'spiceobjects/*.js',
                 'spiceobjects/generated/*.js',
                 'lib/**/*.js',
                 'network/**/*',
                 'application/**/*.js',
                 'process/**/*.js',
                 'keymaps/**/*',
                 'testlibs//**/*',
                 {pattern: 'unittest/graphictestfiles/SPICE*', included: false},
                 'unittest/graphictestfiles/uris.js',
                 'unittest/graphictest.test.js'
           ],
           //singleRun: true,
               junitReporter: {
                    outputFile: 'build/reports/graphicTests/test-results.xml'
                    //suite: ''
           },
           client: {
               mocha: {
                 ui: 'tdd'
               }
           }
       }
    )
 };
