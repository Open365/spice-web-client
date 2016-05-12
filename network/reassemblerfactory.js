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

wdi.ReassemblerFactory = {
	getPacketReassembler: function(socketQ) {
		var pE = this.getPacketExtractor(socketQ);
		var sD = this.getSizeDefiner();
		var pC = this.getPacketController(pE, sD);
		return new wdi.PacketReassembler({packetController: pC});
	},

	getPacketExtractor: function(socketQ) {
		return new wdi.PacketExtractor({socketQ: socketQ});
	},

	getSizeDefiner: function() {
		return new wdi.SizeDefiner();
	},

	getPacketController: function(packetExtractor, sizeDefiner) {
		return new wdi.PacketController({packetExtractor: packetExtractor, sizeDefiner: sizeDefiner});
	}
};
