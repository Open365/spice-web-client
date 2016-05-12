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

suite('PacketLinkFactory', function() {
	setup(function() {
		wdi.Debug.debug = false; //disable debugging, it slows tests
	});
	
	suite('#extract()', function() {
		test('Should extract generation from a RedSetAck', function() {
			var arr = [0x01, 0x00, 0x00, 0x00, 0x14, 0x00, 0x00, 0x00];
			var myHeader = new wdi.SpiceDataHeader({type:wdi.SpiceVars.SPICE_MSG_SET_ACK, size: 8});
			var queue = new wdi.ViewQueue();
			queue.push(arr);
			var spiceSetAck = wdi.PacketLinkFactory.extract(myHeader, queue);
			assert.strictEqual(spiceSetAck.generation, 1);
		});
		
		test('Should extract id from a RedPing', function() {
			var arr = [0x01, 0x00, 0x00, 0x00, 0xea, 0x00, 0x72, 0xc3, 0x00, 0x00, 0x00, 0x00];
			var myHeader = new wdi.SpiceDataHeader({type:wdi.SpiceVars.SPICE_MSG_PING, size: 12});
			var queue = new wdi.ViewQueue();
			queue.push(arr);
			var spicePing = wdi.PacketLinkFactory.extract(myHeader, queue);
			assert.strictEqual(spicePing.id, 1);
		});
		
		test('Should extract time from a RedPing and it will be an instance of BigInteger', function() {
			var arr = [0x01, 0x00, 0x00, 0x00, 0xea, 0x00, 0x72, 0xc3, 0x00, 0x00, 0x00, 0x00];
			var myHeader = new wdi.SpiceDataHeader({type:wdi.SpiceVars.SPICE_MSG_PING, size: 12});
			var queue = new wdi.ViewQueue();
			queue.push(arr);
			var spicePing = wdi.PacketLinkFactory.extract(myHeader, queue);
			assert.instanceOf(spicePing.time, BigInteger);
		});
		
		test('Should extract a Migrate message', function() {
			var arr = [0x0a, 0x00, 0x00, 0x00];
			var myHeader = new wdi.SpiceDataHeader({type:wdi.SpiceVars.SPICE_MSG_MIGRATE, size: 4});
			var queue = new wdi.ViewQueue();
			queue.push(arr);
			var spiceMigrate = wdi.PacketLinkFactory.extract(myHeader, queue);
			assert.strictEqual(spiceMigrate.flags, 10);
		});
		
		test('Should extract a Migrate Data message that is a vector', function() {
			var arr = [0x0a, 0x03, 0x02, 0x05];
			var myHeader = new wdi.SpiceDataHeader({type:wdi.SpiceVars.SPICE_MSG_MIGRATE_DATA, size: 4});
			var queue = new wdi.Queue();
			queue.push(arr);
			var spiceMigrateData = wdi.PacketLinkFactory.extract(myHeader, queue);
			assert.deepEqual(spiceMigrateData.vector, [10, 3, 2, 5]);
		});
	});
});

suite('PacketLinkProcess', function() {
	setup(function() {
		wdi.Debug.debug = false; //disable debugging, it slows tests
	});
	
	suite('#process()', function() {
		test('Should process spice main init', function() {
			
		});
	});
});
