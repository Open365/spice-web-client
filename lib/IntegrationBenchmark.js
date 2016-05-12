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

wdi.IntegrationBenchmark = {
    benchmarking: false,
	startTime: 0,
    timeoutInterval: 3000,  // in ms, amount of time after it will be considered that
                            // we have received all packets and can stop counting
    timeOutId: undefined,

    busConnection: undefined,

    setEndTime: function() {
        var self = this;
        this.timeOutId = setTimeout(function() {
            // if 3000 ms have passed since the last packet we assume we have processed them all and can launch MS Word
            self.timeOutId = undefined;
            self.benchmarking = false;
            var now = new Date().getTime();
            var elapsed = now - self.startTime - self.timeoutInterval;
            self.onEndBenchmarkCallback(elapsed);
            var message = {
                "type": wdi.BUS_TYPES.killApplicationDoNotUseInProductionEver,
                "application": "EXCEL.EXE"
            };
            self.busConnection.send(message);
        }, this.timeoutInterval);
    },

    setStartTime: function() {
        if (this.timeOutId !== undefined) {
            clearTimeout(this.timeOutId);
        }
    },

    launchApp: function(busConnection, onEndBenchmarkCallback) {
        this.busConnection = busConnection;
        wdi.IntegrationBenchmark.benchmarking = true;
        wdi.IntegrationBenchmark.setStartTime();
        this.onEndBenchmarkCallback = onEndBenchmarkCallback;
        this.startTime = new Date().getTime();
        var message = {
            "type": wdi.BUS_TYPES.launchApplication,
            "file": "c:\\Users\\eyeos\\Desktop\\test.xlsx"
        };
        this.busConnection.send(message);
    }
};
