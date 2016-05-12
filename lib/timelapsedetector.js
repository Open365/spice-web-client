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

wdi.TimeLapseDetector = $.spcExtend(wdi.EventObject.prototype, {
	lastTime: null,

	init: function timeLapseDetector_Init (c) {
		this.superInit();
	},

	dispose: function() {
		this.lastTime = null;
	},

	startTimer: function timeLapseDetector_startTimer () {
		var self = this;
		this.lastTime = Date.now();

		window.setInterval(
			function timeLapseDetectorInterval () {
				var now = Date.now();
				// this.constructor == access to the class itself, so you
				// can access to static properties without writing/knowing
				// the class name
				var elapsed = now - self.lastTime;
				if (elapsed >= self.constructor.maxIntervalAllowed) {
					self.fire('timeLapseDetected', elapsed);
				}
				self.lastTime = now;
			},
			wdi.TimeLapseDetector.defaultInterval
		);
	},

	getLastTime: function timeLapseDetector_getLastTime () {
		return this.lastTime;
	},

	setLastTime: function timeLapseDetector_setLastTime (lastTime) {
		this.lastTime = lastTime;
		return this;
	}
});

wdi.TimeLapseDetector.defaultInterval = 5000;
wdi.TimeLapseDetector.maxIntervalAllowed = wdi.TimeLapseDetector.defaultInterval * 3;
