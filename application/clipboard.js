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

wdi.Clipboard = $.spcExtend(wdi.EventObject.prototype, {
	_blob: null,
    _type: null,

    getSpiceType: function(mimetype) {
        switch (mimetype) {
            case "text/plain": return wdi.ClipBoardTypes.VD_AGENT_CLIPBOARD_UTF8_TEXT;
            case "image/png": return wdi.ClipBoardTypes.VD_AGENT_CLIPBOARD_IMAGE_PNG;
            default: throw new Error("Unsupported mime type " + mimetype);
        }
    },

    getMimeType: function(spicetype) {
        switch (spicetype) {
            case wdi.ClipBoardTypes.VD_AGENT_CLIPBOARD_UTF8_TEXT: return "text/plain";
            case wdi.ClipBoardTypes.VD_AGENT_CLIPBOARD_IMAGE_PNG: return "image/png";
            default: throw new Error("Unsupported spice type " + spicetype);
        }
    },

    createGrab: function() {
        return {
            type: wdi.AgentMessageTypes.VD_AGENT_CLIPBOARD_GRAB,
            opaque: 0,
            data: new wdi.VDAgentClipboardGrab({
                types: [this.getSpiceType(this._type)]
            })
        };
    },

    createRequest: function(type) {
        return {
            type: wdi.AgentMessageTypes.VD_AGENT_CLIPBOARD_REQUEST,
            opaque: 0,
            data: new wdi.VDAgentClipboardRequest({
                type: type
            })
        };
    },

    createContent: function() {
        return {
            type: wdi.AgentMessageTypes.VD_AGENT_CLIPBOARD,
            opaque: 0,
            data: new wdi.VDAgentClipboard({
                type: this.getSpiceType(this._type),
                data: this._blob
            })
        };
    },

    setContent: function (content) {
        this._type = content.type;
        this._blob = content.blob;
    },

    getContent: function () {
        return {
            blob: this._blob,
            type: this._type
        };
    }
});
