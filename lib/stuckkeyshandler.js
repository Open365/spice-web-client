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

wdi.StuckKeysHandler = $.spcExtend(wdi.EventObject.prototype, {
	ctrlTimeoutId: null,
	altTimeoutId: null,
	shiftTimeoutId: null,
	shiftKeyPressed: false,
	ctrlKeyPressed: false,
	altKeyPressed: false,

	dispose: function () {
		wdi.Debug.log("Disposing StuckKeysHandler");
		clearTimeout(this.ctrlTimeoutId);
		clearTimeout(this.altTimeoutId);
		clearTimeout(this.shiftTimeoutId);
		this.ctrlTimeoutId = null;
		this.altTimeoutId = null;
		this.shiftTimeoutId = null;
		this.shiftKeyPressed = false;
		this.ctrlKeyPressed = false;
		this.altKeyPressed = false;
	},

	handleStuckKeys: function (jqueryEvent) {
		if (jqueryEvent) {
			switch (jqueryEvent.keyCode) {
				case 16:
					this._handleKey('shiftTimeoutId', jqueryEvent.type, 16);
					break;
				case 17:
					this._handleKey('ctrlTimeoutId', jqueryEvent.type, 17);
					break;
				case 18:
					this._handleKey('altTimeoutId', jqueryEvent.type, 18);
					break;
			}
		}
	},

	releaseAllKeys: function releaseAllKeys () {
		var e;
		var i;
		for (i = 0; i < 300; i++) {
			this.releaseKeyPressed(i);
		}
	},

	_handleKey: function (variable, type, keyCode) {
		if (type === 'keydown') {
			this[variable] = this._configureTimeout(keyCode);
		} else if (type === 'keyup') {
			clearTimeout(this[variable]);
		}
	},

	_configureTimeout: function (keyCode) {
		var self = this;
		return setTimeout(function keyPressedTimeout () {
			// added the 'window' for the jQuery call for testing.
			self.releaseKeyPressed(keyCode);
		}, wdi.StuckKeysHandler.defaultTimeout);
	},

	releaseKeyPressed: function (keyCode) {
		var e = window.jQuery.Event("keyup");
		e["which"] = keyCode;
		e["keyCode"] = keyCode;
		e["charCode"] = 0;
		e["generated"] = true;
		this.fire('inputStuck', ['keyup', [e]]);
	},

	checkSpecialKey: function (event, keyCode) {
		switch (keyCode) {
			case 16:
				this.shiftKeyPressed = event === 'keydown';
				break;
			case 17:
				this.ctrlKeyPressed = event === 'keydown';
				break;
			case 18:
				this.altKeyPressed = event === 'keydown';
				break;
		}
	},

	releaseSpecialKeysPressed: function () {
		if (this.shiftKeyPressed) {
			this.releaseKeyPressed(16);
			this.shiftKeyPressed = false;
		}
		if (this.ctrlKeyPressed) {
			this.releaseKeyPressed(17);
			this.ctrlKeyPressed = false;
		}
		if (this.altKeyPressed) {
			this.releaseKeyPressed(18);
			this.altKeyPressed = false;
		}
	}


});

wdi.StuckKeysHandler.defaultTimeout = 2000;
