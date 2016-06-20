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

require("long-stack-traces");
var fs=require("fs");
_ = require("../lib/lodash.4.0.0.min");
window = null;
suite("tests suite", function () {
	test("define suites", function (done) {
		this.timeout(15000);
		var jsdom = require("jsdom");
		jsdom.env(
			"some.html",
			[],
			function (errors, domWindow) {

				function fakeWorkerProcess() {
					window.self = domWindow;
					window.workerDispatch = function () {
					};
				}

				//region fakes
				window = domWindow;
				document = window.document;
				fakeWorkerProcess();
				Modernizr = {};
				Modernizr['websocketsbinary'] = true;
				WebSocket = require("websocket").client;

				//endregion fakes

				//region test-environment
				sinon = require("sinon");
				assert = require("chai").assert;

				require("../lib/base64"),
				Canvas = require('canvas'),
				Image = Canvas.Image,
				BigInteger = require("../lib/biginteger").BigInteger,
				window.$=require("../lib/jquery-2.0.3"),
				window.bowser = require("../lib/bowser"),
				require("../lib/virtualjoystick"),
				require("../lib/utils"),
				require("../lib/CollisionDetector.js"),
				require("../lib/GlobalPool"),
				require("../lib/GenericObjectPool"),
				require("../spiceobjects/spiceobjects"),
				require("../spiceobjects/generated/protocol"),
				require("../lib/graphicdebug"),
				require("../lib/images/lz"),
				require("../lib/images/bitmap"),
				require("../lib/images/png"),
				require("../lib/runqueue"),
				require("../lib/queue"),
				require("../lib/ImageUncompressor"),
				require("../lib/SyncAsyncHandler"),
				require("../lib/stuckkeyshandler"),
				require("../lib/timelapsedetector"),
				require("../lib/displayRouter"),
				require("../lib/rasterEngine"),
				require("../lib/DataLogger"),
				require("../network/socket"),
				require("../network/socketqueue"),
				require("../network/packetlinkfactory"),
				require("../network/packetcontroller"),
				require("../network/packetextractor"),
				require("../network/packetreassembler"),
				require("../network/reassemblerfactory"),
				require("../network/sizedefiner"),
				require("../network/packetlinkfactory"),
				require("../network/spicechannel"),
				require("../network/busconnection"),
				require("../network/clusternodechooser"),
				require("../network/websocketwrapper"),
				require("../network/connectioncontrol"),
				require("../application/agent"),
				require("../application/clipboard"),
				require("../application/clipboard/clipboarddataparser"),
				require("../application/spiceconnection"),
				require("../application/spiceconnection"),
				require("../application/clientgui"),
				require("../application/packetprocess"),
				require("../application/packetfilter"),
				require("../application/packetfactory"),
				require("../application/application"),
				require("../application/virtualmouse"),
				require("../application/imagecache"),
				require("../application/rasteroperation"),
				require("../application/stream"),
				require("../application/inputmanager"),
				require("../process/displayprocess"),
				require("../process/displaypreprocess"),
				require("../process/inputprocess"),
				require("../process/cursorprocess"),
				require("../process/mainprocess"),
				require("../process/busprocess"),
				require("../keymaps/keymapes"),
				require("../keymaps/keymapesObj"),
				require("../keymaps/keymapus"),
				require("../keymaps/keymap"),
				require("../testlibs/fakewebsocket"),
				require("../node_modules/mocha/mocha");


				wdi.GlobalPool.createCanvas = function () {
					return new Canvas(200, 200);
				}

				var files = fs.readdirSync(__dirname);
				_.each(files, function(item) {
					if (!item.match(/\.test\.js/g)||item.match(/graphic.*test/g)) {
						return;
					}
					require("./"+item.slice(0, -3));
				});
				wdi.exceptionHandling = false;
				wdi.GlobalPool.init();
				//endregion test-environment
				done();
			}
		);
	});
});
