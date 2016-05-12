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

wdi.InputManager = $.spcExtend(wdi.EventObject.prototype, {

	checkFocus: false,
	input: null,
	window: null,
	stuckKeysHandler: null,

	init: function (c) {
		this.time = Date.now();
		wdi.Debug.log('inputmanager init: ', this.time);
		this.superInit();
		this.input = c.input;
		this.window = c.window;
		this.stuckKeysHandler = c.stuckKeysHandler;
		this.$ = c.jQuery || $;
		if (!c.disableInput) {
			this.inputElement = this.$('<div style="position:absolute"><input type="text" id="inputmanager" style="opacity:0;color:transparent"/></div>');
		}
		this.currentWindow = null;

		// Get client's Operating System
		this.getClientSO();

		// Tildes - MAC compatibility, check index order between 'tildeMarks' y 'tildeReplacements'
		this.tildeMarks = ['´', '`', '^', '¨'];
		this.lastChar = null;

		// Replacements array
		this.tildeReplacements = {
			'a': {
				0: 'á',
				1: 'à',
				2: 'â',
				3: 'ä'
			},
			'e': {
				0: 'é',
				1: 'è',
				2: 'ê',
				3: 'ë'
			},
			'i': {
				0: 'í',
				1: 'ì',
				2: 'î',
				3: 'ï'
			},
			'o':  {
				0: 'ó',
				1: 'ò',
				2: 'ô',
				3: 'ö'
			},
			'u': {
				0: 'ú',
				1: 'ù',
				2: 'û',
				3: 'ü'
			},
			'A': {
				0: 'Á',
				1: 'À',
				2: 'Â',
				3: 'Ä'
			},
			'E': {
				0: 'É',
				1: 'È',
				2: 'Ê',
				3: 'Ë'
			},
			'I': {
				0: 'Í',
				1: 'Ì',
				2: 'Î',
				3: 'Ï'
			},
			'O': {
				0: 'Ó',
				1: 'Ò',
				2: 'Ô',
				3: 'Ö'
			},
			'U': {
				0: 'Ú',
				1: 'Ù',
				2: 'Û',
				3: 'Ü'
			}
		};
	},

	getClientSO: function() {
		var platform = window.navigator.platform.toLowerCase();

		if (platform.indexOf('mac') > -1) {
			this.clientSO = "mac";
		} else if (platform.indexOf('linux')) {
			this.clientSO = "linux";
		} else {
			this.clientSO = "windows";
		}
	},

	setCurrentWindow: function(wnd) {
		wnd = this.$(wnd);
		if(this.currentWindow) {
			this.inputElement.remove();
			//remove listeners
			this.currentWindow.unbind('blur');
		}
		this.$(wnd[0].document.body).prepend(this.inputElement);
		this.input = this.$(wnd[0].document.getElementById('inputmanager'));
		//TODO: remove events from the other window
		this.addListeners(wnd);
		this.currentWindow = wnd;
	},

	dispose: function() {
		this.disposed = true;
		this.inputElement.remove();
		this.currentWindow.unbind('blur');
		this.currentWindow.unbind('input');
		this.inputElement = null;

		this.checkFocus = false;
		this.input = null;
		this.window = null;
		this.stuckKeysHandler = null;
	},

	addListeners: function (wnd) {
		this._onBlur(wnd);
		this._onInput();
	},

	_onBlur: function (wnd) {
		var self = this;
		wnd.on('blur', function onBlur (e) {
			if (self.checkFocus) {
				self.input.focus();
			}
			self.stuckKeysHandler.releaseSpecialKeysPressed();
		});
	},

	_onInput: function () {
		var self = this;

		this.input.on('input', function input (e) {
			// ctrl-v issue related
			var aux = self.input.val();

			if (aux.length > 1) {
				self.reset();
			}
		});
	},

	enable: function () {
		wdi.Debug.log("enable!!!!!!!!!! ",this.time);
		this.checkFocus = true;
		this.input.select();
	},

	disable: function () {
		this.checkFocus = false;
		if (this.input) {
			this.input.blur();
		}
	},

	reset: function () {
		this.input.val("");
	},

	getValue: function () {

		var val = this.input.val();
		if (val) {
			this.reset();
		}


		// As MAC has a particular TILDE key behaviour, we need a special treatment to send them
		if (this.clientSO === 'mac') {

			// If my LAST CHAR was *any* of my known accent characters
			// AND my ACTUAL CHAR is a vocal (as a property of accentReplacemtns array)
			if (this.tildeMarks.indexOf(this.lastChar) > -1 && this.tildeReplacements.hasOwnProperty(val)) {

				switch (this.lastChar) {

					case this.tildeMarks[0]:
						val = this.tildeReplacements[val][0];
						break;

					case this.tildeMarks[1]:
						val = this.tildeReplacements[val][1];
						break;

					case this.tildeMarks[2]:
						val = this.tildeReplacements[val][2];
						break;

					case this.tildeMarks[3]:
						val = this.tildeReplacements[val][3];
						break;
				}
			}


			// If the received char is a type of TILDE we need a special process (just for MAC)
			if (val && this.tildeMarks.indexOf(val) > -1) {

				// Only print a TILDE char of pressed twice (MAC natively sends a tilde with one keypress)
				if (val != this.lastChar) {

					this.lastChar = val;
					val = "";

				} else if (val === this.lastChar) {

					this.lastChar = "";
				}

			} else {

				// Ensure 'lastChar' is never empty
				this.lastChar = val ? val:this.lastChar;
			}

		}

		return val;
	},

	manageChar: function (val, params) {
		var res = [Object.create(params[0])];
		res[0]['type'] = 'inputmanager';
		res[0]['charCode'] = val.charCodeAt(0);
		return res;
	},

	isSpecialKey: function(keyCode) {
		var ctrl_keycode = 17,
			shift_keycode = 16;
		return [ctrl_keycode, shift_keycode].indexOf(keyCode) !== -1;
	}

});
