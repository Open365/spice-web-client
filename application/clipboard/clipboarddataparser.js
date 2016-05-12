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

wdi.ClipboardDataParser = $.spcExtend(wdi.EventObject.prototype, {

	fileReader: null,

	init: function (params) {
		this.fileReader = params["FileReader"] || FileReader;
	},

	parse: function parse(clipboardData, callback) {
		var self = this;
		// Prioritizes mime types that appear earlier in the list
		var mimeTypes = ["image/png", "text/plain"];

		function getItemAsPojo(item, callback) {
			switch (item["kind"]) {
				case "string":
					return getItemStringAsPojo(item, callback);
				case "file":
					return getItemFileAsPojo(item, callback);
			}
		}

		function getItemStringAsPojo(item, callback) {
			var type = item.type;
			item["getAsString"](function (str) {
				return callback({
					type: type,
					blob: str
				});
			})
		}

		function getItemFileAsPojo(item, callback) {
			var type = item["type"];
			var blob = item["getAsFile"]();
			var reader = new self.fileReader();
			reader.addEventListener("loadend", function() {
				return callback({
					type: type,
					blob: reader["result"]
				})
			});
			reader.readAsArrayBuffer(blob);
		}

		var items = clipboardData["items"];

		// If the browser implements the 'items' property of the clipboard event, use it. Supports pasting images.
		// Docs: https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItemList
		if (items) {
			for (var i = 0; i < mimeTypes.length; i++) {
				var type = mimeTypes[i];
				for (var j = 0; j < items.length; j++) {
					var item = items[j];
					if (item["type"] == type) {
						return getItemAsPojo(item, callback);
					}
				}
			}
		}
		// If not, use old APIs or browser-specific hacks to get the data. This API does not allow pasting images directly.
		else if (clipboardData.getData){
			var type = "text/plain";
			if( clipboardData.types.contains(type)) {
				callback({
					type: type,
					blob: clipboardData.getData(type)
				})
			}
		}
	}
});

