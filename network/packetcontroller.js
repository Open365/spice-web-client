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

wdi.PacketController = $.spcExtend(wdi.EventObject.prototype, {
	sizeDefiner: null,
	packetExtractor: null,
	
	init: function(c) {
		this.superInit();
		this.sizeDefiner = c.sizeDefiner;
		this.packetExtractor = c.packetExtractor;
	},

	dispose: function() {
		wdi.Debug.log('PacketTroller dispose');
		this.clearEvents();
		this.packetExtractor.dispose();
		this.packetExtractor = null;
		this.sizeDefiner = null;
	},

	getNextPacket: function(data) {
		var self = this;
		if (wdi.logOperations) {
			wdi.DataLogger.setNetworkTimeStart();
		}
		var size = this.sizeDefiner.getSize(data);
		this.packetExtractor.getBytes(size, function(bytes) {
			var status = this.sizeDefiner.getStatus();

			this.execute(new wdi.RawMessage({status: status, data: bytes}));

			self.getNextPacket(bytes);


		}, this);
	},

	execute: function(message) {
		try {
			this.fire('chunkComplete', message);
		} catch (e) {
			console.error('PacketTroller: ', e);
		}
	}
});
