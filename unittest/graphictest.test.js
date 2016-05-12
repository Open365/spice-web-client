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

suite('GraphicTest', function() {
	var clientGui, displayPreProcess;

	this.timeout(2000);
	
	setup(function() {
		wdi.Debug.debug = false;
		clientGui = new wdi.ClientGui();
		displayPreProcess = new wdi.DisplayPreProcess({
			clientGui: clientGui
		});
	});

	wdi.graphicTestUris.forEach(function (item) {
		test(item.split('/').pop(), function(done) {
			$.get(item).done(function(data) {
				data = JSON.parse(data);
				var testFunction = function() {
					clientGui.getCanvas = function() {
						return ctxOrigin.canvas;
					};
					clientGui.getContext = function() {
						return ctxOrigin;
					};
					displayPreProcess.displayProcess.postProcess = function() {
						assert.equal(ctxOrigin.canvas.toDataURL('image/png'), ctxExpected.canvas.toDataURL('image/png'), 'The image is not the same as expected');
						done();
					};
					var rawSpiceMessage = JSON.parse(data.object);
					// Depending on the browser version JSON.stringify stores typed arrays attributes or not
					// We are interested on length, so if it is not there we create it.
					if (typeof rawSpiceMessage.body.q.length === "undefined") {
						rawSpiceMessage.body.q.length = Object.keys(rawSpiceMessage.body.q).length;
					}
					var queue = new wdi.ViewQueue();
					queue.setData(rawSpiceMessage.body.q);
					rawSpiceMessage.body = queue;
					displayPreProcess.process(wdi.PacketFactory.extract(rawSpiceMessage));
				};
				var aux = false;
				var ctxOrigin = $('<canvas/>')[0].getContext('2d');
				var imgOrigin = new Image();
				imgOrigin.onload = function() {
					ctxOrigin.drawImage(imgOrigin, 0, 0);
					if (aux)
						testFunction();
					else 
						aux = true;
				};
				imgOrigin.src = data.origin.replace(/\s/g, '+');
				var ctxExpected = $('<canvas/>')[0].getContext('2d');
				var imgExpected = new Image();
				imgExpected.onload = function() {
					ctxExpected.drawImage(imgExpected, 0, 0);
					if (aux)
						testFunction();
					else 
						aux = true;
				};
				imgExpected.src = data.expected.replace(/\s/g, '+');
			});
		});
	});
});
