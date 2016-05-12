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

suite('Socket', function() {//TODO: this test is incomplete, must be revised
  setup(function(){
	wdi.Debug.debug = false; //disable debugging, it slows tests
  });
  
  suite('#getStatus()', function() {
  	setup(function() {
  		this.s = new wdi.Socket();
  	});
  	
  	test('Should return idle before connecting', function() {
  		assert.equal(this.s.getStatus(), wdi.socketStatus.idle);
  	});
  	
  	
  });
  
  suite('#connect()', function() {
  	setup(function() {
  		this.s = new wdi.Socket();
  	});
  	
  	test('Should set the status to prepared', function() {
  		this.s.connect('ws://localhost:8000');
  		assert.strictEqual(this.s.getStatus(), wdi.socketStatus.prepared);
  	});
  });

	suite('#send', function () {
		var sut, message;

		function execute () {
			sut.send(message);
		}

		setup(function() {
			message = "a fake message";
			sut = new wdi.Socket();
			sut.connect('ws://localhost:8000');
			sut.websocket.send = function () {};
 		});

		test('Should send the message when the websocket is ok', function () {
			var exp = sinon.mock(sut.websocket)
				.expects('send')
				.once()
				.withExactArgs(message);
			sinon.stub(sut, 'encode_message').returns(message);
			execute();
			exp.verify();
		});

		test('Should encode the message sent', function () {
			var exp = sinon.mock(sut)
				.expects('encode_message')
				.once()
				.withExactArgs(message);
			sinon.stub(sut.websocket, 'send');
			execute();
			exp.verify();
		});

		test('Should set status = websocket.failed when error', function () {
			sinon.stub(sut, 'encode_message').throws(new Error());
			execute();
			assert.strictEqual(sut.getStatus(), wdi.socketStatus.failed);
		});

		test('Should fire event error when error', function () {
			var err = new Error(),
				exp = sinon.mock(sut)
				.expects('fire')
				.once()
				.withExactArgs('error', err);
			sinon.stub(sut, 'encode_message').throws(err);
			execute();
			exp.verify();
		});
	});
});
