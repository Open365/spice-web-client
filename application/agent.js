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

wdi.Agent = $.spcExtend(wdi.EventObject.prototype, {
	clientTokens:null,
    serverTokens: 10,
    app: null,
    clipboardEnabled: true,
	windows: null,
    clipboard: null,
    DELAY_BETWEEN_GRAB_AND_CTRLV: 30,

	init: function(c) {
		this.superInit();
		this.app = c.app;
        this.clipboard = new wdi.Clipboard()

    },

    dispose: function () {
        this.clientTokens = null;
        this.serverTokens = 10;
        this.app = null;
        this.clipboardContent = null;
        this.clipboardEnabled = true;
        this.windows = null;
    },

	sendInitMessage: function() {
		var packet = new wdi.SpiceMessage({
			messageType: wdi.SpiceVars.SPICE_MSGC_MAIN_AGENT_START,
			channel: wdi.SpiceVars.SPICE_CHANNEL_MAIN,
			args: new wdi.SpiceMsgMainAgentTokens({
				num_tokens: this.serverTokens
			})
		});
		this.app.spiceConnection.send(packet);

        var mycaps = (1 << wdi.AgentCaps.VD_AGENT_CAP_MONITORS_CONFIG);
        if (this.clipboardEnabled) {
            mycaps = mycaps | (1 << wdi.AgentCaps.VD_AGENT_CAP_CLIPBOARD_BY_DEMAND);
        }

        var packetData = {
            type: wdi.AgentMessageTypes.VD_AGENT_ANNOUNCE_CAPABILITIES,
            opaque: 0,
            data: new wdi.VDAgentAnnounceCapabilities({
                request: 0,
                caps: mycaps
            })
        };
      	this.sendAgentPacket(packetData);
	},

	setResolution: function(width, height) {
		//TODO move this to a setting
		if(width < 800) {
			width = 800;
		}

		if(height < 600) {
			height = 600;
		}

		//adapt resolution, TODO: this needs to be refractored
		var packetData = {
            type: wdi.AgentMessageTypes.VD_AGENT_MONITORS_CONFIG,
            opaque: 0,
            data: new wdi.VDAgentMonitorsConfig({
                num_of_monitors: 1,
                flags: 0,
                data: new wdi.VDAgentMonConfig({
                    width: width,
                    height: height,
                    depth: 32,
                    x: 0,
                    y: 0
                })
            })
        };
		this.sendAgentPacket(packetData);
	},

	setClientTokens: function(tokens) {
		this.clientTokens = tokens;
	},

	sendAgentPacket: function(packetData) {
		this.clientTokens--;

        var packet = new wdi.SpiceMessage({
            messageType: wdi.SpiceVars.SPICE_MSGC_MAIN_AGENT_DATA,
            channel: wdi.SpiceVars.SPICE_CHANNEL_MAIN,
            args: new wdi.VDAgentMessage({
                protocol: 1, //agent protocol version, should be unhardcoded
                type: packetData.type,
                opaque: packetData.opaque,
                data: packetData.data
            })
        });

		this.app.spiceConnection.send(packet);
	},

    sendServerTokens: function() {
        var packet = new wdi.SpiceMessage({
            messageType: wdi.SpiceVars.SPICE_MSGC_MAIN_AGENT_TOKEN,
            channel: wdi.SpiceVars.SPICE_CHANNEL_MAIN,
            args: new wdi.SpiceMsgMainAgentTokens({
                num_tokens: 10
            })
        });
        this.app.spiceConnection.send(packet);
        this.serverTokens = 10;
    },

    onAgentData: function(packet) {
        this.serverTokens--; //we have just received a server package, we decrement the tokens
        if (this.serverTokens == 0) { // we send 10 more tokens to server
            this.sendServerTokens();
        }

        if(packet.type == wdi.AgentMessageTypes.VD_AGENT_ANNOUNCE_CAPABILITIES) {
            //??
        } else if(packet.type == wdi.AgentMessageTypes.VD_AGENT_CLIPBOARD_GRAB) {
            var clipboardPacket = this.clipboard.createRequest(packet.clipboardType);
            this.sendAgentPacket(clipboardPacket);
        } else if(packet.type == wdi.AgentMessageTypes.VD_AGENT_CLIPBOARD) {
            this.fire('clipBoardData', packet.clipboardData);
        } else if (packet.type == wdi.AgentMessageTypes.VD_AGENT_CLIPBOARD_REQUEST) {
            var clipboardPacket = this.clipboard.createContent();
            this.sendAgentPacket(clipboardPacket);
        } else if (packet.type == wdi.AgentMessageTypes.VD_AGENT_CLIPBOARD_RELEASE) {

        } else if (packet.type == wdi.AgentMessageTypes.VD_AGENT_REPLY) {

        } else if (packet.type == wdi.SpiceVars.SPICE_MSG_MAIN_AGENT_TOKEN) {
            this.clientTokens += packet.args.num_tokens;
        } else {
            console.warn('unknown message received by agent', packet);
        }
    },

    setClipboard: function(data) {
        this.clipboard.setContent(data);
        var clipboardPacket = this.clipboard.createGrab();
        this.sendAgentPacket(clipboardPacket);
        var self = this;
		setTimeout(function () {
            self.app.sendShortcut(wdi.keyShortcutsHandled.CTRLV);
        }, this.DELAY_BETWEEN_GRAB_AND_CTRLV);
    },

    disableClipboard: function () {
        this.clipboardEnabled = false;
    }
});
