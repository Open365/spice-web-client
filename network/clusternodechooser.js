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

wdi.ClusterNodeChooser = $.spcExtend(wdi.EventObject.prototype, {
	init: function (c) {
	},

	setNodeList: function (nodeList) {
		this._nodeList = this._shuffle(nodeList);
		this._nodeListLength = this._nodeList.length;
		this._currentIndex = 0;
	},

	getAnother: function () {
		var toReturn = this._nodeList[this._currentIndex++ % this._nodeListLength];
		return toReturn;
	},

	// recipe from: http://stackoverflow.com/a/6274398
	_shuffle: function (list) {
		var counter = list.length,
			temp,
			index;
		while (counter > 0) {
			index = Math.floor(Math.random() * counter);
			counter--;
			temp = list[counter];
			list[counter] = list[index];
			list[index] = temp;
		}
		return list;
	}
});
