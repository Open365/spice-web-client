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

suite('ViewQueue', function() {
  setup(function(){
	wdi.Debug.debug = false; //disable debugging, it slows tests
  });

  suite('#getLength()', function() {
  	
	test('Should return 0 for empty queue', function() {
		var q = new wdi.ViewQueue();
		assert.strictEqual(q.getLength(), 0);
	});
  });
  
  suite('#push()', function() {
  	setup(function() {
  		this.q = new wdi.ViewQueue();
  	});
  	
  	test('Should be able to add elements as string', function() {
  		this.q.push('hello');
  		assert.strictEqual(this.q.getLength(), 5);
  	});
  	
  	test('Should be able to add arrays', function() {
  		this.q.push([1,2,3,4,5]);
  		assert.strictEqual(this.q.getLength(), 5);
  	});
  	
  	test('Should be able to push multiple arrays', function() {
  		this.q.push([1,2,3,4,5]);
  		this.q.push([1,2,3,4,5]);
  		assert.strictEqual(this.q.getLength(), 10);
  	});
  });
  
  suite('#shift()', function() {
  	setup(function() {
  		this.q = new wdi.ViewQueue();
  		this.q.push([1,2,3,4,5]);
  	});
  	
  	test('Should allways return array', function() {
  		var element = this.q.shift(1);
  		assert.isArray(element);
  	});
  	
  	test('Should read parts of the queue', function() {
  		var elements = this.q.shift(2);
  		assert.deepEqual(elements, [1,2]);
  	});
  	
  	test('Should read all the queue', function() {
  		var elements = this.q.shift(5);
  		assert.deepEqual(elements, [1,2,3,4,5]);
  	});
  	
  	test('Should empty all the queue', function() {
  		var elements = this.q.shift(5);
  		assert.strictEqual(this.q.getLength(), 0);
  	});
  	
  	test('Should empty parts of the queue', function() {
  		var elements = this.q.shift(2);
  		assert.strictEqual(this.q.getLength(), 3);
  	});
  });
  
  suite('#peek()', function() {
  	setup(function() {
  		this.q = new wdi.ViewQueue();
  		this.q.push([1,2,3,4,5]);
  	});
  	
  	test('Should read a single element', function() {
  		var element = this.q.peek(0, 1);
  		assert.deepEqual(element, [1]);
  	});
  	
  	test('Should read 3 elements of the queue', function() {
  		var elements = this.q.peek(1, 4);
  		assert.deepEqual(elements, [2,3,4]);
  	});
  	
  	test('Should read all the elements of the queue', function() {
  		var elements = this.q.peek(0);
  		assert.deepEqual(elements, [1,2,3,4,5]);
  	});
  	
  	test('Should be immutable', function() {
  		this.q.peek(1, 4);
  		assert.strictEqual(this.q.getLength(), 5);
  	});
  });
});
