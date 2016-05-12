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

suite('BusConnection', function() {
	var sut, socket;
	var clusterNodeChooser;
	var clusterGetAnotherStub;

	setup(function() {
		config = {
			useBus: true,
			protocol: 'ws',
			host: 'localhost',
			port: 8000,
			busUser: 'test',
			busPass: 'kjasdhfadis',
			busSubscriptions: '/topic'
		};

		clusterNodeChooser = {
			getAnother: function () {
				return {
					host: 'somehost1',
					port: 'someport1'
				}
			},
			setNodeList: function () {
			}
		};

		socket = new wdi.WebSocketWrapper();

		sut = new wdi.BusConnection({
			websocket: socket,
			binary: true,
			clusterNodeChooser: clusterNodeChooser
		});
	});

	function getConfigWithNumberOfBusClusterNodes(config, numberOfBusNodes) {
		var busHostList = [];
		var i;
		for (i = 1; i <= numberOfBusNodes; i++) {
			busHostList.push({
				host: 'somehost' + i,
				port: 'someport' + i
			});
		}
		config.busHostList = busHostList;
		return config;
	}

	function getConfigWithBusHostAndBusPort(config) {
		config.busHost = 'somehost1';
		config.busPort = 'someport1';
		return config;
	}

	test('connect should call socket connect with uri when using busHostList', function() {
		var mock = sinon.mock(socket);
		var expectation = mock
			.expects('connect')
			.once()
			.withExactArgs(
				'ws://localhost:8000/websockify/host/somehost1/port/someport1/type/raw',
				'binary'
			);

		sut.connect(getConfigWithNumberOfBusClusterNodes(config, 3));

		expectation.verify();
	});

	test('connect should call socket connect with uri when using busHost and busPort', function () {
		var mock = sinon.mock(socket);
		var expectation = mock
			.expects('connect')
			.once()
			.withExactArgs(
				'ws://localhost:8000/websockify/host/somehost1/port/someport1/type/raw',
				'binary'
			);

		sut.connect(getConfigWithBusHostAndBusPort(config));

	});

	test('connect should call websocket setBinaryType on binary', function() {
		var mock = sinon.mock(socket);
		var stub = sinon.stub(socket, 'connect');
		var expectation = mock.expects('setBinaryType').once().withExactArgs('arraybuffer');
		sut.connect(getConfigWithNumberOfBusClusterNodes(config, 3));
		expectation.verify();
	});

	test('disconnect should call socket close', function() {
		var mock = sinon.mock(socket);
		var expectation = mock.expects('close').once().withExactArgs();
		sut.disconnect();
		expectation.verify();
	});

	test('send should call socket send', function() {
		var mock = sinon.mock(socket);
		var expectation = mock.expects('send').once();
		sut.send('message');
		expectation.verify();
	});

	//test('setListeners: we call _connectToNextHost again when the ws closes', function () {
	//	var setTimeoutStub = sinon.stub(window, 'setTimeout', function (fn, timeout) {
	//		fn();
	//	});
	//
	//	var wsOnCloseStub = sinon.stub(socket, 'onClose', function (fn) {
	//		fn();
	//	});
	//
	//	var mock = sinon.mock(sut);
	//	var expectation =  mock
	//		.expects('_connectToNextHost')
	//		.once()
	//		.withExactArgs();
	//
	//	sut.setListeners();
	//
	//	expectation.verify;
	//});
});
