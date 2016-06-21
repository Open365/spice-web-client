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

wdi.ScanCodeObjModifier = $.spcExtend(wdi.EventObject.prototype, {
	init: function (charObj) {
		this.scanCodeObjProvider = new wdi.scanCodeObjProvider(charObj);
		this.prefix = this.scanCodeObjProvider.getPrefix();
		this.suffix = this.scanCodeObjProvider.getSufix();
	},

	removeShift: function () {
		var shiftDownScanCode = [0x2A, 0, 0, 0];
		var shiftUpScanCode = [0xAA, 0, 0, 0];

		this.prefix = this._removeKeyFromPart(shiftDownScanCode, this.prefix);
		this.scanCodeObjProvider.setPrefix(this.prefix);
		this.suffix = this._removeKeyFromPart(shiftUpScanCode, this.suffix);

		this.scanCodeObjProvider.setSuffix(this.suffix);

		return this.getScanCode();
	},

	getScanCode: function () {
		return this.scanCodeObjProvider.getScanCode();
	},

	_removeKeyFromPart: function (key, part) {
		return part.filter(function (item) {
			return !(_.isEqual(item, key))
		});
	}

});
