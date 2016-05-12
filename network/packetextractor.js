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

wdi.PacketExtractor = $.spcExtend(wdi.EventObject.prototype, {
	socketQ: null,
	numBytes: null,
	callback: null,
	scope: null,

	init: function(c) {
		this.superInit();
		this.socketQ = c.socketQ;
		this.setListener();
	},

	dispose: function() {
		this.clearEvents();
		this.socketQ.disconnect();
		this.socketQ = null;
		this.numBytes = null;
		this.callback = null;
		this.scope = null;
	},

	setListener: function() {
		this.socketQ.addListener('message', function() {
			if (wdi.logOperations) {
				wdi.DataLogger.setNetworkTimeStart();
			}
			this.getBytes(this.numBytes, this.callback, this.scope);
		}, this);
	},

	getBytes: function(numBytes, callback, scope) {
		var retLength = this.socketQ.rQ.getLength();
		this.numBytes = numBytes;
		this.callback = callback;
		this.scope = scope;
		
		if (numBytes !== null && retLength >= numBytes) {
			var ret;
			if (numBytes) {
				ret = this.socketQ.rQ.shift(numBytes);
			} else {
				ret = new Uint8Array(0);
			}
			this.numBytes = null;
			this.callback = null;
			this.scope = null;
			callback.call(scope, ret);
		} else {
			if (wdi.logOperations) {
				wdi.DataLogger.logNetworkTime();
			}
		}
	}
});
