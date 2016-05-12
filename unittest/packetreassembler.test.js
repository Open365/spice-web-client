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

suite('PacketReassembler', function() {
	var sut, packetController, sizeDefinerConstant;

	setup(function() {
		wdi.Debug.debug = false; //disable debugging, it slows tests
		packetController = new wdi.PacketController();
		sut = new wdi.PacketReassembler({packetController: packetController});
		sizeDefinerConstant = wdi.SizeDefiner.prototype;
	});

	suite.skip('#setListeners()', function() {

		test('Check it fires packetComplete event with reply', function() {
			var obtainedData;
			var message = new wdi.RawMessage({status: sizeDefinerConstant.STATUS_REPLY, data: [2]});
			var message2 = new wdi.RawMessage({status: sizeDefinerConstant.STATUS_REPLY_BODY, data: [3]});
			sut.addListener('packetComplete', function(e) {
				obtainedData = e[1];
			}, this);
			packetController.fire('chunkComplete', message);
			packetController.fire('chunkComplete', message2);
			assert.equal(obtainedData.status, 'reply', 'The chunkComplete event with reply packet doesn\'t fire packetComplete event');
		});

		test('Check it fires packetComplete event with errorCode', function() {
			var obtainedData;
			var message = new wdi.RawMessage({status: sizeDefinerConstant.STATUS_ERROR_CODE, data: [2]});
			sut.addListener('packetComplete', function(e) {
				obtainedData = e[1];
			}, this);
			packetController.fire('chunkComplete', message);
			assert.equal(obtainedData.status, 'errorCode', 'The chunkComplete event with errorCode packet doesn\'t fire packetComplete event');
		});

		test('Check it waits to have data with header', function() {
			var obtainedData;
			var message = new wdi.RawMessage({status: sizeDefinerConstant.STATUS_HEADER, data: [2]});
			var message2 = new wdi.RawMessage({status: sizeDefinerConstant.STATUS_BODY, data: [3]});
			sut.addListener('packetComplete', function(e) {
				obtainedData = e[1];
			}, this);
			packetController.fire('chunkComplete', message);
			packetController.fire('chunkComplete', message2);
			assert.equal(obtainedData.data.length, 2, 'The chunkComplete event with errorCode packet doesn\'t fire packetComplete event');
		});

		test('Check it waits to have the reply_body with header', function () {
			var obtainedData;
			var message = new wdi.RawMessage({status: sizeDefinerConstant.STATUS_REPLY, data: [2]});
			var message2 = new wdi.RawMessage({status: sizeDefinerConstant.STATUS_REPLY_BODY, data: [3]});
			sut.addListener('packetComplete', function(e) {
				obtainedData = e[1];
			}, this);
			packetController.fire('chunkComplete', message);
			packetController.fire('chunkComplete', message2);
			assert.equal(obtainedData.data.length, 2, 'The chunkComplete event with reply_body packet doesn\'t fire packetComplete event with all data');
		});
	});
});
