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

suite('TimeLapseDetector:', function () {
	var sut;
	var clock;
	var now;

	setup(function () {
		wdi.Debug.debug = false; //disable debugging, it slows tests
		now = Date.now();
		clock = sinon.useFakeTimers(now);

		sut = new wdi.TimeLapseDetector();
	});

	teardown(function () {
		clock.restore();
	});

	test('when the timer is running normally, lastTime is updated', function () {
		sut.startTimer();

		clock.tick(wdi.TimeLapseDetector.defaultInterval);
		var expected = now + wdi.TimeLapseDetector.defaultInterval;
		assert.equal(expected, sut.getLastTime());
	});

	test('when the timer is running late an event is fired', function () {
		sut.startTimer();
		sut.setLastTime(now - (wdi.TimeLapseDetector.maxIntervalAllowed));

		var expected = wdi.TimeLapseDetector.maxIntervalAllowed + wdi.TimeLapseDetector.defaultInterval;

		var mock = sinon.mock(sut);
		var expectation = mock.expects('fire')
			.once()
			.withExactArgs('timeLapseDetected', expected);

		clock.tick(wdi.TimeLapseDetector.defaultInterval);

		expectation.verify();
	});

	test('when the timer is running late, lastTime is updated', function () {
		sut.startTimer();
		var passedTime = wdi.TimeLapseDetector.maxIntervalAllowed + 123;
		var expected = 0;
		while (expected + wdi.TimeLapseDetector.defaultInterval <= passedTime) {
			expected += wdi.TimeLapseDetector.defaultInterval;
		}
		expected += now;

		clock.tick(passedTime);
		assert.equal(expected, sut.getLastTime());
	});
});
