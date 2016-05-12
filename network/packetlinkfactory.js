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

wdi.PacketLinkFactory = {
	extract: function(header, queue) {
		switch (header.type) {
			case wdi.SpiceVars.SPICE_MSG_SET_ACK:
				return new wdi.RedSetAck().demarshall(queue);
			case wdi.SpiceVars.SPICE_MSG_PING:
				return new wdi.RedPing().demarshall(queue, header.size);
			case wdi.SpiceVars.SPICE_MSG_MIGRATE:
				return new wdi.RedMigrate().demarshall(queue);
			case wdi.SpiceVars.SPICE_MSG_MIGRATE_DATA:
				return new wdi.RedMigrateData().demarshall(queue, header.size);
			case wdi.SpiceVars.SPICE_MSG_WAIT_FOR_CHANNELS:
				return new wdi.RedWaitForChannels().demarshall(queue);
			case wdi.SpiceVars.SPICE_MSG_DISCONNECTING:
				return new wdi.RedDisconnect().demarshall(queue);
			case wdi.SpiceVars.SPICE_MSG_NOTIFY:
				var packet = new wdi.RedNotify().demarshall(queue);
				return packet;
			case wdi.SpiceVars.SPICE_MSG_MAIN_MOUSE_MODE:
				return new wdi.SpiceMouseMode().demarshall(queue);
		}
	}
};

wdi.PacketLinkProcess = {
	process: function(header, packet, channel) {
		switch(header.type) {
			case wdi.SpiceVars.SPICE_MSG_SET_ACK:
				var body = wdi.SpiceObject.numberTo32(packet.generation);
				channel.setAckWindow(packet.window)
				channel.sendObject(body, wdi.SpiceVars.SPICE_MSGC_ACK_SYNC);
				break;
			case wdi.SpiceVars.SPICE_MSG_PING:
				var body = new wdi.RedPing({id: packet.id, time: packet.time}).marshall();
				channel.sendObject(body, wdi.SpiceVars.SPICE_MSGC_PONG);
				break;
			case wdi.SpiceVars.SPICE_MSG_MAIN_MOUSE_MODE:
				channel.fire('mouseMode', packet.current_mode);
				break;
			case wdi.SpiceVars.SPICE_MSG_NOTIFY:
				channel.fire('notify');
				break;
		}
	}
};
