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

wdi.DisplayRouter = $.spcExtend(wdi.EventObject.prototype, {

	init: function(c) {
		this.time = Date.now();
		this.clientGui = c.clientGui;
		this.rasterEngine = c.rasterEngine || new wdi.RasterEngine({clientGui: this.clientGui});
		if(c.routeList) {
			this.routeList = c.routeList;
		} else {
			this._initRoutes();
		}

	},

	dispose: function () {
		this.rasterEngine.dispose();
		this.clientGui = null;
		this.rasterEngine = null;
		this.routeList = null;
	},

	_initRoutes: function() {
		wdi.Debug.log("displayRouter",this.time);
		this.routeList = {};
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_SURFACE_CREATE] = this.rasterEngine.drawCanvas;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_SURFACE_DESTROY] = this.rasterEngine.removeCanvas;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_COPY] = this.rasterEngine.drawImage;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_FILL] = this.rasterEngine.drawFill;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_ALPHA_BLEND] = this.rasterEngine.drawAlphaBlend;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_WHITENESS] = this.rasterEngine.drawWhiteness;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_BLACKNESS] = this.rasterEngine.drawBlackness;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_TRANSPARENT] = this.rasterEngine.drawTransparent;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_COPY_BITS] = this.rasterEngine.drawCopyBits;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_TEXT] = this.rasterEngine.drawText;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_STROKE] = this.rasterEngine.drawStroke;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_ROP3] = this.rasterEngine.drawRop3;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_INVERS] = this.rasterEngine.drawInvers;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_STREAM_CREATE] = this.rasterEngine.handleStreamCreate;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_STREAM_DESTROY] = this.rasterEngine.handleStreamDestroy;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_STREAM_DATA] = this.rasterEngine.handleStreamData;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_STREAM_CLIP] = this.rasterEngine.handleStreamClip;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_DRAW_BLEND] = this.rasterEngine.drawBlend;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_INVAL_LIST] = this.rasterEngine.invalList;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_INVAL_ALL_PALETTES] = this.rasterEngine.invalPalettes;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_MARK] = false;
		this.routeList[wdi.SpiceVars.SPICE_MSG_DISPLAY_RESET] = false;
	},

	processPacket: function(spiceMessage) {
		//filter out empty messages
		if(!spiceMessage) {
			wdi.Debug.log('DisplayProcess processPacket: Skipping empty message...');
			return;
		}

		var route = this.routeList[spiceMessage.messageType];
		if (route) {
			route.call(this.rasterEngine, spiceMessage);
		}
	}
});
