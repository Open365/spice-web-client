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

wdi.RunQueue = $.spcExtend(wdi.DomainObject, {
	tasks: null,
	isRunning: false,
	
	init: function() {
		this.tasks = [];
	},
	
	getTasksLength: function() {
		return this.tasks.length;
	},
	
	add: function(fn, scope, endCallback, params) {
		this.tasks.push({
			fn: fn,
			scope: scope,
            fnFinish: endCallback,
            params: params
		});
		
		return this;
	},
	
	clear: function() {
		wdi.Debug.log('runqueue clear');
		this.tasks = [];
		
		return this;
	},
	
	_process: function() {
		wdi.ExecutionControl.sync = true;
		var proxy, self = this;
		this.isRunning = true;
		var task = this.tasks.shift();
		
		if (!task) {
			this.isRunning = false;
			return;
		}
		
		proxy = {
			end: function() {
                if(task.fnFinish) {
                    task.fnFinish.call(task.scope);
                }
				self._process();
			}
		};

		try {
			task.fn.call(task.scope, proxy, task.params);
		} catch(e) {
			wdi.Debug.error(e.message);
			proxy.end();
		}
		
		return this;
	},

	process: function() {
		if (!this.isRunning) {
			this._process();
		} else {
			return;
		}
	}
});

//wdi.ExecutionControl = $.spcExtend(wdi.DomainObject, {
//	currentProxy: null,
//	sync: true,
//	runQ: null,
//	init: function(c) {
//		this.runQ = c.runQ || new wdi.RunQueue(); 
//	}
//});

//TODO: make an instance of it on each channel
wdi.ExecutionControl = {
	currentProxy: null,
	sync: true,
	runQ: new wdi.RunQueue()
};
