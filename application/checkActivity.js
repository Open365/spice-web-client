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

wdi.CheckActivity = $.spcExtend(wdi.EventObject.prototype, {

    init: function(milliseconds) {
        this.superInit();
        this.milliseconds = milliseconds || 600000;
        this.eventHandlers = {
            keydown: this.resetActivity.bind(this),
            mousemove: this.resetActivity.bind(this),
            click: this.resetActivity.bind(this)
        };
        this.activityTimeout = this.createTimeout();
        $(document).on(this.eventHandlers);
    },

    resetActivity: function(e) {
        clearTimeout(this.activityTimeout);
        this.activityTimeout = this.createTimeout();
    },

    createTimeout: function() {
        var self = this;
        return setTimeout(function() {
            self.fire('activityLost');
        }, this.milliseconds);
    },

    dispose: function() {
        $(document).off(this.eventHandlers);
        clearTimeout(this.activityTimeout);
    }
});
