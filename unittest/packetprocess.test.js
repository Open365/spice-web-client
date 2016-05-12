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

suite('PacketProcess', function() {
  setup(function(){
	wdi.Debug.debug = false; //disable debugging, it slows tests
  });

  suite('#process()', function() {
	setup(function() {
		this.toRestore = [];
		this.packetProcess = new wdi.PacketProcess({
			mainProcess: true,
			displayProcess: true,
			cursorProcess: true,
			inputsProcess: true,
			playbackProcess: true
		});
	});

	test('Should throw an exception for invalid channels', function() {
		var failed = false;
		try {
			this.packetProcess.process({channel:99});
		} catch (e) {
			failed = true;
		}
		assert(failed, 'Exception expected for invalid channel');
	});

	test('Should throw an exception for null messages', function() {
		var failed = false;
		try {
			this.packetProcess.process();
		} catch (e) {
			failed = true;
		}
		assert(failed, 'Exception expected for null messages');
	});

	teardown(function() {
		this.toRestore.forEach(function(item) {
			item.restore();
		});
	});
  });
});
