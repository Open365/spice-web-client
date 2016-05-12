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

wdi.SyncAsyncHandler = $.spcExtend(wdi.EventObject.prototype, {
	init: function (c) {
		this.isAsync = !!c.isAsync;
		if (this.isAsync) {
			this.asyncWorker = c.asyncWorker || new wdi.AsyncWorker({
					script: wdi.spiceClientPath + 'application/WorkerProcess.js'
			});
		}
	},

	isAsync: null,

	dispatch: function(buffer, callback, scope) {
		if (this.isAsync) {
			this.asyncWorker.run(buffer, callback, scope);
		} else {
			var result = window['workerDispatch'](buffer, this.isAsync);
			callback.call(scope, result);
		}
	},

	dispose: function () {
		if (this.isAsync) {
			this.asyncWorker.dispose();
		}
	}
});
