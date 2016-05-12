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

suite('RunQueue', function() {
	setup(function(){
		wdi.Debug.debug = false; //disable debugging, it slows tests
	});
	
	suite('#getTasksLength()', function() {
		test('Should return 0 for empty runqueue', function() {
			this.rQ = new wdi.RunQueue();
			assert.strictEqual(this.rQ.getTasksLength(), 0);
		});
	});
	
	suite('#add()', function() {
		setup(function() {
			this.rQ = new wdi.RunQueue();
		});
		
		test('Should add single tasks', function() {
			this.rQ.add(function(){}, this);
			assert.equal(this.rQ.getTasksLength(), 1);
		});
		
		test('Should add two tasks', function() {
			this.rQ.add(function(){}, this);
			this.rQ.add(function(){}, this);
			assert.equal(this.rQ.getTasksLength(), 2);
		});
	});
	
	suite('#clear()', function() {
		setup(function() {
			this.rQ = new wdi.RunQueue();
			this.rQ.add(function(){}, this);
			this.rQ.add(function(){}, this);
		});
		
		test('Should clear all tasks', function() {
			this.rQ.clear();
			assert.equal(this.rQ.getTasksLength(), 0);
		});
	});
	
	suite('#process()', function() {
		setup(function() {
			this.rQ = new wdi.RunQueue();
		});
		
		test('Should call single tasks', function() {
			var object = {method: function(proxy){proxy.end();}};
			var spy = sinon.spy(object, 'method');
			this.rQ.add(object.method, object);
			this.rQ.process();
			assert(spy.calledOnce);
		});
		
		test('Should keep scope', function() {
			var object = {method: function(proxy){proxy.end();}};
			var spy = sinon.spy(object, 'method');
			this.rQ.add(object.method, object);
			this.rQ.process();
			assert(spy.calledOn(object));
		});
		
		test('Should call two syncronous tasks', function() {
			var object = {method: function(proxy){proxy.end()}};
			var spy = sinon.spy(object, 'method');
			this.rQ.add(object.method, object);
			this.rQ.add(object.method, object);
			this.rQ.process();
			assert(spy.calledTwice);
		});
		
		test('Should call asynchronous task', function(done) {
			var object = {method: function(proxy){
				setTimeout(function() {
					proxy.end();
					done();
				}, 100);
			}};
			this.rQ.add(object.method, object);
			this.rQ.process();
		});
		
		test('Should return nothing if there are no tasks', function() {
			var runqueue = this.rQ.process();
			assert.isUndefined(runqueue);
		});

		test('Should not run process if runqueue is running', function(done) {
			var object = {method: function(proxy){
				setTimeout(function() {
					done();
				}, 100);
			}};
			var object2 = {method: function(proxy){proxy.end()}};
			var spy = sinon.spy(object2, 'method');
			this.rQ.add(object.method, object);
			this.rQ.add(object2.method, object2);
			this.rQ.process();
			this.rQ.process();
			assert(!spy.called);
		});
	});
});
