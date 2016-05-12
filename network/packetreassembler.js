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

wdi.PacketReassembler = $.spcExtend(wdi.EventObject.prototype, {
	packetController: null,
	currentHeader: null,
	statusToString: null,
	sizeDefinerConstant: null,

	init: function(c) {
		this.superInit();
		this.packetController = c.packetController;
		this.sizeDefinerConstant = wdi.SizeDefiner.prototype;
		this.statusToString = [];
		this.statusToString[this.sizeDefinerConstant.STATUS_REPLY_BODY] = 'reply';
		this.statusToString[this.sizeDefinerConstant.STATUS_ERROR_CODE] = 'errorCode';
		this.statusToString[this.sizeDefinerConstant.STATUS_BODY] = 'spicePacket';
		this.setListeners();

	},

	dispose: function() {
		wdi.Debug.log('packetReassembler dispose');
		this.clearEvents();
		this.packetController.dispose();
		this.packetController = null;
		this.currentHeader = null;
		this.statusToString = null;
		this.sizeDefinerConstant = null;
	},

	start: function () {
		this.packetController.getNextPacket();
	},

	setListeners: function() {
		this.packetController.addListener('chunkComplete', function(e) {
			var rawMessage = e;
			var status = rawMessage.status;
			switch(status) {
				case this.sizeDefinerConstant.STATUS_HEADER:
				case this.sizeDefinerConstant.STATUS_REPLY:
					this.currentHeader = rawMessage;
					break;
				case this.sizeDefinerConstant.STATUS_REPLY_BODY:
				case this.sizeDefinerConstant.STATUS_BODY:
					var tmpBuff = new Uint8Array(rawMessage.data.length + this.currentHeader.data.length);
					tmpBuff.set(this.currentHeader.data);
					tmpBuff.set(rawMessage.data, this.currentHeader.data.length);
					rawMessage.data = tmpBuff;
					rawMessage.status = this.statusToString[status];
					this.fire('packetComplete', rawMessage);
					break;
				default:
					rawMessage.status = this.statusToString[status];
					this.fire('packetComplete', rawMessage);
					break;
			}
		}, this);
	}
});
