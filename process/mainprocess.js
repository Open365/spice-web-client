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

wdi.MainProcess = $.spcExtend(wdi.EventObject.prototype, {
	init: function(c) {
		this.superInit();
		this.app = c.app;
		this.spiceConnection = c.app.spiceConnection;
		this.agent = c.app.agent;
	},

	dispose: function() {
		this.clearEvents();
		this.app = null;
		this.spiceConnection = null;
		this.agent = null;
	},
	
	process: function(spiceMessage) {
		var channel = this.spiceConnection.channels[wdi.SpiceVars.SPICE_CHANNEL_MAIN];

		switch(spiceMessage.messageType) {
			case wdi.SpiceVars.SPICE_MSG_MAIN_INIT:
				channel.connectionId = spiceMessage.args.session_id;
				channel.fire('connectionId', channel.connectionId);
				if(spiceMessage.args.agent_connected == 1) {
					channel.fire('initAgent', spiceMessage.args.agent_tokens);
				}
				if (spiceMessage.args.current_mouse_mode == 1) {
					channel.fire('mouseMode', spiceMessage.args.current_mouse_mode);
				}
				// the mouse mode must be change both if we have agent or not
				this.changeMouseMode();
				break;
			case wdi.SpiceVars.SPICE_MSG_MAIN_AGENT_DATA:
				var packet = spiceMessage.args;
				this.agent.onAgentData(packet);
			   	break;
			case wdi.SpiceVars.SPICE_MSG_MAIN_AGENT_CONNECTED:
				channel.fire('initAgent', spiceMessage.args.agent_tokens);
				this.changeMouseMode();
				break;
			case wdi.SpiceVars.SPICE_MSG_MAIN_MULTI_MEDIA_TIME:
				this.app.multimediaTime = spiceMessage.args.multimedia_time;
				break;
			case wdi.SpiceVars.SPICE_MSG_MAIN_CHANNELS_LIST:
				channel.fire('channelListAvailable', spiceMessage.args.channels);
				break;
		}
	},

	changeMouseMode: function() {
		var packet = new wdi.SpiceMessage({
			messageType: wdi.SpiceVars.SPICE_MSGC_MAIN_MOUSE_MODE_REQUEST,
			channel: wdi.SpiceVars.SPICE_CHANNEL_MAIN,
			args: new wdi.SpiceMouseModeRequest({
				request_mode: 2
			})
		});
		this.spiceConnection.send(packet);
	}
});
