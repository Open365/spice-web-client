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

suite("BusProcess:", function() {
	var sut;
	var clientGui, busConnection;

	setup(function () {
		clientGui = {};
		busConnection = {};
		sut = new wdi.BusProcess({ clientGui: clientGui, busConnection: busConnection });
	});

	suite('#parseMessage', function () {
		test('Should fire "wrongPathError" when the type is "launchApplication" and the event is "applicationLauncherWrongAppPathError"', sinon.test(function () {
			var body = {
				type: wdi.BUS_TYPES.launchApplication,
				event: "applicationLauncherWrongAppPathError"
			};
			this.mock(sut)
				.expects('fire')
				.once()
				.withExactArgs('wrongPathError', body);
			sut.parseMessage(body);
		}));
		test('Should not fire "wrongPathError" when the type is "launchApplication" and the event is not "applicationLauncherWrongAppPathError"', sinon.test(function () {
					var body = {
						type: wdi.BUS_TYPES.launchApplication,
						event: "fakeEvent"
					};
					this.mock(sut)
						.expects('fire')
						.never();
					sut.parseMessage(body);
				}));

		test('Should fire "applicationLaunchedSuccessfully" when the type is "launchApplication" and the event is "applicationLaunchedSuccessfully"', sinon.test(function () {
			var body = {
				type: wdi.BUS_TYPES.launchApplication,
				event: "applicationLaunchedSuccessfully"
			};
			this.mock(sut)
				.expects('fire')
				.once()
				.withExactArgs('applicationLaunchedSuccessfully', body);
			sut.parseMessage(body);
		}));
	});
});
