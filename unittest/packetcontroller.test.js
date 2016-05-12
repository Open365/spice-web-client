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

suite('PacketController', function() {
	var sut, sizeDefiner, packetExtractor, toRestore;

	setup(function() {
		wdi.Debug.debug = false;
		sizeDefiner = new wdi.SizeDefiner();
		packetExtractor = new wdi.PacketExtractor({
			socketQ: new wdi.SocketQueue()
		});
		toRestore = [];
		sut = new wdi.PacketController({
			sizeDefiner: sizeDefiner,
			packetExtractor: packetExtractor
		});
	});

	teardown(function() {
		toRestore.forEach(function(item) {
			item.restore();
		});
	});

	suite('#getNextPacket()', function() {

		test('It fires chunkComplete event', function() {
			var called = false;
			var times = 0;
			var stub = sinon.stub(sizeDefiner, 'getSize');
			toRestore.push(stub);
			stub = sinon.stub(packetExtractor, 'getBytes', function(numBytes, callback, scope) {
				if (!times++)
					callback.call(scope, [0, 4, 3, 3, 5, 2, 4]);
			});
			toRestore.push(stub);
			sut.addListener('chunkComplete', function() {
				called = true;
			}, this);
			sut.getNextPacket();
			assert.isTrue(called, 'The chunkComplete event never fired');
		});

		test('It calls getStatus from SizeDefiner', function() {
			var times = 0;
			var stub = sinon.stub(sizeDefiner, 'getSize');
			toRestore.push(stub);
			stub = sinon.stub(packetExtractor, 'getBytes', function(numBytes, callback, scope) {
				if (!times++)
					callback.call(scope, [0, 4, 3, 3, 5, 2, 4]);
			});
			toRestore.push(stub);
			var mock = sinon.mock(sizeDefiner);
			var expectation = mock.expects('getStatus').once();
			toRestore.push(mock);
			sut.getNextPacket();
			expectation.verify();
		});

		test('It calls getSize from sizeDefiner', function() {
			var mock = sinon.mock(sizeDefiner);
			var expectation = mock.expects('getSize').once();

			toRestore.push(mock);
			var stub = sinon.stub(packetExtractor, 'getBytes');
			toRestore.push(stub);
			sut.getNextPacket();
			expectation.verify();
		});

		test('It calls getBytes from packetExtractor', function() {
			var mock = sinon.mock(packetExtractor);
			var expectation = mock.expects('getBytes').once();

			toRestore.push(mock);
			var stub = sinon.stub(sizeDefiner, 'getSize');
			toRestore.push(stub);
			sut.getNextPacket();
			expectation.verify();
		});

		test('It calls getSize from sizeDefiner with the last data acquired', function() {
			var header = [4, 0, 12, 0, 0, 0];
			var mock = sinon.mock(sizeDefiner);
			var expectation = mock.expects('getSize').once().withArgs(header);

			toRestore.push(mock);
			var stub = sinon.stub(packetExtractor, 'getBytes');
			toRestore.push(stub);
			sut.getNextPacket(header);
			expectation.verify();
		});
	});
});
