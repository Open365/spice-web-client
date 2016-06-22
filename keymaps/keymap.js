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

wdi.keyShortcutsHandled = {
    CTRLV: 0,
    CTRLC: 1
};

wdi.Keymap = {
    keymap: {},
    ctrlKeymap: {},
    ctrlForbiddenKeymap: {},
    charmap: {},
    ctrlPressed: false,
    twoBytesScanCodes: [0x5B, 0xDB, /*0x38, 0xB8,*/ 0x5C, 0xDC, 0x1D, 0x9D, 0x5D, 0xDD, 0x52, 0xD2, 0x53, 0xD3, 0x4B, 0xCB, 0x47, 0xC9, 0x4F, 0xCF, 0x48, 0xC8, 0x50, 0xD0, 0x49, 0xC9, 0x51, 0xD1, 0x4D, 0xCD, 0x1C, 0x9C],

    loadKeyMap: function(layout, stuckKeysHandler) {
        try {
            this.keymap = wdi['Keymap' + layout.toUpperCase()].getKeymap();
            this.ctrlKeymap = wdi['Keymap' + layout.toUpperCase()].getCtrlKeymap();
            this.ctrlForbiddenKeymap = wdi['Keymap' + layout.toUpperCase()].getCtrlForbiddenKeymap();
            this.reservedCtrlKeymap =  wdi['Keymap' + layout.toUpperCase()].getReservedCtrlKeymap();
            this.charmap = wdi['KeymapObj' + layout.toUpperCase()].getCharmap();
            this.stuckKeysHandler = stuckKeysHandler;
        } catch(e) {
			this.keymap = wdi.KeymapES.getKeymap();
            this.ctrlKeymap = wdi.KeymapES.getCtrlKeymap();
            this.ctrlForbiddenKeymap = wdi.KeymapES.getCtrlForbiddenKeymap();
            this.reservedCtrlKeymap =  wdi.KeymapES.getReservedCtrlKeymap();
            this.charmap = wdi.KeymapObjES.getCharmap();
            this.stuckKeysHandler = stuckKeysHandler;
		}
    },

    isInKeymap: function(keycode) {
        return this.keymap[keycode] !== undefined;
    },

    /**
     * Returns the associated spice key code from the given browser keyboard event
     * @param e
     * @returns {*}
     */
    getScanCodes: function(e) {
		if (e['hasScanCode']) {
			return e['scanCode'];
		} else if (this.isForbiddenCombination(e)) {
            return [];
        } else if (this.isGeneratedShortcut(e['type'], e['keyCode'], e['generated'])) {
            return this.getScanCodeFromKeyCode(e['keyCode'], e['type'], this.ctrlKeymap, this.reservedCtrlKeymap);
        } else if (this.handledByCharmap(e['type'])) {
            return this.getScanCodesFromCharCode(e['charCode']);
        } else if (this.handledByNormalKeyCode(e['type'], e['keyCode'])) {
            return this.getScanCodeFromKeyCode(e['keyCode'], e['type'], this.keymap);
        } else {
            return [];
        }
    },

    getScanCodeFromKeyCode: function(keyCode, type, keymap, additionalKeymap) {
        this.controlPressed(keyCode, type);
        var key = null;
        if(keyCode in keymap) {
            key = keymap[keyCode];
        } else {
            key = additionalKeymap[keyCode];
        }
        if (key === undefined) return [];
        if (key < 0x100) {
            if (type == 'keydown') {
                return [this.makeKeymap(key)];
            } else if (type == 'keyup') {
                return [this.makeKeymap(key | 0x80)];
            }
        } else {
            if (type == 'keydown') {
                return [this.makeKeymap(0xe0 | ((key - 0x100) << 8))];
            } else if (type == 'keyup') {
                return [this.makeKeymap(0x80e0 | ((key - 0x100) << 8))];
            }
        }
        return key;
    },

    isForbiddenCombination: function(e) {
        var keyCode = e['keyCode'],
            type = e['type'],
            keymap = this.ctrlForbiddenKeymap;

        if(wdi.KeyEvent.isCtrlPressed(e) && keymap[keyCode]) {
            if(keymap[keyCode]) {
                return true;
            }
        }
        return false;
    },

    controlPressed: function(keyCode, type, event) {
        if (!event) return false;
        if (keyCode !== 17 && keyCode !== 91) {  // Ctrl or CMD key
            if (type === 'keydown') {
                if(wdi.KeyEvent.isCtrlPressed(event)){
                    this.ctrlPressed = true;
                }
            }
            else if (type === 'keyup') {
                if(!wdi.KeyEvent.isCtrlPressed(event)){
                    this.ctrlPressed = false;
                }
            }
        }
    },

    handledByCtrlKeyCode: function(type, keyCode, generated) {
        if (type === 'keydown' || type === 'keyup' || type === 'keypress') {
            if (this.ctrlPressed) {
                if (type === 'keypress') {
                    return true;
                }

                if (this.ctrlKeymap[keyCode]) {
                    return true;  // is the second key in a keyboard shortcut (i.e. the x in Ctrl+x)
                }
            }
        }
        return false;
    },

    isGeneratedShortcut: function(type, keyCode, generated) {
        if (type === 'keydown' || type === 'keyup' || type === 'keypress') {
            if (this.ctrlPressed) {
                //check if the event is a fake event generated from our gui or programatically
                if(generated && this.reservedCtrlKeymap[keyCode]) {
                    return true;
                }
            }
        }
        return false;
    },

    handledByNormalKeyCode: function(type, keyCode) {
        if (type === 'keydown' || type === 'keyup') {
            if (this.keymap[keyCode]) {
                return true;
            }
        }
        return false;
    },

    handledByCharmap: function(type) {
        return type === 'inputmanager';
    },

    getScanCodesFromCharCode: function(charCode) {
        var scanCodeObj = this.charmap[String.fromCharCode(charCode)];
        var scanCodeObjModifier = new wdi.ScanCodeObjModifier(scanCodeObj);

        if(this.stuckKeysHandler.shiftKeyPressed) {
            if(scanCodeObjModifier.containsShiftDown()) {
                scanCodeObjModifier.removeShift();
            } else {
                scanCodeObjModifier.addShiftUp();
                scanCodeObjModifier.addShiftDown();
            }
        }
        var scanCode = scanCodeObjModifier.getScanCode();
        return scanCode;
    },

    makeKeymap: function(scancode) {
        if ($.inArray(scancode, this.twoBytesScanCodes) != -1) {
            return [0xE0, scancode, 0, 0];
        } else {
            return [scancode, 0, 0];
        }
    }
};
