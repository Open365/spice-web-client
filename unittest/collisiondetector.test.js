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

suite('CollisionDetector', function() {

	var testData = [
		{
			base:{
				top:0,
				left:0,
				right:3,
				bottom:3
			},
			queue:{
				top:0,
				left:2,
				right:4,
				bottom:2
			},
			collides:true
		},
		{
			base:{
				top:0,
				left:0,
				right:5,
				bottom:5
			},
			queue:{
				top:3,
				left:-3,
				right:3,
				bottom:6
			},
			collides:true
		},
		{
			base:{
				top:0,
				left:0,
				right:5,
				bottom:5
			},
			queue:{
				top:3,
				left:6,
				right:8,
				bottom:4
			},
			collides:false
		}
	];
	var thereIsBoxCollision = function(){
		var data = thereIsBoxCollision.data;
		var actual = wdi.CollisionDetector.thereIsBoxCollision(data.base, data.queue);
		assert.equal(data.collides, actual);
	};
	thereIsBoxCollision.data = null;
	var setCounter=0;
	for(var i=0; i < testData.length; i++) {
		thereIsBoxCollision.data = testData[i];
		test('thereIsBoxCollision will return correctData with set '+setCounter, thereIsBoxCollision);
		setCounter++;
	}

});
