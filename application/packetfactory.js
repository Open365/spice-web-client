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

wdi.PacketFactory = {
	dispose: function () {
		wdi.Debug.log("Disposing PacketFactory");
	},
	extract: function(rawSpiceMessage) {
		var packet = null;
		switch (rawSpiceMessage.channel) {
			case wdi.SpiceVars.SPICE_CHANNEL_DISPLAY:
				if (wdi.graphicDebug && wdi.graphicDebug.debugMode) {
					var originalData = JSON.stringify(rawSpiceMessage);
				}
				switch (rawSpiceMessage.header.type) {
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_MODE:
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_MARK:
                        packet = new wdi.SpiceDisplayMark().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_RESET:
                        packet = new wdi.SpiceDisplayReset().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_COPY_BITS:
						packet = new wdi.SpiceCopyBits().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_INVAL_LIST:
						packet = new wdi.SpiceResourceList().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_INVAL_ALL_PIXMAPS:
						//TODO: remove all pixmaps
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_INVAL_PALETTE:
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_INVAL_ALL_PALETTES:
                        packet =  new wdi.SpiceDisplayInvalidAllPalettes().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_STREAM_CREATE:
						packet =  new wdi.SpiceStreamCreate().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_STREAM_DATA:
						packet =  new wdi.SpiceStreamData().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_STREAM_CLIP:
						packet =  new wdi.SpiceStreamClip().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_STREAM_DESTROY:
						packet =  new wdi.SpiceStreamDestroy().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_STREAM_DESTROY_ALL:
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_FILL:
						packet = new wdi.SpiceDrawFill().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_OPAQUE:
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_COPY:
						// Spice Draw Copy is composed by DisplayBase (surface_id 32, SpiceRect(top 32, left 32, bottom 32, right 32), SpiceClip(type 8 if 1: SpiceClipRects(num_rects 32, vector: SpiceRect(top 32, left 32, bottom 32, right 32)))) and SpiceCopy (offset 32 if not 0: SpiceImage(SpiceImageDescriptor(id 32, type 8, flags 8, width 32, height 32), case descriptor type to parse image), SpiceRect(top 32, left 32, bottom 32, right 32), rop_descriptor 16, scale_mode 8, SpiceQMask)
						packet = new wdi.SpiceDrawCopy().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_BLEND:
						packet = new wdi.drawBlend().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_BLACKNESS:
						packet = new wdi.SpiceDrawBlackness().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_WHITENESS:
						packet = new wdi.SpiceDrawWhiteness().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_INVERS:
						packet = new wdi.SpiceDrawInvers().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_ROP3:
						packet = new wdi.SpiceDrawRop3().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_STROKE:
						packet = new wdi.SpiceStroke().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_TEXT:
						packet = new wdi.SpiceDrawText().demarshall(rawSpiceMessage.body, rawSpiceMessage.header.size);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_TRANSPARENT:
						packet = new wdi.drawTransparent().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_ALPHA_BLEND:
						packet = new wdi.drawAlphaBlend().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_SURFACE_CREATE:
						packet = new wdi.SpiceSurface().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_DISPLAY_SURFACE_DESTROY:
						packet = new wdi.SpiceSurfaceDestroy().demarshall(rawSpiceMessage.body);
						break;
				}
				break;
			case wdi.SpiceVars.SPICE_CHANNEL_INPUTS:
				switch (rawSpiceMessage.header.type) {
					case wdi.SpiceVars.SPICE_MSG_INPUTS_MOUSE_MOTION_ACK:
						packet = new Object(); //dummy!
						break;
				}
				break;
			case wdi.SpiceVars.SPICE_CHANNEL_MAIN:
				switch (rawSpiceMessage.header.type) {
					case wdi.SpiceVars.SPICE_MSG_MAIN_INIT:
						packet = new wdi.RedMainInit().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_MAIN_AGENT_DATA:
						packet = new wdi.VDAgentMessage().demarshall(rawSpiceMessage.body);
						break;
					case wdi.SpiceVars.SPICE_MSG_MAIN_AGENT_DISCONNECTED:
						packet = new wdi.SpiceMsgMainAgentDisconnected().demarshall(rawSpiceMessage.body);
						break;
                    case wdi.SpiceVars.SPICE_MSG_MAIN_AGENT_CONNECTED:
                        packet = new wdi.SpiceMsgMainAgentConnected().demarshall(rawSpiceMessage.body);
                        break;
                    case wdi.SpiceVars.SPICE_MSG_MAIN_MULTI_MEDIA_TIME:
                        packet = new wdi.MainMultiMediaTime().demarshall(rawSpiceMessage.body);
                        break;
                    case wdi.SpiceVars.SPICE_MSG_MAIN_CHANNELS_LIST:
                        packet = new wdi.MainMChannelsList().demarshall(rawSpiceMessage.body);
                        break;
				}
				break;
			case wdi.SpiceVars.SPICE_CHANNEL_CURSOR:
				switch (rawSpiceMessage.header.type) {
					case wdi.SpiceVars.SPICE_MSG_CURSOR_INIT:
						packet = new wdi.RedCursorInit().demarshall(rawSpiceMessage.body, rawSpiceMessage.header.size);
						break;
					case wdi.SpiceVars.SPICE_MSG_CURSOR_SET:
						packet = new wdi.RedCursorSet().demarshall(rawSpiceMessage.body, rawSpiceMessage.header.size);
						break;
					case wdi.SpiceVars.SPICE_MSG_CURSOR_HIDE:
						packet = new wdi.RedCursorHide().demarshall(rawSpiceMessage.body, rawSpiceMessage.header.size);
						break;
				}
				break;
            case wdi.SpiceVars.SPICE_CHANNEL_PLAYBACK:
                switch(rawSpiceMessage.header.type) {
                    case wdi.SpiceVars.SPICE_MSG_PLAYBACK_MODE:
                        packet = new wdi.PlaybackMode().demarshall(rawSpiceMessage.body, rawSpiceMessage.header.size);
                        break;
                    case wdi.SpiceVars.SPICE_MSG_PLAYBACK_START:
                        packet = new wdi.PlaybackStart().demarshall(rawSpiceMessage.body, rawSpiceMessage.header.size);
                        break;
                    case wdi.SpiceVars.SPICE_MSG_PLAYBACK_STOP:
                        packet = new wdi.PlaybackStop().demarshall(rawSpiceMessage.body, rawSpiceMessage.header.size);
                        break;
                    case wdi.SpiceVars.SPICE_MSG_PLAYBACK_DATA:
                        packet = new wdi.PlaybackData().demarshall(rawSpiceMessage.body, rawSpiceMessage.header.size);
                        break;
                }
		}
		if(packet) {
			if (wdi.graphicDebug && wdi.graphicDebug.debugMode && originalData) {
				packet.originalData = originalData;
			}
			return new wdi.SpiceMessage({
				messageType: rawSpiceMessage.header.type, 
				channel: rawSpiceMessage.channel, 
				args: packet
			});
		} 
		wdi.Debug.log(rawSpiceMessage.header.type, rawSpiceMessage.header.channel);
		return false;
	}
};
