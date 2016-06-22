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

suite("ScanCodeObjModifier", function() {
	var sut;

	suite('#removeShift', function () {
		test('return the correct scancode without shift key (up and down)', function () {
			var charObj = {"prefix":[[42,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[[170,0,0,0]]};
			sut = new wdi.ScanCodeObjModifier(charObj);
			var scanCode = sut.removeShift();
			assert.deepEqual(scanCode, [[0x16, 0, 0, 0], [0x96, 0, 0, 0]]);
		});
	});

	suite('#containsShiftUp', function () {
		function exercise (charObj) {
			sut = new wdi.ScanCodeObjModifier(charObj);
			return sut.containsShiftDown();
		}

		test('returns true if shiftup key found in prefix', function () {
			var charObj = {"prefix":[[42,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[[170,0,0,0]]};
			var containsShiftDown = exercise(charObj);
			assert.isTrue(containsShiftDown);
		});

		test('returns false if shiftup key not found in prefix', function () {
			var charObj = {"prefix":[[224,56,0,0]],"main":[[3,0,0,0],[131,0,0,0]],"suffix":[[224,184,0,0]]};
			var containsShiftDown = exercise(charObj);
			assert.isFalse(containsShiftDown);
		});
	});

	suite('#addShiftUp', function () {
		function exercise (charObj) {
			sut = new wdi.ScanCodeObjModifier(charObj);
			return sut.addShiftUp();
		}

		test('adds shiftup to the beginning of the prefix', function () {
			var charObj = {"prefix":[[42,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[]};
			var expectedCharObj = new wdi.ScanCodeObjModifier({"prefix":[[170,0,0,0], [42,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[]});
			exercise(charObj);
			assert.deepEqual(sut.getScanCode(), expectedCharObj.getScanCode());
		});

	});

	suite('#addShiftDown', function () {
		function exercise (charObj) {
			sut = new wdi.ScanCodeObjModifier(charObj);
			return sut.addShiftDown();
		}

		test('adds addShiftDown to the end of the suffix', function () {
			var charObj = {"prefix":[[224,56,0,0]],"main":[[5,0,0,0],[133,0,0,0]],"suffix":[[224,184,0,0]]};
			var expectedCharObj = new wdi.ScanCodeObjModifier({"prefix":[[224,56,0,0]],"main":[[5,0,0,0],[133,0,0,0]],"suffix":[[224,184,0,0], [42,0,0,0]]});
			exercise(charObj);
			assert.deepEqual(sut.getScanCode(), expectedCharObj.getScanCode());
		});

	});

});

