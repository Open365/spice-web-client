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

suite('ConnectionControl', function() {
	var sut, socket, config;

	setup(function() {
		config = {
			'heartbeatTimeout': 4000,
			'protocol': 'ws',
			'host': 'localhost',
			'port': 8000,
			'busHost': 'localhost',
            'heartbeatToken': 'heartbeat'
		};
		socket = {
			connect: function() {},
			setOnMessageCallback: function() {},
			disconnect: function() {}
		};
		sut = new wdi.ConnectionControl({socket: socket});
	});

	test('connect should call socket connect with uri', function() {
		var expectedString = config['protocol'] + '://' + config['host'] + ':' + config['port'] +
            '/websockify/destInfoToken/' + config['heartbeatToken']+'/type/raw';
		var mock = sinon.mock(socket);
		var expectation = mock.expects('connect').once().withArgs(expectedString);
		sut.connect(config);
		expectation.verify();
	});

	test('connect should call socket setOnMessageCallback with callback', function() {
		var mock = sinon.mock(socket);
		var expectation = mock.expects('setOnMessageCallback').once().withArgs(sinon.match.func);
		sut.connect(config);
		expectation.verify();
	});

	test('disconnect should call socket disconnect', function() {
		var mock = sinon.mock(socket);
		var expectation = mock.expects('disconnect').once().withArgs();
		sut.disconnect();
		expectation.verify();
	});
});
