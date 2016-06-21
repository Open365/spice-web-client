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
});

