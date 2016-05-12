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

suite('EventObject', function() {
	setup(function() {
		wdi.Debug.debug = false; //disable debugging, it slows tests
	});
	
	suite('#addListener()', function() {
		setup(function () {
			this.eo = new wdi.EventObject();
		});
		
		test('Should add event to list', function() {
			this.eo.addListener('test', function(){});
			assert.strictEqual(this.eo.getListenersLength("test"), 1);
		});
		
		test('Should add two event to list', function() {
			this.eo.addListener('test', function(){});
			this.eo.addListener('test', function(){});
			assert.strictEqual(this.eo.getListenersLength("test"), 2);
		});
	});
	
	suite('#removeEvent()', function() {
		setup(function() {
			this.eo = new wdi.EventObject();
			this.eo.addListener('test', function() {});
			this.eo.addListener('test', function() {});
			this.eo.addListener('test2', function() {});
		});
		
		test('Should remove correct event', function() {
			this.eo.removeEvent('test');
			assert.notProperty(this.eo.eyeEvents, 'test');
		});
	});
	
	suite('#clearEvents()', function() {
		setup(function() {
			this.eo = new wdi.EventObject();
			this.eo.addListener('test', function(){});
			this.eo.addListener('test', function(){});
			this.eo.addListener('test', function(){});
		});
		
		test('Should remove all events and listeners', function() {
			this.eo.clearEvents();
			assert.strictEqual(this.eo.getListenersLength('test'), 0);
		});
	});
	
	suite('#fire()', function() {
		setup(function() {
			this.eo = new wdi.EventObject();
			this.callback = sinon.spy();
			this.eo.addListener('test', this.callback, this);
			this.eo.addListener('test', this.callback, this);
		});
		
		test('Should trigger selected event', function() {
			this.eo.fire('test');
			assert(this.callback.calledTwice);
		});
		
		test('Should keep scope', function() {
			this.eo.fire('test');
			assert(this.callback.calledOn(this));
		});
	});
});
