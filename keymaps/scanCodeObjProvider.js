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

wdi.scanCodeObjProvider = $.spcExtend(wdi.EventObject.prototype, {
	init: function (charObj) {
		this.charObj = charObj;
		this.prefix = this.charObj.prefix || [];
		this.suffix = this.charObj.suffix || [];
	},

	getPrefix: function () {
		return this.prefix;
	},

	getSufix: function () {
		return this.suffix;
	},

	setPrefix: function (val) {
		this.prefix = val;
	},
	setSuffix: function (val) {
		this.suffix = val;
	},

	getScanCode: function () {
		var res = [];
		var prefix = this.getPrefix();
		if (prefix.length > 0) {
			res = res.concat(prefix);
		}
		var main = this.charObj.main;
		res = res.concat(main);

		var suffix = this.getSufix();
		if (suffix.length > 0) {
			res = res.concat(suffix);
		}

		return res;
	}
});
