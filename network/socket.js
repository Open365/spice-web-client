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

wdi.socketStatus = {
	'idle':0,
	'prepared':1,
	'connected':2,
	'disconnected':3,
	'failed':4
};
//Works only with arrays of bytes (this means each value is a number in 0 to 255)
wdi.Socket = $.spcExtend(wdi.EventObject.prototype, {
	websocket: null,
	status: wdi.socketStatus.idle,
	binary: false,
	
	connect: function(uri) {
		var self = this;
		var protocol = 'base64'; //default protocol
		
		if(Modernizr['websocketsbinary']) {
			protocol = 'binary';
			this.binary = true;
		}

		this.websocket = new WebSocket(uri, protocol);

		wdi.Debug.log("Socket: using protocol: "+protocol);
		
		if(this.binary) {
			this.websocket.binaryType = 'arraybuffer';
		}
		
		this.status = wdi.socketStatus.prepared;
		this.websocket.onopen = function() {
			self.status = wdi.socketStatus.connected;
			self.fire('open');
		};
		this.websocket.onmessage = function(e) {
			self.fire('message', e.data);
		};
		this.websocket.onclose = function(e) {
			self.status = wdi.socketStatus.disconnected;
			console.warn('Spice Web Client: ', e.code, e.reason);
			self.disconnect();
			self.fire('close', e);
		};
		this.websocket.onerror = function(e) {
			self.status = wdi.socketStatus.failed;
			self.fire('error', e);
		};
	},

	setOnMessageCallback: function(callback) {
		this.websocket.onmessage = callback;
	},
	
	send: function(message) {
		try {
			this.websocket.send(this.encode_message(message));
		} catch (err) {
			this.status = wdi.socketStatus.failed;
			this.fire('error', err);
		}
	},
	
	disconnect: function() {
		if (this.websocket) {
			this.websocket.onopen = function() {};
			this.websocket.onmessage = function() {};
			this.websocket.onclose = function() {};
			this.websocket.onerror = function() {};
			this.websocket.close();
			this.status = wdi.socketStatus.idle;
			this.binary = false;
			this.websocket = null;
		}
	},
	
	setStatus: function(status) {
		this.status = status;
		this.fire('status', status);
	},
	
	getStatus: function() {
		return this.status;
	},
	
	encode_message: function(mess) {
		if(!this.binary) {
			var arr = Base64.encode(mess);
			return arr;
		} 
		
		var len = mess.length;
		
		var buffer = new ArrayBuffer(len);
		var u8 = new Uint8Array(buffer);
		
		u8.set(mess);
	
		return u8;
	}
});
