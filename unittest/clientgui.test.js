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

suite("ClientGui:", function() {
	var sut;
	var stuckKeysHandler;
	var inputmanager;
	var clipBoardDataParser;

	setup(function() {
		stuckKeysHandler = new wdi.StuckKeysHandler();
		inputmanager = {
			manageChar: function() {},
			getValue: function() {},
			enable: function() {},
			disable: function() {},
			setCurrentWindow: function() {},
			isSpecialKey: function() {}
		};
		clipBoardDataParser = {};
		var localClipboard = {};
		sut = new wdi.ClientGui({stuckKeysHandler: stuckKeysHandler, inputManager: inputmanager, clipBoardDataParser: clipBoardDataParser,
			localClipboard: localClipboard});
	});

	test('releaseAllKeys calls stuckKeysHandler.releaseAllKeys', sinon.test(function() {
		this.mock(stuckKeysHandler)
			.expects('releaseAllKeys')
			.once()
			.withExactArgs();
		sut.releaseAllKeys();
	}));

	test('fillSubCanvas called with filterPosition will call to CollisionDetector thereIsBoxCollition', sinon.test(function() {
		addFakeMainCanvas();
		addFakeSubCanvas(0, 0, 0, 100, 100);
		configureDrawSubCanvasAsStub(this);
		var filterPosition = {
			top:0,
			left:50,
			right:100,
			bottom:100
		};
		this.mock(wdi.CollisionDetector).expects("thereIsBoxCollision").once().withExactArgs({
			top:0,
			left:0,
			right:100,
			bottom:100
		}, filterPosition);
		sut.fillSubCanvas(filterPosition);
	}));


	test('fillSubCanvas called with filterPosition and position collides with subcanvas will call to drawSubCanvas with correct data', sinon.test(function() {
		var mainCanvas = addFakeMainCanvas();
		var subCanvas = addFakeSubCanvas(0,0,100,100);
		configureCollisionDetectorAsStub(this,true);
		this.mock(sut).expects('_doDrawSubCanvas').once().withExactArgs(mainCanvas, subCanvas, subCanvas.info);
		sut.fillSubCanvas();
	}));

	test('fillSubCanvas called with filterPosition and position collides with subcanvas will not call to drawSubCanvas', sinon.test(function(){
		addFakeMainCanvas();
		addFakeSubCanvas(0,0,100,100);
		configureCollisionDetectorAsStub(this,false);
		this.mock(sut).expects('_doDrawSubCanvas').never();
		sut.fillSubCanvas({top:500,left:500,botton:600,right:600});
	}));


	var configureCollisionDetectorAsStub = function(self, thereIsCollision) {
		self.stub(wdi.CollisionDetector, "thereIsBoxCollision", function(){
			return thereIsCollision;
		});
	};

	var configureDrawSubCanvasAsStub = function(self) {
		self.stub(sut, "_doDrawSubCanvas", function(){});
	};

	var addFakeMainCanvas = function() {
		var mainCanvas = constructFakeCanvas(0, 0, 1024, 768);
		sut.canvas[0] = mainCanvas;
		return mainCanvas;
	};

	var addFakeSubCanvas = function(id, top, left, width, height) {
		var subCanvas = constructFakeCanvas(top, left, width, height);
		sut.subCanvas[id] = subCanvas;
		return subCanvas;
	};

	var constructFakeWindow = function(top, left, width, height) {
		return {
			top: top,
			left: left,
			width: width,
			height: height
		}
	};

	var constructFakeCanvas = function(top, left, width, height) {
		return {
			info: constructFakeWindow(top, left, width, height)
		};
	};

	suite('#generateEvent', function () {
		var event = 'keyEvent';
		var keyCode = 'fake keyCode';
		var params = [ { keyCode: keyCode } ];

		function execute () {
			sut.generateEvent(event, params);
		}

		test('Should get the value of the input when is a key event', sinon.test(function () {
			this.stub(inputmanager, 'manageChar');
			this.mock(inputmanager)
				.expects('getValue')
				.once()
				.withExactArgs()
				.returns("a");
			execute();
		}));

		test('Should avoid firing an event if the key code does not generate a key event', sinon.test(function() {
			this.stub(inputmanager, 'isSpecialKey')
				.returns(true);
			this.mock(sut)
				.expects('fire')
				.never();
			execute();
		}));

		test('Should manage the params of the event when there is a value with length = 1 and is a key event', sinon.test(function () {
			this.stub(inputmanager, 'getValue').returns('a');
			this.mock(inputmanager)
				.expects('manageChar')
				.once()
				.withExactArgs('a', params);
			execute();
		}));

		test('Should not manage the params when there is no value when is a key event', sinon.test(function () {
			this.stub(inputmanager, 'getValue').returns("");
			this.mock(inputmanager)
				.expects('manageChar')
				.never();
			execute();
		}));

		test('Should check if a special key has been pressed when is a key event', sinon.test(function () {
			this.stub(inputmanager, 'getValue').returns("");
			this.mock(stuckKeysHandler)
				.expects('checkSpecialKey')
				.once()
				.withExactArgs(event, keyCode);
			execute();
		}));
	});

	suite('#disableKeyboard', function () {
		test('Should call to inputManager.disable', sinon.test(function () {
			this.mock(inputmanager)
				.expects('disable')
				.once()
				.withExactArgs();
			sut.disableKeyboard();
		}));
	});

	suite('#enableKeyboard', function () {
		test('Should call to inputManager.enable', sinon.test(function () {
			this.mock(inputmanager)
				.expects('enable')
				.once()
				.withExactArgs();
			sut.enableKeyboard();
		}));
	});

});
