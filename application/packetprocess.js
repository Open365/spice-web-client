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


wdi.PacketProcess = $.spcExtend(wdi.DomainObject, {
	processors: {},
	
	init: function(c) {
		this.processors[wdi.SpiceVars.SPICE_CHANNEL_MAIN] = c.mainProcess || new wdi.MainProcess({
			app: c.app
		});
		this.processors[wdi.SpiceVars.SPICE_CHANNEL_DISPLAY] = c.displayProcess || new wdi.DisplayPreProcess({
			clientGui: c.clientGui,
			disableMessageBuffering: c.disableMessageBuffering
		});
		this.processors[wdi.SpiceVars.SPICE_CHANNEL_INPUTS] = c.inputsProcess || new wdi.InputProcess({
			clientGui: c.clientGui,
			spiceConnection: c.spiceConnection
		});
		this.processors[wdi.SpiceVars.SPICE_CHANNEL_CURSOR] = c.cursorProcess || new wdi.CursorProcess();
        this.processors[wdi.SpiceVars.SPICE_CHANNEL_PLAYBACK] = c.playbackProcess || new wdi.PlaybackProcess({
			app: c.app
		});
	},
            
    process: function(spiceMessage) {
        if(wdi.exceptionHandling) {
            return this.processExceptionHandled(spiceMessage);
        } else {
            return this.processPacket(spiceMessage);
        }
    },
            
    processExceptionHandled: function(spiceMessage) {
        try {
            return this.processPacket(spiceMessage);
        } catch(e) {
            wdi.Debug.error('PacketProcess: Error processing packet', e);
        }        
    },

	processPacket: function(spiceMessage) {
		if(!spiceMessage || !this.processors[spiceMessage.channel]) {
			throw "Invalid channel or null message";
		}

        this.processors[spiceMessage.channel].process(spiceMessage);
	},

	dispose: function () {
		wdi.Debug.log("Disposing PacketProcess all processors");
		this.processors[wdi.SpiceVars.SPICE_CHANNEL_MAIN].dispose();
		this.processors[wdi.SpiceVars.SPICE_CHANNEL_DISPLAY].dispose();
		this.processors[wdi.SpiceVars.SPICE_CHANNEL_INPUTS].dispose();
		this.processors[wdi.SpiceVars.SPICE_CHANNEL_CURSOR].dispose();
		this.processors[wdi.SpiceVars.SPICE_CHANNEL_PLAYBACK].dispose();
		this.processors = {};
	}
});
