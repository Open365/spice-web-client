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

suite('SizeDefiner', function() {
	var sut;
	var headerArray = [4, 0, 12, 0, 0, 0];
	var headerRLRArray = [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0];
	setup(function() {
		wdi.Debug.debug = false;
		sut = new wdi.SizeDefiner();
	});

	suite('#getSize()', function() {


		test('The first time it is called returns the Red Link header size', function() {
			var size = sut.getSize();
			assert.equal(size, wdi.SpiceLinkHeader.prototype.objectSize, 'Red Link Header size doesn\'t match');
		});

		test('The second time it is called returns the Red Link Reply body size', function () {
			sut.getSize();
			var size = sut.getSize(headerRLRArray);
			assert.equal(size, headerArray[2], 'Body syze size doesn\'t match');
		});

		test('The third time it is called returns the errorCode size', function() {
			sut.getSize();
			sut.getSize(headerRLRArray);
			var size = sut.getSize();
			assert.equal(size, 4, 'Error Code size doesn\'t match');
		});

		test('The fourth time it is called returns the Header size', function() {
			sut.getSize();
			sut.getSize(headerRLRArray);
			sut.getSize();
			var size = sut.getSize();
			assert.equal(size, wdi.SpiceDataHeader.prototype.objectSize, 'Spice Header Size doesn\'t match');
		});

		test('From the fifth time we have it returns the size from a passed header', function() {
			sut.getSize();
			sut.getSize(headerRLRArray);
			sut.getSize();
			sut.getSize();
			var size = sut.getSize(headerArray);
			assert.equal(size, 12, 'Spice Body Packet Size doesn\'t match');
		});

		test('The data must still be in the array after the call', function () {
			sut.getSize();
			sut.getSize(headerRLRArray);
			sut.getSize();
			sut.getSize();
			var size = sut.getSize(headerArray);
			assert.equal(headerArray.length, 6, "The array doesn't have the data");
		});
	});

	suite('#getStatus()', function() {
		
		test('Returns reply the first time', function() {
			sut.getSize();
			assert.equal(sut.STATUS_REPLY, sut.getStatus());
		});

		test('Returns error code the third time', function() {
			sut.getSize();
			sut.getSize(headerRLRArray);
			sut.getSize();
			assert.equal(sut.STATUS_ERROR_CODE, sut.getStatus());
		});

		test('Returns header when header size is returned', function() {
			sut.getSize();
			sut.getSize(headerRLRArray);
			sut.getSize();
			sut.getSize();
			assert.equal(sut.STATUS_HEADER, sut.getStatus());
		});

		test('Returns body when body size is returned', function() {
			sut.getSize();
			sut.getSize(headerRLRArray);
			sut.getSize();
			sut.getSize();
			var size = sut.getSize(headerRLRArray);
			assert.equal(sut.STATUS_BODY, sut.getStatus());
		});
	});
});
