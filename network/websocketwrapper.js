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

wdi.WebSocketWrapper = $.spcExtend({}, {
	ws: {},
	onopen: null,
	onmessage: null,
	onclose: null,
	onerror: null,

	init: function() {

	},

	connect: function(url, protocol) {
		this.ws = new WebSocket(url, protocol);
	},

	onOpen: function(callback) {
		this.ws.onopen = callback;
	},

	onMessage: function(callback) {
		this.ws.onmessage = callback;
	},

	onClose: function(callback) {
		this.ws.onclose = callback;
	},

	onError: function(callback) {
		this.ws.onerror = callback;
	},

	setBinaryType: function(type) {
		this.ws.binaryType = type;
	},

	close: function() {
		if (!this.ws || !this.ws.close) {
			return;
		}

		this.ws.close();
		this.ws.onopen = function () {};
		this.ws.onmessage = function () {};
		this.ws.onclose = function () {};
		this.ws.onerror = function () {};
		this.onopen = function() {};
		this.onmessage = function() {};
		this.onclose = function() {};
		this.onerror = function() {};

	},

	send: function(message) {
		this.ws.send(message);
	}
});
