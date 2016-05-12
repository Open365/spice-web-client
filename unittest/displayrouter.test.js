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

suite('DisplayProcess', function() {
	var sut;

	setup(function(){
		wdi.Debug.debug = false; //disable debugging, it slows tests
	});

	suite('#processPacket()', function() {
		setup(function() {



			wdi.ExecutionControl.sync = true;
		});

		test('displayRouter packetProcess should execute the correct route', sinon.test(function() {
			var executed = false;
			sut = new wdi.DisplayRouter({
				routeList: {
					45: function() {
						executed = true;
					}
				}
			});

			sut.processPacket({messageType:45});
			assert.isTrue(executed);
		}));

	});
});
