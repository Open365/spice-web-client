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

suite('SpiceConnection', function() {
	setup(function(){
		wdi.Debug.debug = false; //disable debugging, it slows tests
	});
	
	suite('#connect()', function() {
		setup(function() {
			this.mainChannel = new wdi.SpiceChannel();
			this.mock = sinon.mock(this.mainChannel);
			this.sut = this.spcConnect = new wdi.SpiceConnection({
				mainChannel:this.mainChannel,
				connectionControl: {
					connect: function() {},
					addListener: function() {}
				}
			});
			
		});

		test('Should call connect on the main channel', function() {
			this.expectation = this.mock.expects('connect').once();
			this.spcConnect.connect('localhost', 8000);
			this.mock.verify();
		});
		
		test('Should call connect on the main channel with the correct arguments', function() {
			this.expectation = this.mock.expects('connect').once().withArgs({host:'localhost', port:8000}, wdi.SpiceVars.SPICE_CHANNEL_MAIN);
			this.spcConnect.connect({host:'localhost', port:8000});
			this.mock.verify();
		});

		test('Should call connect on the connectionControl with the correct arguments', function() {
			var connectionInfo = {
				connectionControl: true
			};
			this.expectation = this.mock.expects('connect').once().withArgs(connectionInfo);
			this.spcConnect.connect(connectionInfo);
			this.mock.verify();
		});

		test.skip('When a channel fire a channelConnected message should fire channelConnected message with channel', function() {
			var channel;
			this.sut.addListener('channelConnected', function (e) {
				channel = e[1];
			}, this);

			this.mainChannel.fire('channelConnected');

			assert.equal(channel, wdi.SpiceVars.SPICE_CHANNEL_MAIN);
		});

	});
	
	suite('#connectionId()', function() {
		setup(function()  {
			this.mainChannel = new wdi.SpiceChannel();
			this.stub = sinon.stub(this.mainChannel, "connect", function() {
				this.fire("connectionId", "12345");
				this.fire("channelListAvailable", [1,2]);
			});
			
			this.displayChannel = new wdi.SpiceChannel();
			this.mock = sinon.mock(this.displayChannel);
			
			this.spcConnect = new wdi.SpiceConnection({
				mainChannel:this.mainChannel,
				displayChannel:this.displayChannel,
				connectionControl: {
					connect: function() {},
					addListener: function() {}
				}
			});
		});
		
		test('Should call connect on display channel when connectionId is available', function() {
			this.expectation = this.mock.expects('connect').once();
			this.spcConnect.connect('localhost', 8000);
			this.mock.verify();
		});
	});

});
	
