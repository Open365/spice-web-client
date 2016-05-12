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


wdi.LocalClipboard = $.spcExtend(wdi.EventObject.prototype, {

	init: function (c) {
		this.clipboardContainer = $('<div style="position:absolute;top:-10000000px;"><textarea id="remoteClipboard" style="position:absolute;top:-10000000px;font-size: 20px;color:black;z-index: 100" rows="4" cols="50"></textarea></div>');
		//this.clipboardContent = $('#remoteClipboard');
		$('body').append(this.clipboardContainer);

		this.clientGui = c.clientGui;
		this.eventHandlers = {
			keydown: this.triggerCopyToClipboard.bind(this)
		};

		$(document).on(this.eventHandlers);

		this.delayCopyEvents = {
			mousedown: this.copyToClipboard.bind(this),
			mouseup: this.copyToClipboard.bind(this),
			keydown: this.copyToClipboard.bind(this),
			keyup: this.copyToClipboard.bind(this)
		};
		$(document).on(this.delayCopyEvents);
	},

	updateClipboardBuffer: function (content) {
		//this.clipboardContent.val(content);
		$('#remoteClipboard').val(content);

	},

	triggerCopyToClipboard: function (e) {
		function isMac () {
			return navigator.appVersion.indexOf('Mac') != -1
		}
		function isCopyShortcutPressed(e) {
			var ctrlKey = e.ctrlKey;
			if(isMac()) {
				ctrlKey = e.metaKey;
			}
			return e.keyCode === 67 && ctrlKey;
		}

		if(isCopyShortcutPressed(e)){
			this.clipboardCopyDelay = Date.now() + 1000; //now + 1 seconds;
			e.preventDefault();
			this.copyToClipboard(e);
		}
	},

	copyToClipboard: function (e) {
		var self = this;

		if (!this.clipboardCopyDelay || this.clipboardCopyDelay < Date.now()) {
			//don't copy if this user action is later than the ctr+c plus some seconds.
			return;
		}

		var callback = function callback(e) {
			//self.clientGui.disableKeyboard();
			//self.clipboardContent.focus();
			$('#remoteClipboard').select();

			try {
				var c = document.execCommand("copy");
				$('#remoteClipboard').blur();
				//e.preventDefault();
				//window.getSelection().removeAllRanges();
				//self.clientGui.enableKeyboard();
				console.log("Result executeCommand", e.type, "-----", c);
			} catch (err) {
				console.error(err);
			}
		};
		callback(e);

		//[0, 100, 200, 500, 1000].map(function(timeInS){
		//	console.log("Setting timeout for", timeInS);
		//	setTimeout(function(){
		//		callback("" + timeInS);
		//	}, timeInS);
		//});
	},

	dispose: function () {
		this.clipboardContainer.remove();
		$(document).off(this.eventHandlers);
		$(document).off(this.delayCopyEvents);
	}

});
