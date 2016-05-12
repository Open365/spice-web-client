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

wdi.BUS_TYPES = {
	file: 0,  // obsolete
	print: 1, // obsolete
	launchApplication: 2,
	windowManagement: 3,
	menu: 5,
	networkDriveManagement: 6,
	clipboard: 9,

	// This is for those messages that doesn't fit in any of
	// the previous types and doesn't deserve its own type.
	generic: 99,


	// Messages used during developing (for benchmarks and whatever).
	// you should not use them in code for production purposes.
	killApplicationDoNotUseInProductionEver: 34423423
};

wdi.BusProcess = $.spcExtend(wdi.EventObject.prototype, {
	busConnection: null,
	clientGui: null,

	init: function(c) {
		this.superInit();
		this.clientGui = c.clientGui;
		this.busConnection = c.busConnection;
	},

	dispose: function () {
		this.clientGui = null;
		this.busConnection = null;
	},

	process: function(message) {
		switch(message['verb']) {
			case "CONNECTED":
				this.busConnection.setSubscriptions();
				this.fire('busConnected');
				break;
			case "MESSAGE":
				this.parseMessage(message['body']);
				break;
			case "ERROR":
				console.error("Bus error");
				break;
			default:
				wdi.Debug.warn("Not implemented Stomp Verb: " + message['verb']);
		}
	},

	parseMessage: function(body) {
		switch(parseInt(body['type'])) {
			case wdi.BUS_TYPES.launchApplication:
				this.parseLaunchApplicationMessage(body);
				break;
			case wdi.BUS_TYPES.killApplicationDoNotUseInProductionEver:
				// this is a message we send to the other side of the bus
				// so do nothing.
				break;
			case wdi.BUS_TYPES.windowManagement:
				this.parseWindowManagementMessage(body);
				break;
			case wdi.BUS_TYPES.menu:
				this.handleMenuMessage(body);
				break;
			case wdi.BUS_TYPES.networkDriveManagement:
				this._handleNetworkDriveMessage(body);
				break;
			case wdi.BUS_TYPES.clipboard:
				this.handleClipboardMessage(body);
				break;
			default:
				this.fire('defaultTypeEvent', body);
				break;
		}
	},

	_handleNetworkDriveMessage : function(message) {
		if(message.event != 'reMountNetworkDrive') {
			this.fire('networkDriveResponse', message);
		}
	},

	getMenu: function() {
		this.busConnection.send(
			{
				"type": wdi.BUS_TYPES.menu,
				"value": false,
				"event": 'request'
			}
		)
	},

	handleMenuMessage: function(message) {
		if(message.event == 'response') {
			this.fire('menuResponse', message);
		}
	},
	handleClipboardMessage: function(message) {
		if(message.event === 'selectedText' || message.event === 'copiedText') {
			this.fire(message.event, message);
		}
	},

	parseWindowManagementMessage: function(message) {
		switch (message['event']) {
			case 'windowList':
			case 'windowCreated':
			case 'windowClosed':
			case 'windowMoved':
			case 'windowResized':
			case 'windowFocused':
			case 'windowMinimized':
			case 'windowRestored':
			case 'windowMaximized':
				this.fire(message['event'], message['value']);
				break;
			default:
				wdi.Debug.info("Event '" + message['event'] + "' not implemented.")
		}
	},

	closeWindow: function(hwnd) {
		this.busConnection.send(
			this._constructWindowManagementMessage(
				{
					"event": 'closeWindow',
					"hwnd": hwnd
				}
			)
		);
	},

	moveWindow: function(hwnd, x, y) {
		this.busConnection.send(
			this._constructWindowManagementMessage(
				{
					"event": 'moveWindow',
					"hwnd": hwnd,
					"left": x,
					"top": y
				}
			)
		);
	},

	minimizeWindow: function(hwnd) {
		this.busConnection.send(
			this._constructWindowManagementMessage(
				{
					"event": 'minimizeWindow',
					"hwnd": hwnd
				}
			)
		);
	},

	maximizeWindow: function(hwnd) {
		this.busConnection.send(
			this._constructWindowManagementMessage(
				{
					"event": 'maximizeWindow',
					"hwnd": hwnd
				}
			)
		);
	},

	restoreWindow: function(hwnd) {
		this.busConnection.send(
			this._constructWindowManagementMessage(
				{
					"event": 'restoreWindow',
					"hwnd": hwnd
				}
			)
		);
	},

	focusWindow: function(hwnd) {
		this.busConnection.send(
			this._constructWindowManagementMessage(
				{
					"event": 'focusWindow',
					"hwnd": hwnd
				}
			)
		);
	},

	resizeWindow: function(hwnd, width, height) {
		this.busConnection.send(
			this._constructWindowManagementMessage(
				{
					"event": 'resizeWindow',
					"hwnd": hwnd,
					"width": width,
					"height": height
				}
			)
		);
	},

	requestWindowList: function() {
		this.busConnection.send(
			this._constructWindowManagementMessage(
				{
					"event": 'getWindowList'
				}
			)
		)
	},

	executeCommand: function(cmd) {
		this.busConnection.send(
			{
				"type": wdi.BUS_TYPES.launchApplication,
				"application": cmd
			}
		)

	},

	refreshFileSystem: function(data) {
		this.busConnection.send(
			{
				'type': wdi.BUS_TYPES.file,
				'event': "refreshFileSystem",
				'value': {}
			}
		)
	},

	_constructGenericMessage: function (eventName, data) {
		return {
			'type': wdi.BUS_TYPES.generic,
			'event': eventName,
			'value': data || {}
		};
	},

	_constructWindowManagementMessage: function(obj) {
		if (obj['event'] === undefined) {
			throw new Error("You should pass an 'event' attribute in the object");
		}
		var ret = {
			'type': wdi.BUS_TYPES.windowManagement,
			'event': obj['event'],
			'value': {}
		};
		for (var i in obj) {
			if (i != 'event' && obj.hasOwnProperty(i)) {
				ret['value'][i] = obj[i];
			}
		}
		return ret;
	},

	reMountNetworkDrive: function(host, username, password) {
		this.busConnection.send(
			{
				"type": wdi.BUS_TYPES.networkDriveManagement,
				"event": "reMountNetworkDrive",
				"host": host,
				"username": username,
				"password": password
			}
		)
	},

	parseLaunchApplicationMessage: function (message) {
		switch (message['event']) {
			case 'applicationLauncherWrongAppPathError':
				this.fire('wrongPathError', message);
				break;
			case 'applicationLaunchedSuccessfully':
				this.fire('applicationLaunchedSuccessfully', message);
				break;
			default:
				wdi.Debug.info("Event '" + message['event'] + "' not implemented.")
		}
	},

	sendGenericMessage: function (eventName, data) {
		this.busConnection.send(
			this._constructGenericMessage(eventName, data)
		);
	}
});
