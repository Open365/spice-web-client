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

wdi.SizeDefiner = $.spcExtend(wdi.DomainObject, {
	ERROR_CODE_SIZE: 4,
	status: null,
	STATUS_READY: 0,
	STATUS_REPLY: 1,
	STATUS_REPLY_BODY: 2,
	STATUS_ERROR_CODE: 3,
	STATUS_MESSAGE: 4,
	STATUS_HEADER: 5,
	STATUS_BODY: 6,
	isHeader: false,

	init: function(c) {
		this.status = this.STATUS_READY;
	},

	getSize: function(arr) {
		if (this.STATUS_READY === this.status) {
			this.status++;
			return wdi.SpiceLinkHeader.prototype.objectSize;
		} else if (this.STATUS_REPLY === this.status) {
			this.status++;
			return this.getReplyBodySize(arr);
		} else if (this.STATUS_REPLY_BODY === this.status) {
			this.status++;
			return this.ERROR_CODE_SIZE;
		} else if (this.STATUS_ERROR_CODE === this.status) {
			this.status++;
			this.isHeader = true;
			return 6; //wdi.SpiceDataHeader.prototype.objectSize access here is slow
		} else {
			if (this.isHeader) {
				this.isHeader = false;
				return this.getBodySizeFromArrayHeader(arr);
			} else {
				this.isHeader = true;
				return 6;//wdi.SpiceDataHeader.prototype.objectSize; access here is slow
			}
		}
	},

	getReplyBodySize: function (arr) {
		var queue = wdi.GlobalPool.create('ViewQueue');
		queue.setData(arr);
		var header = new wdi.SpiceLinkHeader().demarshall(queue);
		wdi.GlobalPool.discard('ViewQueue', queue);
		return header.size;
	},

	getBodySizeFromArrayHeader: function (arr) {
		var queue = wdi.GlobalPool.create('ViewQueue');
		queue.setData(arr);
		var header = new wdi.SpiceDataHeader().demarshall(queue);
		wdi.GlobalPool.discard('ViewQueue', queue);
		return header.size;
	},

	getStatus: function() {
		if (this.status === this.STATUS_MESSAGE && this.isHeader) {
			return this.STATUS_HEADER;
		} else if (this.status === this.STATUS_MESSAGE && !this.isHeader) {
			return this.STATUS_BODY;
		} else {
			return this.status;
		}
	}
});
