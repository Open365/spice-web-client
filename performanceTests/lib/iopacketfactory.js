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

window.performanceTest = window.performanceTest || {};
performanceTest.ioPacketFactory = (function () {
	var ioPacketFactory = {
		getMouseMove: function (x, y) {
			return [
				[
					["mousemove", [x, y, 0]],
					"mousemove"
				]
			];
		},

		getScrollDown: function () {
			return [
				[
					["mousedown", 4],
					"mousedown"
				],
				[
					["mouseup", 4],
					"mouseup"
				]
			];
		},

		getScrollUp: function () {
			return [
				[
					["mousedown", 3],
					"mousedown"
				],
				[
					["mouseup", 3],
					"mouseup"
				]
			];
		},

		getKeypressChar: function (char) {
			var scanCode;
			if (char === ' ') {
				scanCode = [0x39, 0, 0];
			} else {
				scanCode = wdi.Keymap.charmap[char]
			}
			return [
				[
					["keypress", [
						{
							hasScanCode: true,
							scanCode: wdi.Keymap.charmap[char]
						}
					]],
					"keypress"
				]
			];
		},

		getKeydownSpecialChar: function (char) {
			var type = "keydown";
			return this.getSpecialCharByType(type, char);
		},

		getSpecialCharByType: function (type, char) {
			return [
				[type, [
					{
						type: type,
						keyCode: char,
						generated: false,
						charCode: char
					}
				]],
				type
			];
		},

		getKeyupSpecialChar: function (char) {
			var type = "keyup";
			return this.getSpecialCharByType(type, char);
		}
	};
	return ioPacketFactory;
})();
