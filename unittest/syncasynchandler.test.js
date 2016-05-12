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

suite('syncasynchandler', function () {
	var sut;
	var callbackWrapper;
	var asyncWorker;
	var scope;

	setup(function() {
		asyncWorker = {
			run: function () {}
		};

		var isAsync = true;

		asyncSut = new wdi.SyncAsyncHandler({
			asyncWorker: asyncWorker,
			isAsync: isAsync
		});


		syncSut = new wdi.SyncAsyncHandler({
			isAsync: !isAsync
		});

		callbackWrapper = {
			callback: function () {}
		};

		scope = {};
	});

	teardown(function () {

	});

	test('dispatch calls workerProcess dispatch when sync', sinon.test(function() {
		var stub = this.stub(window, 'workerDispatch');
		var buffer = 'one buffer';
		syncSut.dispatch(buffer, callbackWrapper.callback, scope);

		var isAsync = false;

		sinon.assert.calledWithExactly(stub, buffer, isAsync);
	}));

	test('dispatch calls callback with dispatch result when sync', sinon.test(function() {
		var resultFromDispatch = 'some result';
		var stub = this.stub(window, 'workerDispatch').returns(resultFromDispatch);
		var buffer = 'one buffer';
		var callbackStub = sinon.stub();
		syncSut.dispatch(buffer, callbackStub, scope);

		sinon.assert.calledWithExactly(callbackStub, resultFromDispatch);
	}));

	test('dispatch calls AsyncWorker dispatch when async', sinon.test(function() {
		var stub = this.stub(asyncWorker, 'run');
		var buffer = 'one buffer';
		asyncSut.dispatch(buffer, callbackWrapper.callback, scope);

		sinon.assert.calledWithExactly(stub, buffer, callbackWrapper.callback, scope);
	}));
});
