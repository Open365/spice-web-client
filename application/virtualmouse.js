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

wdi.VirtualMouse = {
	eventLayers: [],
	mouseData:null,
	visible: null,
	lastLayer: null,
	hotspot: {
		x: 0,
		y: 0
	},
	lastMousePosition: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	},

	dispose: function () {
		wdi.Debug.log("Disposing VirtualMouse");
		this.eventLayers =  [];
		this.mouseData =  null;
		this.visible =  null;
		this.lastLayer =  null;
		this.hotspot = {
			x: 0,
			y: 0
		};
		this.lastMousePosition = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
	},

	setHotspot: function(x, y) {
		this.hotspot.x = x;
		this.hotspot.y = y;
	},

	setEventLayer: function(ev, x, y, width, height, position) {
		this.eventLayers.push({
			layer: ev,
			left: x,
			top: y,
			right: x+width,
			bottom: y+height,
			position: position
		});
	},

	removeEventLayer: function(ev) {
		var len = this.eventLayers.length;
		for(var i=0;i<len;i++) {
			if(this.eventLayers[i].layer.id === ev.id) {
				this.eventLayers[ev.id] = undefined;
			}
		}
	},

	getEventLayer: function(x, y) {
		var len = this.eventLayers.length;
		var layer = null;
		for(var i=0;i<len;i++) {
			layer = this.eventLayers[i];
			if(x >= layer.left && x <= layer.right && y >= layer.top && y <= layer.bottom) {
				return layer.layer;
			}
		}
	},

	setMouse: function(mouseData, x, y) {
        //if(!Modernizr.touch) {
            var layer = null;
            var len = this.eventLayers.length;
            for(var i=0;i<len;i++) {
                layer = this.eventLayers[i];
                layer.layer.style.cursor = 'url('+mouseData+') ' + x + ' ' + y + ', default';
            }
        //}
	},

	hideMouse: function() {
		var layer = null;
		var len = this.eventLayers.length;
		for(var i=0;i<len;i++) {
			layer = this.eventLayers[i];
			layer.layer.style.cursor = 'none';
		}
	}
}
