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

window.performanceTest = window.performanceTest || {};
performanceTest.runner = (function (ioFactory) {
	var runner = {
		testInterval: 100,
		specialChars: {
			' ': 32,
			'esc': 27,
			'meta': 92,
			'alt': 18,
			'enter': 13
		},

		prepareEnvironment: function () {
			// Add the meta button to keyboard
			wdi.Keymap.keymap[92] = 0x5c;
		},

		parseData: function (data) {
			var actions = [];
			var parts;
			var self = this;
			data.forEach(function (item) {
				parts = item.split(':');
				actions = actions.concat(self.parseItem(parts[0], parts[1]));
			});

			return actions;

		},

		isSpecialChar: function (char) {
			return this.specialChars[char] !== undefined;
		},

		parseItem: function (type, value) {
			switch (type) {
				case 'key':
					if (this.isSpecialChar(value)) {
						var char = this.specialChars[value];
						return [
							ioFactory.getKeydownSpecialChar(char),
							ioFactory.getKeyupSpecialChar(char)
						];
					} else {
						return ioFactory.getKeypressChar(value);
					}
				case 'text':
					var self = this;
					return value.split('').map(function (item) {
						return self.parseItem('key', item)[0];
					});
				case 'mouseMove':
					var items = value.split(',');
					return ioFactory.getMouseMove(items[0], items[1]);
				case 'scrollUp':
					return ioFactory.getScrollUp();
				case 'scrollDown':
					return ioFactory.getScrollDown();
				case 'specialCharDown':
					var char = this.specialChars[value];
					return [ioFactory.getKeydownSpecialChar(char)];
				case 'specialCharUp':
					var char = this.specialChars[value];
					return [ioFactory.getKeyupSpecialChar(char)];
				case 'timeout':
					return [type + ":" + value];
			}
		},

		runTest: function (steps) {
			var currentStep = steps.shift();
			if (currentStep === undefined) {
				this.teardown();
				return;
			}
			var self = this;
			if (typeof currentStep === 'string') {
				window.setTimeout(function () {
					self.runTest(steps);
				}, currentStep.split(':')[1]);
			} else {
				app.inputProcess.send.apply(app.inputProcess, currentStep);
				window.setTimeout(function () {
					self.runTest(steps);
				}, this.testInterval);
			}

		},

		startTest: function (data, setup, teardown) {
			this.teardown = teardown;
			var steps = this.parseData(data);
			setup();
			this.runTest(steps);
		},

		startPerformanceTest: function () {
			var self = this;
			var f = function () {};
			this.prepareEnvironment();
			this.startTest(performanceTest.data.setup, f, function () {
				var setup = function () {
					wdi.DataLogger.startTestSession();
				};

				var teardown = function () {
					wdi.DataLogger.stopTestSession();
					var stats = wdi.DataLogger.getStats();
					console.log(stats);
					this.startTest(performanceTest.data.teardown, f, f);
				};

				self.startTest(performanceTest.data.test, setup, teardown)
			});


		}
	};

	return runner;
})(performanceTest.ioPacketFactory);
