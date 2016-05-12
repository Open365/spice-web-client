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

/*
 * Check if a packet should be intercepted in packetpreprocess to be executed
 * in parallel.
 */

wdi.PacketWorkerIdentifier = $.spcExtend(wdi.EventObject.prototype, {
    init: function(c) {
        //default empty constructor
    },

	dispose: function () {

	},
    
    shouldUseWorker: function(message) {
		switch (message.messageType) {
			case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_COPY:
				return wdi.PacketWorkerIdentifier.processingType.DECOMPRESS;
			case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_FILL:
				var brush = message.args.brush;
				if(brush.type === wdi.SpiceBrushType.SPICE_BRUSH_TYPE_PATTERN) {
					return wdi.PacketWorkerIdentifier.processingType.DECOMPRESS;
				}
				break;
			case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_ALPHA_BLEND:
				return wdi.PacketWorkerIdentifier.processingType.DECOMPRESS;
			case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_BLEND:
				return wdi.PacketWorkerIdentifier.processingType.DECOMPRESS;
			case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_TRANSPARENT:
				return wdi.PacketWorkerIdentifier.processingType.DECOMPRESS;
			//case wdi.SpiceVars.SPICE_MSG_DISPLAY_STREAM_DATA:
			//	return wdi.PacketWorkerIdentifier.processingType.PROCESSVIDEO;
		}

        return 0;
    },
    
    getImageProperties: function(message) {
        var props = {
            data: null,
            descriptor: null,
            opaque: true,
            brush: null
        };
        
		//coupling here, to be cleaned when doing real code
		switch (message.messageType) {
			case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_COPY:
				props.descriptor = message.args.image.imageDescriptor;
				props.data = message.args.image.data;
				break;
			case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_FILL:
				props.brush = message.args.brush;
				if(props.brush.type === wdi.SpiceBrushType.SPICE_BRUSH_TYPE_PATTERN) {
					props.descriptor = props.brush.pattern.image;
					props.data = props.brush.pattern.imageData;
				} else {
                    return false;
                }
				break;
			case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_ALPHA_BLEND:
            case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_BLEND:
            case wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_TRANSPARENT:
				props.data = message.args.image.data;
				props.descriptor = message.args.image.imageDescriptor;
				props.opaque = false;
				break;
            default:
                wdi.Debug.log("PacketWorkerIdentifier: Unknown Packet in getImageProperties");
                return false;
		}
        
        return props;
    },

    getVideoData: function(message) {
        if(message.messageType !== wdi.SpiceVars.SPICE_MSG_DISPLAY_STREAM_DATA) {
            wdi.Debug.log('PacketWOrkerIdentifier: Invalid packet in getVideoData');
            return false;
        }

        return message.args.data;
    }
});

wdi.PacketWorkerIdentifier.processingType = {};
wdi.PacketWorkerIdentifier.processingType.DECOMPRESS = 1;
wdi.PacketWorkerIdentifier.processingType.PROCESSVIDEO = 2;
