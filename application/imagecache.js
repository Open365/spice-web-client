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

wdi.ImageCache = {
	images: {},
	cursor: {},
	palettes: {},

	dispose: function () {
		wdi.Debug.log("Disposing ImageCache");
		this.images = {};
		this.cursor = {};
		this.palettes = {};
	},

	getImageFrom: function(descriptor, cb) {
	//see http://jsperf.com/todataurl-vs-getimagedata-to-base64/7
		var cnv = wdi.GlobalPool.create('Canvas');
		var imgData = this.images[descriptor.id.toString()];
		cnv.width = imgData.width;
		cnv.height = imgData.height;
		cnv.getContext('2d').putImageData(imgData,0,0);
		cb(cnv);
	},

	isImageInCache: function(descriptor) {
		if(descriptor.id.toString() in this.images) {
			return true;
		}
		return false;
	},

	delImage: function(id) {
		delete this.images[id.toString()];
	},

	addImage: function(descriptor, canvas) {
		if(canvas.getContext) {
			this.images[descriptor.id.toString()] = canvas.getContext('2d').getImageData(0,0,canvas.width, canvas.height);
		} else {
			this.images[descriptor.id.toString()] = canvas;
		}

	},

	getCursorFrom: function(cursor) {
		return this.cursor[cursor.header.unique.toString()];
	},

	addCursor: function(cursor, imageData) {
		this.cursor[cursor.header.unique.toString()] = imageData;
	},

	getPalette: function(id) {
		return this.palettes[id.toString()];
	},

	addPalette: function(id, palette) {
		this.palettes[id.toString()] = palette;
	},

	clearPalettes: function() {
		this.palettes = {};
	}
};
