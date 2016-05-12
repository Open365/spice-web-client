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

suite('ClipboardDataParser', function() {
	var sut;

	setup(function() {
		var fileReader = sinon.stub();
		fileReader.readAsArrayBuffer = function (blob) {
			fileReader.result = blob;
			fileReader.events['loadend']();
		};
		fileReader.addEventListener = function (eventname, cb){
			fileReader.events = {};
			fileReader.events[eventname] = cb;
		};
		sut = new wdi.ClipboardDataParser({"FileReader": function() { return fileReader}});

	});

	teardown(function () {

	});

	suite('parse', function () {

		test('when clipboardData contains text should parse it correctly', function(done) {
			var fakeItem = {
				"kind": "string",
				"type":"text/plain",
				getAsString: function (cb) {cb('fakeCopiedString')}
			};
			var fakeClipboardData = _constructFakeClipboardData(fakeItem);

			var expectedParsedClipboardData = {
				type: 'text/plain',
				blob: 'fakeCopiedString'
			};

			sut.parse(fakeClipboardData, function (parsedClipboard){
				assert.deepEqual(expectedParsedClipboardData, parsedClipboard);
				done();
			});
		});

		test('when clipboardData contains an image should parse it correctly', function(done) {
			var fakeItem = {
				"kind": "file",
				"type":"image/png",
				getAsFile: sinon.stub().returns(new ArrayBuffer(1))
			};
			var fakeClipboardData = _constructFakeClipboardData(fakeItem);

			var expectedParsedClipboardData = {
				type: 'image/png',
				blob: new ArrayBuffer(1)
			};

			sut.parse(fakeClipboardData, function (parsedClipboard){
				assert.equal(expectedParsedClipboardData.type, parsedClipboard.type);
				assert.equal(typeof expectedParsedClipboardData.content, typeof parsedClipboard.content);
				done();
			});
		});

		function _constructFakeClipboardData (fakeItem) {
			return {
				items: [fakeItem]
			};
		}
	});

});
