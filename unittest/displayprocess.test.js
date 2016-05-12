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

suite('DisplayProcess', function() {
	var sut;
	var runQ;
	var fakePacketFilter;
	var fakeClientGui;
	var displayRouter;
	var packetWorkerIdentifier;

	setup(function(){
		wdi.Debug.debug = false; //disable debugging, it slows tests
	});

	suite('#process()', function() {
		setup(function() {
			runQ = new wdi.RunQueue();

			fakePacketFilter = {
				notifyEnd: function() {

				},

				filter: function(o, fn, scope) {
					fn.call(scope, o);
				}
			};

			fakeClientGui =  {};

			displayRouter = new wdi.DisplayRouter();

			packetWorkerIdentifier = {
				getImageProperties: function() {
					return false;
				}
			};

			displayRouter.packetProcess = function(spiceMessage) {}; //replace packetProcess, because of partial mocking
			sut = new wdi.DisplayProcess({
				runQ: runQ,
				packetFilter: fakePacketFilter,
				clientGui: fakeClientGui,
				displayRouter: displayRouter,
				packetWorkerIdentifier: packetWorkerIdentifier
			});


			wdi.ExecutionControl.sync = true;
		});

		test('displayProcess process should call packetFilfer process', sinon.test(function() {
			var fakeProxy = {
				end:function() {

				}
			};
			runQ.add = function(fnStart, scope, fnEnd) {
				fnStart.call(scope, fakeProxy);
			}
			this.mock(fakePacketFilter)
				.expects('filter')
				.once();
			sut._process(false);
		}));

		test('displayProcess process should call packetFilfer notifyEnd', sinon.test(function() {
			runQ.add = function(fn, scope, endFn) {
				fn.call(scope,{end:function(){}});
				endFn.call(scope);
			};

			this.mock(fakePacketFilter)
				.expects('notifyEnd')
				.once();
			sut._process(false);
		}));

		test('displayProcess process should call runq add', sinon.test(function() {
			this.mock(runQ)
				.expects('add')
				.once();
			sut._process(false);
		}));


		test('displayProcess process should call runq process', sinon.test(function() {
			this.mock(runQ)
				.expects('process')
				.once();
			sut._process(false);
		}));

		test('displayProcess process should call runq process', sinon.test(function() {
			this.mock(runQ)
				.expects('process')
				.once();
			sut._process(false);
		}));
	});
});
